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
var currentStates = [];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendfile('index.html');
});

board.on('ready', function () {
  boardIsReady = true;

  io.emit('statusBoard', boardIsReady);

  leds.led7 = new five.Pin(7);
  leds.led9 = new five.Pin(9);
  leds.led11 = new five.Pin(11);
  leds.led13 = new five.Pin(13);
});

io.on('connection', function (socket) {
  io.emit('statusBoard', boardIsReady);

  if (boardIsReady) {
    leds.led7.high();

    leds.led9.query(function (state) {
      io.emit('changeLed', {
        led: 'led9',
        state: state.value
      });
    });

    leds.led11.query(function (state) {
      io.emit('changeLed', {
        led: 'led11',
        state: state.value
      });
    });

    leds.led13.query(function (state) {
      io.emit('changeLed', {
        led: 'led13',
        state: state.value
      });
    });
  }

  socket.on('led', function (data) {
    if (boardIsReady) {
      if (data.state) {
        leds[data.led].high();
      }
      else {
        leds[data.led].low();
      }

      io.emit('changeLed', data);
    }
  });
});
