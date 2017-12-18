const express = require('express');
const debug = require('debug')('backend:server');
const logger = require('morgan');

const http = require("http");
const socketIo = require("socket.io");
const Moniker = require('moniker');

const index = require('./routes/index');

const app = express();
const port = normalizePort(process.env.PORT || '8000');

app.set('port', port);
app.use(logger('dev'));

app.use('/', index);

const server = http.createServer(app);

const io = socketIo(server);

const nameGen = Moniker.generator([Moniker.adjective, Moniker.noun]);

var _users = new Map();

// User
let getUser = (id) => {
  let nickname = _users.get(id);

  if (!nickname) {
    nickname  = nameGen.choose();
    let count = 0;

    for (let name of _users.values()) {
      if (name === nickname) {
        count += 1;
      }
    }

    if (count !== 0) {
      nickname += ` (${count})`;
    }

    _users.set(id, nickname);
  }

  return nickname;
};
// ===================================

// connection event
io.on('connection', function(socket) {  
  console.log("A user is connected");

  socket.username = getUser(socket.id);
  
  socket.emit('notify_user', socket.username);
  socket.broadcast.emit('user_connected', socket.username);

  // disconnect event
  socket.on('disconnect', () => {
    socket.broadcast.emit('user disconnected', socket.username);
  });

  // chat message event
  socket.on('chat_message', (params) => {
    let timestamp = (new Date()).toISOString();

    io.emit('chat_message', {
      nickname: socket.username,
      message: params.message,
      time: timestamp
    });
  });

  // user typing event
  socket.on('user_typing', (isTyping) => {
    console.log('User is typing');
    if (isTyping === true) {
      socket.broadcast.emit('user_typing', {
        nickname: socket.username,
        isTyping: true
      });
    } else {
      socket.broadcast.emit('user_typing', {
        nickname: socket.username,
        isTyping: false
      });
    }
  });
});
// ===================================

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
});

server.listen(port, () => console.log(`Listening on port ${port}`));
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
// var favicon = require('serve-favicon');
// var path = require('path');
/**
 * view engine setup
 */
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
/**
 * =================
 */
