// LEDをチカチカさせたい
var gpio = require("gpio");
var Led = /** @class */ (function () {
    function Led(gpio) {
        this.gpio16 = gpio["export"](16, {
            direction: "in",
            ready: function () { }
        });
    }
    Led.prototype.turnOn = function () {
        this.gpio16.set(1);
    };
    Led.prototype.turnOff = function () {
        this.gpio16.set(0);
    };
    return Led;
}());
var led = new Led(gpio);
var initialized = false;
var paused = true;
var SW = require("songle-api");
// トークンの情報を取ってくる
var settings = require("./settings");
// ビート情報と基本情報をもらってくる
var player = new SW.Player({
    accessToken: settings.tokens.access
});
player.addPlugin(new SW.Plugin.Beat());
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
    }
    on = false;
    paused = true;
});
// 曲が止まったらLED消灯
player.on("finish", function (ev) {
    console.log("finish");
    if (initialized) {
        led.turnOff();
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
    }
}, 250);
process.on('SIGTERM', function () {
    if (initialized) {
        led.turnOff();
    }
});
