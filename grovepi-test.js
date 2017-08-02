
// LEDをチカチカさせたい
var GrovePi = require('node-grovepi').GrovePi
  , led;

var board = new GrovePi.board({
    debug: true,
    onError: function(err) {
      console.log('Something wrong just happened');
      console.log(err);
    },
    onInit: function(res) {
      if (!res) return;
      console.log('GrovePi Version : ' + board.version());
      led = new GrovePi.sensors.DigitalOutput(2);
      var on = false;
      setInterval(function () {
        if (on) led.turnOff();
        else led.turnOn();
        on = !on;
        console.log(on);
      }, 500);
    }
  });
board.init();
