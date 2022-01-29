import * as i2c from 'i2c-bus'

const DHT20_ADDR = 0x38
const CMD_CODE = 0x71

const sleep = (msec:number) => {
  return new Promise<void>((resolve) =>{
    setTimeout(() => {resolve()}, msec)
  })
}

const i2c1 =  i2c.open(1, err => {
  if (err) throw err
})

i2c1.readByte(DHT20_ADDR, CMD_CODE, (err, rawData) => {
  if (err) throw err
  console.log(`${rawData} : 0x${rawData.toString(16)}`)
})

const wbuf = Buffer.from([0x33,0x00])
i2c1.writeI2cBlock(DHT20_ADDR,0xac, wbuf.length, wbuf, async (err) => {
  if (err) throw err
  console.log('wait_start')
  await sleep(1000)
  console.log('w_end')
})

const rbuf = Buffer.alloc(6)
i2c1.readI2cBlock(DHT20_ADDR,CMD_CODE, rbuf.length, rbuf, async (err, bytesRead, buffer) => {
  if (err) throw err
})
console.log(rbuf)

i2c1.close(err => {
  if (err) throw err
})
