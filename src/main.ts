import { Keyboard } from './input';
import { Player } from './player';
import { Bullet } from './bullet';
import { Util } from './util';

//import './style.css';

const FRICTION:number = 0.9;
var WIDTH:number = 1280;
var HEIGHT:number = 720;

var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
var kb: Keyboard;
var player: Player;
var bullets: Array<Bullet>;
var bulletPool: Array<Bullet>;

window.onload = () => {
    player = new Player(WIDTH/2,HEIGHT/2);
    bullets = [];
    bulletPool = [];
    kb = new Keyboard();

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

    gameLoop();
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    kb.update();

    // clear canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    player.ax = 0;
    player.ay = 0;

    if (kb.isDown(Keyboard.LEFT)) {
        player.moveLeft();
    } else if (kb.isDown(Keyboard.RIGHT)) {
        player.moveRight();
    } else if (kb.isDown(Keyboard.UP)) {
        player.moveUp();
    } else if (kb.isDown(Keyboard.DOWN)) {
        player.moveDown();
    }

    player.update();
    player.vx *= FRICTION;
    player.vy *= FRICTION;
    player.render(ctx);

    bullets.forEach((b) => {
        b.update();
        b.render(ctx);
    });
}

function fireBullet(startX:number, startY:number, angle:number, speed:number) {
    let newBullet = null;
    if (bulletPool.length > 0) {
        newBullet = bulletPool.pop();
    } else {
        newBullet = new Bullet(startX, startY);
    }
    newBullet.vx = Math.cos(angle) * speed;
    newBullet.vy = Math.sin(angle) * speed;
    bullets.push(newBullet);
}
