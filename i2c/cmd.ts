import * as i2c from 'i2c-bus'

const DHT20_ADDR = 0x38
const CMD_CODE = 0x71

const i2c1 =  i2c.open(1, async err => {
  if (err) throw err

  i2c1.readByte(DHT20_ADDR, CMD_CODE, (err, rawData) => {
    if (err) throw err
    console.log(`${rawData} : 0x${rawData.toString(16)}`)
  })

  i2c1.close(err => {
    if (err) throw err
  })
})