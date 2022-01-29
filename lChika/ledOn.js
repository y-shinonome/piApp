"use strict";
exports.__esModule = true;
var onoff_1 = require("onoff");
var led = new onoff_1.Gpio(17, 'out');
var iv = setInterval(function () { return led.writeSync(led.readSync() ^ 1); }, 200);
setTimeout(function () {
    clearInterval(iv);
    led.unexport();
}, 10200);
