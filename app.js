
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
//const { Server } =  require("socket.io");
//const mySocket =  require("./socket/socket") ;
const http = require("http");
//const CronJob = require('node-cron');

require('dotenv').config();

var authen_author = require('./routes/authen.rootes'); 
var searchRouter = require('./routes/search.routes'); 
var kolsRouter = require('./routes/kols.routes'); 
var brandRouter = require('./routes/brands.routes'); 
var postRouter = require('./routes/posts.routes'); 
var cateRouter = require('./routes/categories.routes'); 
var messRouter = require('./routes/message.routes');
var recruitRouter = require('./routes/recruitment.routes');
var cardkolRouter = require('./routes/cardkols.routes');
var jobRouter = require('./routes/job.routes');
var notiRouter = require('./routes/notifications.routes');
var socialRouter = require('./routes/socialsupport.routes');
var statisticRouter = require('./routes/statistic.routes');
var adminRouter = require('./routes/admins.routes');

const AuthMiddleWare = require("./middleware/auth_middleware");
const { DOMAIN_FE } = require('./config/const.config')
const https_or_not = DOMAIN_FE[4]=='s'? 'https' : 'http';

var app = express();
const server = new http.Server(app);

console.log('process.env.PORT', process.env.PORT);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public'))); //FE show ảnh src="localhost://3000/public/images/posts/name.jpg"

app.use(cors());

app.use('/', authen_author);
app.use('/search', searchRouter);
app.use('/categories', cateRouter);
app.use(AuthMiddleWare.isAuthor);
app.use('/kols', kolsRouter);
app.use('/message', messRouter);
app.use('/posts', postRouter);
app.use('/recruitments', recruitRouter);
app.use('/cardkols', cardkolRouter);
app.use('/jobs', jobRouter);
app.use('/notifications', notiRouter);
app.use('/social', socialRouter);
app.use('/statistic', statisticRouter);
app.use('/admins', adminRouter);

//app.use(AuthMiddleWare.isBrand);
app.use('/brands', brandRouter);

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
server.listen(process.env.PORT, () => {
  console.log(`Server is listening at PORT ${process.env.PORT}`);
});

let io = require('socket.io')(server);

// initialize my socketio module and pass it the io instance
require('./socket/socket')(io);
//cron.schedule('00 00 00 * *', () => {console.log("Task is running every minute " + new Date())});
/*const job1 = new CronJob('00 00 00 * * *', function() {
	const d = new Date();
	console.log('Midnight:', d);
});
const job2 = new CronJob('00 30 11 * * *', function() {
	const d = new Date();
	console.log('buoi trua:', d);
});
job1.start();
job2.start();*/