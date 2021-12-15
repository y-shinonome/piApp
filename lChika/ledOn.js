import { Gpio } from 'onoff'

const led = new Gpio(17, 'out')

const iv = setInterval(() => led.writeSync(led.readSync() ^ 1), 200)

setTimeout(() => {
  clearInterval(iv)
  led.unexport()
}, 10200)