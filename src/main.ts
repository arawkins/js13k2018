import { Keyboard } from './input';
import { Player } from './player';
import { Enemy } from './enemy';
import { Entity } from './entity';
import { Starfield } from './starfield';
import { Wave } from './wave';

//import './style.css';

const FRICTION:number = 0.95;
var WIDTH:number = 1280;
var HEIGHT:number = 720;

var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
var kb: Keyboard;
var player: Player;
var playerBullets: Array<Entity>;
var enemyBullets: Array<Entity>;

var enemies: Array<Enemy>;
var enemyWaves: Array<Wave>;
var starField: Starfield;

window.onload = () => {

    document.documentElement.style.overflow = 'hidden'; 

    player = new Player(75,HEIGHT/2);
    enemies = [];
    starField = new Starfield(WIDTH, HEIGHT);

    document.addEventListener("EnemyFireBullet", onEnemyFireBullet);
    document.addEventListener("PlayerFireBullet", onPlayerFireBullet);
    
    playerBullets = [];
    enemyBullets = [];
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

    enemyWaves = [];
    // create new wave
    
    let w:Wave = new Wave(WIDTH+50, 100, 0, 5, 1);
    w.move(180, 2, 4);
    w.fire();
    w.move(90,1, 4);
    w.fire();
    w.move(0,2, 4);
    enemyWaves.push(w);

    let w2:Wave = new Wave(WIDTH+50, HEIGHT-50,10,5,1);
    w2.move(180, 3, 4);
    w2.fire();
    w2.move(270,2, 4);
    w2.fire();
    w2.move(0,3, 4);
    enemyWaves.push(w2);
    
    gameLoop();
}

function gameLoop() {
    requestAnimationFrame(gameLoop);

    // clear canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    starField.update();
    starField.render(ctx);

    if (player.alive()) {
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
            player.fire();
        }

        player.update();
        
        player.vx *= FRICTION;
        player.vy *= FRICTION;
        if(player.x <= player.width) {
            player.x = player.width;
            player.vx = 0;
            player.ax = 0;
        }
    }
    
    player.render(ctx);

    playerBullets.forEach((b, playerBulletIndex) => {
        b.update();
        b.render(ctx);
        if (b.x > WIDTH || b.x < 0 || b.y > HEIGHT || b.y < 0) {
            playerBullets.splice(playerBulletIndex,1);
        }
        enemies.forEach((e,enemyIndex) => {
            if(b.collide(e)) {
                playerBullets.splice(playerBulletIndex,1);
                enemies.splice(enemyIndex,1);
                e.kill();
            }
        })
    });

    enemyBullets.forEach((b, index) => {
        b.update();
        b.render(ctx);
        if (b.x > WIDTH || b.x < 0 || b.y > HEIGHT || b.y < 0) {
            enemyBullets.splice(index,1);
        } else if (b.collide(player)) {
            enemyBullets.splice(index,1);
            player.kill();
        }
        
    });

    enemies.forEach((enemy, index) => {
        enemy.update();
        enemy.render(ctx);

        if(enemy.done()) {
            enemies.splice(index,1);
        }
    });

    enemyWaves.forEach((w, index) => {
        w.update();
        if(w.ready() && !w.started) {
            w.start();
            w.getEnemies().forEach((e) => {
                enemies.push(e);
            });
        }
    })

    kb.update();
    
}

function onEnemyFireBullet(e) {
    let enemyBullet:Entity = e.detail;
    let dx:number = player.x - enemyBullet.x;
    let dy:number = player.y - enemyBullet.y;
    let dir:number = Math.atan2(dy, dx) * 180 / Math.PI;
    enemyBullet.launch(dir, 5);        
    enemyBullets.push(e.detail);
}

function onPlayerFireBullet(e) {
    playerBullets.push(e.detail);
}

