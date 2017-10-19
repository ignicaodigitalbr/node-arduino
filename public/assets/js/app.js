(function() {
  const checkboxes = document.querySelectorAll('.js-check');
  const socket = io();

  socket.on('statusBoard', (boardIsReady) => {
    if (!boardIsReady) {
      return false;
    }

    Array.from(checkboxes).forEach((checkbox) => {
      checkbox.removeAttribute('disabled');

      checkbox.addEventListener('click', function() {
        const state = this.checked;
        const led = this.id;

        socket.emit('led', { state, led });
      });
    });
  });

  socket.on('changeLed', (data) => {
    const checkbox = document.getElementById(data.led);

    if (data.state) {
      return checkbox.setAttribute('checked', true);
    }

    checkbox.removeAttribute('checked');
  });
})();
