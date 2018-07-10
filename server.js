'use strict'
// Se importan las librerias instaladas.
const http = require('http')
const path = require('path')
const express = require('express')
const socketio = require('socket.io')
const five = require('johnny-five')
const EventsEmitter = require('events')

// Se instancia el servidor local
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const events = new EventsEmitter()
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))

// Se crea una instancia del la placa de Arduino
const board =  new five.Board()
let data = 0

// Se le dice a la placa de Arduino con que sensor va a trabajar y en que puerto analogo de la placa esta conectada
board.on('ready', ()=>{
  let temperature = new five.Thermometer({
    controller: "LM35",
    pin: "A0"
  })

// Luego de que el sensor ya esta conectado con la placa de Arduino comenzamos a recibir los datos de la temperatura del ambiente
  temperature.on("change", function() {
    // Recibimos como valores solos dos decimales como maximo
    let kelvin = Math.floor(this.kelvin)
    // Se calcula la ecuacion de la Radiacion Termica del Ambiente
    let radiacion = (5.67 * Math.pow(10, -8) * Math.pow(kelvin, 4)).toFixed(2)
    data = radiacion
  })
})

// Emitimos un evento cada 1000 Milisegundos(1s) con el valor de la Radiacion Termica
setInterval(()=>{
  events.emit('Rd', data)
},1000)

//Realizamos la conexion del servidor a el Front-End de la aplicacion y le mandamos los valores de la Radiacion Termica
io.on('connect', socket => {
  events.on('Rd', (value)=>{
    //Mostramos en consola los valores de la Radiacion Termica
    console.log(`Radiacion Termina: ${value} Watt/m^2`)
    socket.emit('Radiacion', value)
  })
})

//Le decimos a el servidor que corra en el puerto 3000
server.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`))
