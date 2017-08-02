// LEDをチカチカさせたい
var GrovePi = require('node-grovepi').GrovePi, led, fdd, initialized = false, paused = true;
var board = new GrovePi.board({
    debug: true,
    onError: function (err) {
        console.log('Something wrong just happened');
        console.log(err);
    },
    onInit: function (res) {
        if (!res)
            return;
        var version = board.version();
        console.log('GrovePi Version : ' + version);
        if (!version) {
            console.log('GrovePi is not connected.');
            process.exit(1);
        }
        led = new GrovePi.sensors.DigitalOutput(2);
        fdd = new GrovePi.sensors.FourDigitDigital(4);
        fdd.init();
        fdd.setBrightness(8);
        initialized = true;
    }
});
board.init();
var SW = require("songle-widget");
// トークンの情報を取ってくる
var settings = require("./settings");
// ビート情報と基本情報をもらってくる
var player = new SW.Player({
    accessToken: settings.tokens.access
});
player.addPlugin(new SW.Plugin.Beat());
// player.addPlugin(new SongleWidget.Plugin.Chord());
// player.addPlugin(new SongleWidget.Plugin.Melody());
// player.addPlugin(new SongleWidget.Plugin.Chorus());
player.addPlugin(new SW.Plugin.SongleSync());
// 何かあったらコンソールに書き出す
player.on("play", function (ev) {
    console.log("play");
    paused = false;
});
player.on("seek", function (ev) { return console.log("seek"); });
// 曲が止まったらLED消灯
player.on("pause", function (ev) {
    console.log("pause");
    if (initialized) {
        led.turnOff();
        fdd.off();
    }
    on = false;
    paused = true;
});
// 曲が止まったらLED消灯
player.on("finish", function (ev) {
    console.log("finish");
    if (initialized) {
        led.turnOff();
        fdd.off();
    }
    on = false;
    paused = true;
});
// ビートごとにLED点滅
var on = false;
player.on("beatEnter", function (ev) {
    console.log("beat:", ev.data.beat.position);
    if (initialized) {
        if (on)
            led.turnOff();
        else
            led.turnOn();
    }
    on = !on;
});
// 死なないようにする & 秒数をアップデート
setInterval(function () {
    if (initialized && player && !paused) {
        var position = Math.round(player.position) / 1000;
        fdd.setScore(position / 60, position % 60);
    }
}, 250);
process.on('SIGTERM', function () {
    if (initialized) {
        led.turnOff();
        fdd.off();
    }
});
