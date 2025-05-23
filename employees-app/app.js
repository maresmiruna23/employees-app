var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var employeesRouter=require('./routes/employees');
var departmentsRouter = require('./routes/departments');
var positionsRouter=require('./routes/positions');
var reviewsRouter=require('./routes/performances');
var locationsRouter=require('./routes/locations');
var benefitsRouter=require('./routes/benefits');
require('dotenv').config();

var app = express();

app.listen(3001, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/employees', employeesRouter);
app.use('/departments', departmentsRouter);
app.use('/positions', positionsRouter);
app.use('/reviews', reviewsRouter);
app.use('/locations', locationsRouter);
app.use('/benefits', benefitsRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

