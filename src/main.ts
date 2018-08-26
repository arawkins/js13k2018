import { Keyboard } from './input';
import { Player } from './player';
import { Bullet } from './bullet';
import { Enemy } from './enemy';
import { Coin } from './coin';
import { Entity } from './entity';
import { Wall } from './wall';

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
var enemies: Array<Enemy>;
var walls: Array<Wall>;
var coins: Array<Coin>;
var coinFrequency:number;
var coinCounter:number;
var coinMax:number = 4;
var score: number;

window.onload = () => {

    document.documentElement.style.overflow = 'hidden'; 

    player = new Player(WIDTH/2,HEIGHT/2);
    enemies = [new Enemy(48,48), new Enemy(WIDTH-48, HEIGHT-48)];
    enemies[0].vx = 1;
    enemies[1].vx = -1;
    //enemies = [];
    walls = [
        new Wall(WIDTH/2,16,WIDTH,32),
        new Wall(WIDTH/2,HEIGHT-16,WIDTH,32),
        new Wall(16, HEIGHT/2, 32, HEIGHT-64),
        new Wall(WIDTH-16, HEIGHT/2, 32, HEIGHT-64)
    ];
    walls.forEach((w) => { w.alpha = 1});

    coins = [new Coin(120,120)];

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

    score = 0;
    coinFrequency = 300;
    coinCounter = 0;
    gameLoop();
}

function gameLoop() {
    requestAnimationFrame(gameLoop);

    // clear canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    
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

    // check future player position against walls
    let nextX:number = player.x + player.vx + player.ax;
    let nextY:number = player.y + player.vy + player.ay;
    let testEntity:Entity = new Entity(nextX, nextY);

    walls.forEach((w) => {
        if (testEntity.collide(w)) {
            let xOnly:Entity = new Entity(nextX, player.y);
            if (xOnly.collide(w)) {
                player.vx = 0;
                player.ax = 0;
            }

            let yOnly:Entity = new Entity(player.x, nextY);
            if (yOnly.collide(w)) {
                player.vy = 0;
                player.ay = 0;
            }
        }
    })
    player.speedBoost = score / 25;
    if (player.speedBoost > 4) {
        player.speedBoost = 4;
    }
    player.update();
    
    player.vx *= FRICTION;
    player.vy *= FRICTION;
    player.render(ctx);

    bullets.forEach((b, index) => {
        b.update();
        b.render(ctx);
        if (b.x > WIDTH || b.x < 0 || b.y > HEIGHT || b.y < 0) {
            removeBullet(b, index);
        }
        walls.forEach((w) => {
            if (b.collide(w)) {
                removeBullet(b,index);
            };
        });
        if (player.online() && b.collide(player)) {
            removeBullet(b, index);
            score -= 1;
            if (score < 0) { 
                score = 0;
            }
        }
    
    });

    enemies.forEach((enemy) => {
        if(player.online()) {
            enemy.startup();
        } else {
            enemy.shutdown();
        }

        if (enemy.online()) {
            enemy.update();
            enemy.pointAt(player);
            enemy.fire();
            if (enemy.x < 16 || enemy.x > WIDTH-16) {
                enemy.vx *= -1;
                enemy.x += enemy.vx;
            }
        }
       
        enemy.render(ctx);
    });

    walls.forEach((wall) => {
        wall.render(ctx);
    })

    coins.forEach((coin, index) => {
        if(player.online()) {
            coin.startup();
        } else {
            coin.shutdown();
        }

        if (coin.online() && player.collide(coin)) {
            coins.splice(index,1);
            score += 1;
            
        }
        coin.render(ctx);
    })

    if (player.online()) {
        coinCounter ++;
        if (coinCounter > coinFrequency) {
            let newCoin = new Coin(Math.random()*(WIDTH-128) + 64, Math.random()* (HEIGHT - 128) + 64);
            coinCounter = 0;
            coins.push(newCoin);
        }
    }
    
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
