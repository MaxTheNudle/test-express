var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var paymentRouter = require('./routes/product');
var customeRouter = require('./routes/customer');
var collectionOrderRouter = require('./routes/collectionorder');
var IncomeAndExpensesRouter = require('./routes/IncomeAndExpenses');
var DashboardRouter = require('./routes/dashboard');
const mongoose = require('mongoose')

var app = express();

const MONGO_URI = "mongodb+srv://watjakonjantra:CpEQjBe2O1ORFisf@mytestmondomax.6aobj.mongodb.net/?retryWrites=true&w=majority&appName=MyTestMondoMax"

mongoose
  .connect(MONGO_URI, { dbName: "MyTestDB"})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/Customer', customeRouter);
app.use('/Product', paymentRouter);
app.use('/CollectionOrder', collectionOrderRouter);
app.use('/IncomeAndExpenses', IncomeAndExpensesRouter);
app.use('/Dashboard', DashboardRouter);

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
