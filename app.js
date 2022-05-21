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
var fs = require('fs');
const cors = require('cors');
const { Server } =  require("socket.io");
const mySocket =  require("./socket/socket") ;
const http = require("http");

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

const AuthMiddleWare = require("./middleware/auth_middleware");
const { DOMAIN_FE } = require('./config/const.config')
const https_or_not = DOMAIN_FE[4]=='s'? 'https' : 'http';

var app = express();
const server = new http.Server(app);

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

//Init io
/*const io = new Server(server, {
  cors: {
      origin: '*',
  }
});

//require socket
mySocket(io);

//set io for app
app.set("io", io);*/

app.use(express.static(path.join(__dirname, 'public'))); //FE show ảnh src="localhost://3000/public/images/posts/name.jpg"

// app.use(cors({
//   credentials: true, 
//   origin: DOMAIN_FE.substring(0, DOMAIN_FE.length - 1)
// }));
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

if (!fs.existsSync("./public/images/posts")) {
  fs.mkdirSync("./public/images/posts");
}
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
