let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let fs = require('fs');
let index = require('./routes/index');
let users = require('./routes/users');
let myserver = require("./server_src/my_server");
let log = require('log-to-file-and-console-node');

process.env.LOG_DIR='/data/linux_projects/js/tweet_scheduler/logs';

let app = express();


app.use(logger('combined', {'stream': log.stream}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit:"50mb", extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

myserver(app);

app.use('/', index);
app.use('/users', users);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  console.log(err);
});

let port = 3000;
app.listen(3000);

log.e("    Listening on port "+port);


module.exports = app;
