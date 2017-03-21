/*
Construir el motor de Juego.
Un motor de juego se contruye por:
* Renderización de las imágenes
* Animaciones de los elementos
* Rutinas para detección de colisiones
*/

// Variables globales
var velocidad = 80;
var tamano = 10;

class Objeto {
	constructor(){
		this.tamano = tamano;
	}
	// Las colisiones se evalúan entre las diferencias de x & y
	choche(obj){
		var difx = Math.abs(this.x - obj.x);
		var dify = Math.abs(this.y - obj.y);
		if (difx >= 0 && difx < tamano && dify >= 0 && dify < tamano){
			return true;
		} else {
			return false;
		}
	}
}

class Cabeza extends Objeto {
	constructor(x, y){
		super();
		this.x = x;
		this.y = y;
		this.long = null;
	}
	dibujar(context){
		if (this.long != null){
			this.long.dibujar(context);
		}
		context.fillStyle = '#0000FF';
		context.fillRect(this.x, this.y, this.tamano, this.tamano);
	}
	set_xy(x, y){
		if (this.long != null){
			this.long.set_xy(this.x, this.y);
		}
		this.x = x;
		this.y = y;
	}
	crecer(){
		if(this.long == null){
			this.long = new Cabeza(this.x, this.y);
		} else {
			this.long.crecer();
		}
	}
	getCrecer(){
		return this.long;
	}
}

class Comida extends Objeto {
	constructor(){
		super();
		this.x = this.generar();
		this.y = this.generar();
	}
	generar(){
		var num = (Math.floor(Math.random() * 59))*10;
		return num;
	}
	colocar(){
		this.x = this.generar();
		this.y = this.generar();
	}
	dibujar(context){
		context.fillStyle = '#FF0000';
		context.fillRect(this.x, this.y, this.tamano, this.tamano);
	}
}

//Objetos del juego
var cabeza = new Cabeza(20, 20);
var comida = new Comida();
var ejex = true;
var ejey = true;
var xdir = 0;
var ydir = 0;

function movimiento(){
	var nx = cabeza.x+xdir;
	var ny = cabeza.y+ydir;
	cabeza.set_xy(nx, ny);
}

function endplay(){
	xdir = 0;
	ydir = 0;
	ejex = true;
	ejey = true;
	cabeza = new Cabeza(20, 20);
	comida = new Comida();
	alert('Perdiste! :(');
}

function choquecuerpo(){
	var temp = null;
	try {
		temp = cabeza.getCrecer().getCrecer();
	} catch (error){
		temp = null;
	}
	while (temp != null){
		if (cabeza.choche(temp)){
			//Fin Juego
			endplay();
		} else {
			temp = temp.getCrecer();
		}
	} 
}
function choquelimit(){
	if(cabeza.x < 0 || cabeza.x > 590 || cabeza.y < 0 || cabeza.y > 590){
		endplay();
	}
}

/*Función de los controles*/
function control(event){
	var cod = event.keyCode;
	if (ejex){
		if (cod == 38){
			ydir = -tamano;
			xdir = 0;
			ejex = false;
			ejey = true;
		}
		if (cod == 40){
			ydir = tamano;
			xdir = 0;
			ejex = false;
			ejey = true;
		}
	} 
	if (ejey){
		if (cod == 37){
			ydir = 0; 
			xdir = -tamano;
			ejey = false;
			ejex = true;
		}
		if (cod == 39){
			ydir = 0; 
			xdir = tamano;
			ejey = false;
			ejex = true;
		}
	}
}

/*Función para renderizar los gráficos*/
function dibujar(){
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Aquí va el dibujo
	cabeza.dibujar(ctx);
	comida.dibujar(ctx);
}

/*Función para animar*/
function main(){
	choquecuerpo();
	choquelimit();
	dibujar();
	movimiento();
	if(cabeza.choche(comida)){
		comida.colocar();
		cabeza.crecer();
	}
}
setInterval("main()", velocidad);