const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();

const { getAsync, setAsync } = require('../redis/index')

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  console.log("Created new todo, incrementing counter")
  const addedTodosOrNull = await getAsync("added_todos")
  const addedTodosOrZero = addedTodosOrNull ? Number(addedTodosOrNull) : 0
  const result = await setAsync("added_todos", addedTodosOrZero + 1)
  console.log("Set result ->", result)
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  if(!req.todo) return res.sendStatus(404)
  res.send(req.todo)
});

/* PUT todo. */
// TODO: Fix middleware throwing 404, I can't be bothered
// TODO: Add to counter here too
singleRouter.put('/', async (req, res) => {
  const { id } = req.params
  if(!Todo.exists({_id: id})) {
    const todo = await Todo.create({
      text: req.body.text,
      done: false
    })
    res.send(todo);
  }
  const todo = await Todo.findByIdAndUpdate(id, {
    text: req.body.text,
    done: req.body.done ? req.body.done : false
  }, {new: true})
  res.send(todo);
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
