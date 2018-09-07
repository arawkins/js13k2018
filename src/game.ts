import { State } from './state';
import { Keyboard } from './input';
import { Player } from './player';
import { Enemy } from './enemy';
import { Entity } from './entity';
import { Wave } from './wave';

export class GameState extends State {

    private FRICTION:number = 0.95;
    private width:number;
    private height:number;

    private kb: Keyboard;
    private player: Player;
    private playerBullets: Array<Entity>;
    private enemyBullets: Array<Entity>;
    
    private enemies: Array<Enemy>;
    private enemyWaves: Array<Wave>;
    

    constructor(width:number, height:number) {
        super();
        this.width = width;
        this.height = height;
        this.kb = new Keyboard();     
        document.addEventListener("EnemyFireBullet", this.onEnemyFireBullet.bind(this));
        document.addEventListener("PlayerFireBullet", this.onPlayerFireBullet.bind(this)); 
    }

    public start() {
        this.player = new Player(75,this.height/2);
        
        this.enemies = [];      
        this.playerBullets = [];
        this.enemyBullets = [];

        this.enemyWaves = [];
        // create new wave
        
        let w:Wave = new Wave(this.width+50, 100, 0, 5, 1);
        w.move(180, 2, 4);
        w.fire();
        w.move(90,1, 4);
        w.fire();
        w.move(0,2, 4);
        this.enemyWaves.push(w);

        let w2:Wave = new Wave(this.width+50, this.height-50,10,5,1);
        w2.move(180, 3, 4);
        w2.fire();
        w2.move(270,2, 4);
        w2.fire();
        w2.move(0,3, 4);
        this.enemyWaves.push(w2);
    }

    public enter():void {
        let self = this;
        
        this.start();  
    }

    public update():void {
        
        if (this.player.alive()) {
            this.player.ax = 0;
            this.player.ay = 0;

            if (this.kb.isDown("ArrowLeft")) {
                this.player.turnTo(180);
                this.player.accelerate();
            } else if (this.kb.isDown("ArrowRight")) {
                this.player.turnTo(0);
                this.player.accelerate();
            } else if (this.kb.isDown("ArrowUp")) {
                this.player.turnTo(270);
                this.player.accelerate();
            } else if (this.kb.isDown("ArrowDown")) {
                this.player.turnTo(90);
                this.player.accelerate();
            }

            if(this.kb.hit("z")) {
                this.player.fire();
            }

            this.player.update();
            
            this.player.vx *= this.FRICTION;
            this.player.vy *= this.FRICTION;
            if(this.player.x <= this.player.width) {
                this.player.x = this.player.width;
                this.player.vx = 0;
                this.player.ax = 0;
            }
        }
        
        

        this.playerBullets.forEach((b, playerBulletIndex) => {
            b.update();
            if (b.x > this.width || b.x < 0 || b.y > this.height || b.y < 0) {
                this.playerBullets.splice(playerBulletIndex,1);
            }
            this.enemies.forEach((e,enemyIndex) => {
                if(b.collide(e)) {
                    this.playerBullets.splice(playerBulletIndex,1);
                    this.enemies.splice(enemyIndex,1);
                    e.kill();
                }
            })
        });

        this.enemyBullets.forEach((b, index) => {
            b.update();
            if (b.x > this.width || b.x < 0 || b.y > this.height || b.y < 0) {
                this.enemyBullets.splice(index,1);
            } else if (this.player.alive() && b.collide(this.player)) {
                this.enemyBullets.splice(index,1);
                this.end();
            }
            
        });

        this.enemies.forEach((enemy, index) => {
            enemy.update();
            if(enemy.done()) {
                this.enemies.splice(index,1);
            }
        });

        this.enemyWaves.forEach((w, index) => {
            w.update();
            if(w.ready() && !w.started) {
                w.start();
                w.getEnemies().forEach((e) => {
                    this.enemies.push(e);
                });
            }
        })

        this.kb.update();
    }


    private onEnemyFireBullet(e) {
        let enemyBullet:Entity = e.detail;
        enemyBullet.reset();
        let dx:number = this.player.x - enemyBullet.x;
        let dy:number = this.player.y - enemyBullet.y;
        let dir:number = Math.atan2(dy, dx) * 180 / Math.PI;
        enemyBullet.launch(dir, 5);        
        this.enemyBullets.push(e.detail);
    }

    private onPlayerFireBullet(e) {
        this.playerBullets.push(e.detail);
    }

    public end() {
        this.player.kill();
        document.dispatchEvent(new CustomEvent("LoadState", { detail: "GameOverState"}));
    }

    public exit():void {
    }

    public render(ctx:CanvasRenderingContext2D):void {
        
        this.enemies.forEach((enemy, index) => {
            enemy.render(ctx);
        });
        this.enemyBullets.forEach((b, index) => {
            b.render(ctx);
        });
        this.player.render(ctx);
        this.playerBullets.forEach((b, playerBulletIndex) => {
            b.render(ctx);
        });
    }

}