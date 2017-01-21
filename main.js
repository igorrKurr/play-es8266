const wifi = require('Wifi')
const http = require('http')
import wifiConfig from './wifi.config.json'

wifi.stopAP()

const lightOn = () =>{
  digitalWrite(D2, LOW)
  console.log('A blue LED should be on...')
}

const lightOff = () =>{
  digitalWrite(D2, HIGH)
  console.log('A blue LED should be off...')
}

const connectWifi = (name, password) => {
  console.log('running connect', name, password)
  return new Promise((resolve, reject) => {
    wifi.connect(name, { password: password }, (error) => {
      const ipAddress = wifi.getIP().ip
      if (error) {
        reject(error)
      } else {
        resolve(ipAddress)
      }
    })
  })
}

const getUrl = (url) => {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      res.on('error', reject)
      res.on('close', () => {
        resolve(res.read())
      })
    })
  })
}

function main() {
  console.log("status", wifi.getStatus())
  connectWifi(wifiConfig.name, wifiConfig.password)
  .then(() => {
    console.log('Connected', wifi.getIP().ip, wifi.getStatus())
    lightOn()
    return true
  })
  .then(() => {
    console.log('Doing http get')
    return getUrl('http://google.com')
  })
  .then((data) => {
    console.log('Received data from http')
    console.log(data)
  })
  .catch((err) => {
    console.log('ERROR', err)
    lightOff()
  })
}
