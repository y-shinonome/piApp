import * as i2c from 'i2c-bus'
import { addDoc } from '../fireBase/fireStore'

const DHT20_ADDR = 0x38
const READ_ADDR = 0x71
const MEASUREMENT_ADDR = 0xAC
const MEASUREMENT_PARAM = [0x33,0x00]

const sleep = async (msec:number) => new Promise(resolve => setTimeout(resolve, msec))

const isCompleted = (bus: i2c.I2CBus) => {
  const statusBit = bus.readByteSync(DHT20_ADDR, READ_ADDR).toString(2).padStart(8, '0')
  //測定ステータスの7ビット目が測定完了フラグ
  if (statusBit.substring(0, 1) === '0') {
    return true
  } else {
    return false
  }
}

const temperatureBinToDec = (binary: string) => {
  const floatTemperature = (parseInt(binary,2) / 2**20) * 200 - 50
  const temperature = (Math.round(floatTemperature * 100)) /100
  return temperature
}

const humidityBinToDec = (binary: string) => {
  const floatHumidity = (parseInt(binary,2) / 2**20) * 100
  const humidity = (Math.round(floatHumidity * 100)) /100
  return humidity
}

const measutement = async () => {
  const i2c1 = i2c.openSync(1)

  //DHT20へ測定コマンドと測定パラメータ送信
  const wbuf = Buffer.from(MEASUREMENT_PARAM)
  i2c1.writeI2cBlockSync(DHT20_ADDR, MEASUREMENT_ADDR, wbuf.length, wbuf)

  //ステータスビットを読み込み、測定完了まで待機する
  do {
    await sleep(100)
  } while (isCompleted(i2c1) === false)

  //測定値を取得
  const rbuf = Buffer.alloc(6)
  i2c1.readI2cBlockSync(DHT20_ADDR, READ_ADDR, rbuf.length, rbuf)

  //バッファーデータを2進数に変換して結合
  let binary= ''
  rbuf.forEach((buffer) => {
    binary += buffer.toString(2).padStart(8, '0')
  })

  //バイナリデータの中の温度部分のみ抽出してデータ整形
  const temperatureBinary = binary.substring(28,48)
  const temperature = temperatureBinToDec(temperatureBinary)

  //バイナリデータの中の湿度部分のみ抽出してデータ整形
  const humidityBinary = binary.substring(8,28)
  const humidity = humidityBinToDec(humidityBinary)

  return {
    datetime: new Date(),
    temperature: temperature,
    humidity: humidity
  }
}

const main = async () => {
    const DHT20 = await measutement()
    await addDoc(DHT20)
} 

setInterval(main, 300000)
