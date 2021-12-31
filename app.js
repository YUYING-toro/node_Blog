var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var dashboardRouter = require('./routes/dashboard');  
// var auth = require('./routes/auth');
// require('dotenv').config();
  //提取路徑 25  連結url 與動作路徑 > 在dashboard.js 即可 router.get('/categories', function(~~
  //categories delete 顯示資訊
var flash = require('connect-flash');
var session = require('express-session')

var app = express();

//防錯誤 obj.hasOwnProperty is not a function 在 caregories/ create
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('express-ejs-extend')); // repeated header parts 同 layout('header')
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//line 11,12
app.use( session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 100*1000 }
}));
app.use(flash());

// const authCheck = function (req,res,next){
//   console.log('middleware app.js 43', req.session);
//   if(req.session.uid === process.env.ADMIN_UID){
//     return next();
//   }
//   return res.redirect('/auth/signin');
// }

//建立 url 與 js 動作關係
app.use('/', indexRouter); //line 7
app.use('/dashboard', dashboardRouter);  //即不用 dashboard.js router.get('/dashboard/categories', function(
// app.use('/auth',auth);
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
  res.render('error',{
    title: '沒有此文',
  });
});

module.exports = app;
