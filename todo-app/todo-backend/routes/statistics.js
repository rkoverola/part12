const express = require('express');
const router = express.Router();

const { getAsync, setAsync } = require('../redis/index')

router.get('/', async (req, res) => {
  console.log("Requesting stats from redis")
  const addedTodosOrNull = await getAsync("added_todos")
  const addedTodosOrZero = addedTodosOrNull ? Number(addedTodosOrNull) : 0
  console.log("Got ->", addedTodosOrZero)
  res.send({
    "added_todos": addedTodosOrZero
  });
});

module.exports = router;