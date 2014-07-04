var express = require('express');
var app = express();
var path = require('path');
var server = app.listen(3000, function () {
  console.log('Listening on port %d', server.address().port);
});

var io = require('socket.io')(server);

var five = require('johnny-five');
var board = new five.Board();

var boardIsReady = false;
var leds = {};

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendfile('index.html');
});

board.on('ready', function () {
  boardIsReady = true;

  io.emit('statusBoard', boardIsReady);

  leds.led9 = new five.Led(9);
  leds.led11 = new five.Led(11);
  leds.led13 = new five.Led(13);
});

io.on('connection', function (socket) {
  io.emit('statusBoard', boardIsReady);

  socket.on('led', function (led) {
    if (boardIsReady) {
      leds[led].toggle();
    }
  });
});
