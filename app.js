const express = require('express');
const app = express();
const path = require('path');
const server = app.listen(3000, () => {
  console.log('Listening on port %d', server.address().port);
});

const io = require('socket.io')(server);

const five = require('johnny-five');
const board = new five.Board();

const ledPins = [9, 11, 13];
const leds = {};

let boardIsReady = false;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const createLead = (ledPin) => (leds[`led${ledPin}`] = new five.Pin(ledPin));
const queryLead = (ledPin) => leds[`led${ledPin}`].query((state) => {
  io.emit('changeLed', {
    led: `led${ledPin}`,
    state: state.value
  });
});

board.on('ready', () => {
  boardIsReady = true;

  io.emit('statusBoard', boardIsReady);

  ledPins.forEach(createLead);
});

io.on('connection', (socket) => {
  io.emit('statusBoard', boardIsReady);

  if (!boardIsReady) {
    return false;
  }

  ledPins.forEach(queryLead);

  socket.on('led', (data) => {
    if (!boardIsReady) {
      return false;
    }

    io.emit('changeLed', data);

    if (data.state) {
      return leds[data.led].high();
    }

    leds[data.led].low();
  });
});
