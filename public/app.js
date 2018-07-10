// Obtenemos la conexion que se nos es enviada del servidor para que funcion en tiempo real
var socket = io.connect()
// Obtenemos etiqueta HTML5 donde se estara graficando nuestro valores
var ctx = document.getElementById('chart').getContext('2d')
var temperatura = document.getElementById('p-temperatura')

// Opciones que recibe la libreria para poder graficar los valores en el HTML5
var data = {
	labels: [0],
	datasets: [{
		data: [0],
		label: 'Radiacion Termina',
		backgroundColor: 'transparent',
		borderColor:'#ff6600'
	}]
}

var optionsAnimations = { animation: false,
	scales: {
	  yAxes: [{
	      display: true,
	      ticks: {
	      	beginAtZero: true,
					steps: 10,
					stepValue: 5,
					//Valor maximo en el eje Y
	        max: 680,
					//Valor minimo en el eje Y
					min: 380
	      }
  	}]
	},
}

//Creamos un Objeto y le pasamos la etiqueta HTML5 en donde se graficara y sus opciones para que funciones correctamente
var chart = new Chart(ctx, {
	type: 'line',
	data: data,
	options: optionsAnimations
})

//Obtenemos los valores que se nos manda la conexion con el servidor
socket.on('Radiaccion', function (value) {
		var length = data.labels.length
		if (length >= 10) { // <-- Aqui le decimos que solo tomara como maximo 10 valores en el eje X
			data.datasets[0].data.shift()
			data.labels.shift()
		}
		data.labels.push(moment().format('HH:mm:ss'))
		data.datasets[0].data.push(value)
		temperatura.innerHTML = `${value}`
		chart.update()
})
