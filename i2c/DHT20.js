"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var i2c = require("i2c-bus");
var DHT20_ADDR = 0x38;
var READ_ADDR = 0x71;
var MEASUREMENT_ADDR = 0xAC;
var MEASUREMENT_PARAM = [0x33, 0x00];
var sleep = function (msec) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, msec); })];
}); }); };
var isCompleted = function (bus) {
    var statusBit = bus.readByteSync(DHT20_ADDR, READ_ADDR).toString(2).padStart(8, '0');
    //測定ステータスの7ビット目が測定完了フラグ
    if (statusBit.substring(0, 1) === '0') {
        return true;
    }
    else {
        return false;
    }
};
var temperatureBinToDec = function (binary) {
    var floatTemperature = (parseInt(binary, 2) / Math.pow(2, 20)) * 200 - 50;
    var temperature = floatTemperature.toFixed(2);
    return temperature;
};
var humidityBinToDec = function (binary) {
    var floatHumidity = (parseInt(binary, 2) / Math.pow(2, 20)) * 100;
    var humidity = floatHumidity.toFixed(2);
    return humidity;
};
var measutement = function () { return __awaiter(void 0, void 0, void 0, function () {
    var i2c1, wbuf, rbuf, binary, temperatureBinary, temperature, humidityBinary, humidity;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i2c1 = i2c.openSync(1);
                wbuf = Buffer.from(MEASUREMENT_PARAM);
                i2c1.writeI2cBlockSync(DHT20_ADDR, MEASUREMENT_ADDR, wbuf.length, wbuf);
                _a.label = 1;
            case 1: return [4 /*yield*/, sleep(100)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                if (isCompleted(i2c1) === false) return [3 /*break*/, 1];
                _a.label = 4;
            case 4:
                rbuf = Buffer.alloc(6);
                i2c1.readI2cBlockSync(DHT20_ADDR, READ_ADDR, rbuf.length, rbuf);
                binary = '';
                rbuf.forEach(function (buffer) {
                    binary += buffer.toString(2).padStart(8, '0');
                });
                temperatureBinary = binary.substring(28, 48);
                temperature = temperatureBinToDec(temperatureBinary);
                humidityBinary = binary.substring(8, 28);
                humidity = humidityBinToDec(humidityBinary);
                return [2 /*return*/, {
                        temperature: temperature,
                        humidity: humidity
                    }];
        }
    });
}); };
var display = function () { return __awaiter(void 0, void 0, void 0, function () {
    var date, DHT20;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                date = new Date();
                return [4 /*yield*/, measutement()];
            case 1:
                DHT20 = _a.sent();
                console.log("".concat(date.toLocaleString(), " : ").concat(DHT20.temperature, "\u2103 : ").concat(DHT20.humidity, "%"));
                return [2 /*return*/];
        }
    });
}); };
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, display()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                if (1 === 1) return [3 /*break*/, 0];
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
main();
