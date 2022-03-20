/*var express = require('express')
const http = require("http");
var app = express();
const server = http.createServer(app);

const socketIo = require("socket.io")(server, {
    cors: {
        origin: "*",
    }
  }); 
  //Thêm cors để tránh exception


socketIo.on("connection", (socket) => { ///Handle khi có connect từ client tới
  console.log("New client connected" + socket.id); 

  socket.on("sendDataClient", function(data) { // Handle khi có sự kiện tên là sendDataClient từ phía client
    socketIo.emit("sendDataServer", { data });// phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
  });
});

server.listen(3000, () => {
    console.log('Server đang chay tren cong 3000');
});*/
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

var authen_author = require('./routes/authen.rootes'); 
var kolsRouter = require('./routes/kols.routes'); 
var brandRouter = require('./routes/brands.routes'); 
var postRouter = require('./routes/posts.routes'); 

const AuthMiddleWare = require("./middleware/auth_middleware");
const { DOMAIN_FE } = require('./config/const.config')
const https_or_not = DOMAIN_FE[4]=='s'? 'https' : 'http';

var app = express();

console.log('process.env.PORT', process.env.PORT);
// const io_router = require('./socket/index')(io);
// app.use(io_router);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(cors({
//   credentials: true, 
//   origin: DOMAIN_FE.substring(0, DOMAIN_FE.length - 1)
// }));
app.use(cors());

app.use('/', authen_author);
app.use(AuthMiddleWare.isAuthor);
app.use('/kols', kolsRouter);
app.use('/brands', brandRouter);
app.use('/posts', postRouter);
/*app.use('/classes', classesRouter);
app.use('/admins', AuthMiddleWare.isAdmin, adminsRouter);*/

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
