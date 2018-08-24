import { Spring } from './spring';
import { Keyboard } from './input';
import { Wall } from './wall';
import './style.css';

var WIDTH:number = 1280;
var HEIGHT:number = 720;
var WALL_BUFFER:number = 70;

var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
var spring: Spring;
var keyboard: Keyboard;
var leftWall:Wall;
var rightWall:Wall;


window.onload = () => {
    keyboard = new Keyboard();
    
    let container = document.createElement('div');
    container.id = "container";

    canvas = document.createElement('canvas');
    canvas.id     = "game";
    canvas.width  = WIDTH;
    canvas.height = HEIGHT;
    canvas.classList.add('red_border');
    container.appendChild(canvas);
    document.body.appendChild(container);
    ctx = canvas.getContext("2d");

    spring = new Spring(0.005, WIDTH/2, HEIGHT/2, WIDTH/2);
    leftWall = new Wall(HEIGHT,WALL_BUFFER,WALL_BUFFER,WIDTH/2-WALL_BUFFER, 1);
    rightWall = new Wall(HEIGHT, WIDTH-WALL_BUFFER, WIDTH/2+WALL_BUFFER, WIDTH-WALL_BUFFER, -1)
    gameLoop();

}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    keyboard.update();
    
    // clear canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // draw center line
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(WIDTH/2,0);
    ctx.lineTo(WIDTH/2, HEIGHT);
    ctx.stroke(); 

    // check input
    if (keyboard.isDown(Keyboard.LEFT)) {
        spring.pull(-1);
    }

    if (keyboard.isDown(Keyboard.RIGHT)) {
        spring.pull(1);
    }

    if (keyboard.released(Keyboard.LEFT) || keyboard.released(Keyboard.RIGHT)) {
        spring.release();
    }
    
    spring.update();
    spring.draw(ctx);

    leftWall.update();
    leftWall.draw(ctx);
    rightWall.update();
    rightWall.draw(ctx);
}

