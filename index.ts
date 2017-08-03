// LEDをチカチカさせたい

var gpio = require("gpio");

class Led {
    gpio16: any;

    constructor(gpio) {
        this.gpio16 = gpio.export(16, {
            direction: "in",
            ready: function() {}
        });
    }

    turnOn() {
        this.gpio16.set(1);
    }

    turnOff() {
        this.gpio16.set(0);
    }
}

const led = new Led(gpio);

let initialized = false
let paused = true;

var SW = require("songle-widget");

// トークンの情報を取ってくる
var settings = require("./settings");

// ビート情報と基本情報をもらってくる
var player = new SW.Player({
    accessToken: settings.tokens.access
});
player.addPlugin(new SW.Plugin.Beat());
player.addPlugin(new SW.Plugin.SongleSync());

// 何かあったらコンソールに書き出す
player.on("play", (ev) => {
    console.log("play");
    paused = false;
});
player.on("seek", (ev) => console.log("seek"));

// 曲が止まったらLED消灯
player.on("pause", (ev) => {
    console.log("pause");
    if (initialized) {
        led.turnOff();
    }
    on = false;
    paused = true;
});

// 曲が止まったらLED消灯
player.on("finish", (ev) => {
    console.log("finish");
    if (initialized) {
        led.turnOff();
    }
    on = false;
    paused = true;
});

// ビートごとにLED点滅
var on = false;
player.on("beatEnter", (ev) => {
    console.log("beat:", ev.data.beat.position);
    if (initialized) {
        if (on) led.turnOff();
        else led.turnOn();
    }
    on = !on;
});

// 死なないようにする & 秒数をアップデート
setInterval(() => {
    if (initialized && player && !paused) {
        var position = Math.round(player.position) / 1000;
    }
}, 250);

process.on('SIGTERM', function() {
    if (initialized) {
        led.turnOff();
    }
});
