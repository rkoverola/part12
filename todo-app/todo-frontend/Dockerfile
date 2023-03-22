FROM node:16

WORKDIR /usr/src/app
ENV REACT_APP_BACKEND_URL=http://localhost:3000
ENV PORT=3005

COPY . .

RUN npm ci
RUN npm run build
CMD npm start

