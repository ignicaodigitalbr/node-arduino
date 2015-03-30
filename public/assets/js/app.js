(function($) {
  'use strict';

  var socket = io();
  var $check = $('.js-check');

  socket.on('statusBoard', function (data) {
    // Se a `board` estiver pronta
    if (data) {

      // Desabilita os `checkbox` para que o usuário
      // possa interagir com os leds
      $check.prop('disabled', false);

      // Quando o usuário clicar em um checkbox
      // envia o ID do LED para ser alterado
      // e o status [true | false]
      $check.on('click', function() {

        socket.emit('led', {
          led: this.id,
          state: this.checked
        });

      });

    }
  });

  // Altera a propriedade `checked` a cada alteração
  // de status dos LEDs por cada usuário
  socket.on('changeLed', function (data) {
    $('#' + data.led).prop('checked', data.state);
  });

})(jQuery);
