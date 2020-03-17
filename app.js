var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/api/index');
var signUp = require('./routes/api/signUp');
var login = require('./routes/api/login');
var user = require('./routes/api/users')
const mongoose = require("mongoose");

var app = express();

// view engine setup
// require('dotenv').config()

// app.engine('html', require('ejs').renderFile);

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/signup', signUp);
app.use('/api/login', login);
app.use('/api/users', user);

// mongoose uri

const db =  "mongodb+srv://Mega:mega12345@cluster0-nof7e.mongodb.net/test?retryWrites=true&w=majority";

// Connect to mongoose
console.log(db)

mongoose
  .connect(db, 
    {
      useNewUrlParser : true,
      useCreateIndex : true,
      useUnifiedTopology: true 

    })
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

// catch 404 and forward to error handler

app.set("port", process.env.PORT || 3200);
const server = app.listen(app.get("port"), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

module.exports = app;
