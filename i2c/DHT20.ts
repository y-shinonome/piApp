import * as i2c from 'i2c-bus'

const DHT20_ADDR = 0x38
const READ_ADDR = 0x71
const MEASUREMENT_ADDR = 0xAC

const sleep = async (msec:number) => new Promise(resolve => setTimeout(resolve, msec))

const getTemperature = async () => {
  const i2c1 = i2c.openSync(1)

  const wbuf = Buffer.from([0x33,0x00])
  i2c1.writeI2cBlockSync(DHT20_ADDR, MEASUREMENT_ADDR, wbuf.length, wbuf)

  await sleep(1000)

  const rbuf = Buffer.alloc(6)
  i2c1.readI2cBlockSync(DHT20_ADDR, READ_ADDR, rbuf.length, rbuf)

  let binary= ''
  rbuf.forEach((buffer) => {
    binary += buffer.toString(2).padStart(8, '0')
  })

  const temperature = binary.substring(28,48)
  const temp1 = parseInt(temperature,2)

  const temp2 = (temp1 / 2**20) * 200 - 50

  return temp2
}

const main = async () => {
  do
    console.log(await getTemperature())
  while (1 == 1)
}

main()