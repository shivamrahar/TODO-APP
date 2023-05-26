const express = require('express');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const router = require('./router')
const cors = require('cors');
var cookieParser = require('cookie-parser')


const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser())
mongoose.connect('mongodb://127.0.0.1:27017/todo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Encountered error'));
db.once('open', () => {
  console.log('Mongoose connection successful');
});

app.use(router)

app.listen(4000, () => {
  console.log('Server listening on port 4000');
});

module.exports = app;
