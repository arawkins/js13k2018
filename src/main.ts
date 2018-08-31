import { Keyboard } from './input';
import { Player } from './player';
import { Bullet } from './bullet';
import { Turret } from './enemy';
import { Entity } from './entity';
import { Starfield } from './starfield';

//import './style.css';

const FRICTION:number = 0.95;
var WIDTH:number = 1280;
var HEIGHT:number = 720;

var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
var kb: Keyboard;
var player: Player;
var bullets: Array<Bullet>;
var bulletPool: Array<Bullet>;
var enemies: Array<Turret>;
var starField: Starfield;

window.onload = () => {

    document.documentElement.style.overflow = 'hidden'; 

    player = new Player(75,HEIGHT/2);
    enemies = [];
    starField = new Starfield(WIDTH, HEIGHT);

    document.addEventListener("FireBullet", onFireBullet);
    
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

    // clear canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    starField.update();
    starField.render(ctx);
    
    player.ax = 0;
    player.ay = 0;

    if (kb.isDown("ArrowLeft")) {
        player.turnTo(180);
        player.accelerate();
    } else if (kb.isDown("ArrowRight")) {
        player.turnTo(0);
        player.accelerate();
    } else if (kb.isDown("ArrowUp")) {
        player.turnTo(270);
        player.accelerate();
    } else if (kb.isDown("ArrowDown")) {
        player.turnTo(90);
        player.accelerate();
    }

    if(kb.hit("z")) {
        player.fullStartUp();
        fireBullet(player.x+ player.width/2, player.y, 0,20);
    }

    // check future player position against walls
    let nextX:number = player.x + player.vx + player.ax;
    let nextY:number = player.y + player.vy + player.ay;
    let testEntity:Entity = new Entity(nextX, nextY);

    player.update();
    
    player.vx *= FRICTION;
    player.vy *= FRICTION;
    if(player.x <= player.width) {
        player.x = player.width;
        player.vx = 0;
        player.ax = 0;
    }
    player.render(ctx);

    bullets.forEach((b, index) => {
        b.update();
        b.render(ctx);
        if (b.collide(player) || b.x > WIDTH || b.x < 0 || b.y > HEIGHT || b.y < 0) {
            removeBullet(b, index);
        }
    });

    enemies.forEach((enemy) => {
        enemy.update();
        enemy.render(ctx);
    });

    kb.update();
    
}

function onFireBullet(e) {
    fireBullet(e.detail.x, e.detail.y, e.detail.dir, e.detail.speed)
}

function removeBullet(bullet,index) {
    bullets.splice(index,1);
    //bulletPool.push(bullet);
}

function fireBullet(startX:number, startY:number, directionInDegrees:number, speed:number) {
    let newBullet:Bullet = new Bullet(startX, startY);
    
    newBullet.reset();
    newBullet.x = startX;
    newBullet.y = startY;
    newBullet.launch(directionInDegrees, speed);
    bullets.push(newBullet);
}
