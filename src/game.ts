import { State } from './state';
import { Keyboard } from './input';
import { Player } from './player';
import { Entity, EntityPool } from './entity';
import { Wave } from './wave';
import { PowerUp } from './powerup';
import { Starfield } from './starfield';

export class GameState extends State {

    private FRICTION:number = 0.95;
    private width:number;
    private height:number;

    private kb: Keyboard;
    private player: Player;
    private playerBullets: Array<Entity>;
    private shrapnel: Array<Entity>;
    private entityPool:EntityPool;
    private particles: Array<Entity>;
    
    private enemies: Array<Entity>;
    private enemyPool:EntityPool;
    private enemyWaves: Array<Wave>;
    private powerUps: Array<PowerUp>;
    private starfield:Starfield;

    private waveCounter:number;
    private waveInterval:number;
    private terrainCounter:number;
    private terrainInterval:number;
    private terrain:Array<Entity>;
    private renderFlip:number;

    private chargesToWin:number = 24;
    private wonGame:boolean;
    private lostGame:boolean;

    constructor(width:number, height:number, starfield:Starfield) {
        super();
        this.starfield = starfield;
        this.width = width;
        this.height = height;
        this.kb = new Keyboard();     
        document.addEventListener("PlayerFireBullet", this.onPlayerFireBullet.bind(this)); 
        this.entityPool = new EntityPool();
        this.enemyPool = new EntityPool();
    }

    public start() {
        this.player = new Player();
        this.player.init(75,this.height/2);
        this.enemies = [];      
        this.playerBullets = [];
        this.powerUps = [];
        this.particles = [];
        this.shrapnel = [];
        this.enemyWaves = [];
        this.terrain = [];
        this.terrainInterval = 1500;
        this.terrainCounter = 0;
        this.waveInterval = 600;
        this.waveCounter = 0;
        this.renderFlip = 0;
        this.wonGame = false;
        this.lostGame = false;
    }

    public enter():void {
        let self = this;
        if(this.wonGame) {
            this.wonGame = false;
            this.chargesToWin *= 3;
            this.player.x = 32;
            this.player.y = this.height/2;
            this.player.autopilot = false;
        } else {
            this.start();  
        }
        
    }

    public update():void {
        this.starfield.scroll(this.player.speed, 0);

        this.waveCounter++;
        if(this.waveCounter >= this.waveInterval) {
            this.waveCounter = 0;
            this.spawnWave();
        }

        this.terrainCounter++;
        if(this.terrainCounter > this.terrainInterval) {
            this.terrainCounter = 0;
            this.terrainInterval -= 100;
            if(this.terrainInterval <= 500) {
                this.terrainInterval += Math.random() * 200 - this.player.speed * 10;
            }
            let tWidth=400 + Math.random() * 1350 ;
            let tHeight = 50 + Math.random() * 150;
            let t:Entity = this.entityPool.getEntity(this.width + tWidth, 200 + Math.random()*(this.height-400), tWidth, tHeight, "#999999");
            this.terrain.push(t);
        }

        if (!this.player.dead) {
            this.player.ax = 0;
            this.player.ay = 0;

            if(!this.player.autopilot) {
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
            }
            
            this.player.update();
            if(!this.player.offline) {
                let smokeCount:number = 0;
                while(smokeCount < this.player.speed) {
                    let smokeY:number = Math.random();
                    if(smokeY < 0.5) {
                        smokeY *= -1;
                        smokeY -= 0.5;
                    }
                    smokeY *= Math.random()*this.player.height/3;
                    smokeCount++;
                    let p:Entity = this.entityPool.getEntity(this.player.x, this.player.y+smokeY, 12,12, "white", 30);
                    this.particles.push(p);
                    p.launch(180, this.player.speed);
                }
            }
            
            
            this.player.vx *= this.FRICTION;
            this.player.vy *= this.FRICTION;
            if(this.player.x <= this.player.width) {
                this.player.x = this.player.width;
                this.player.vx = 0;
                this.player.ax = 0;
            }
            if(this.player.y <= this.player.height) {
                this.player.y = this.player.height;
                this.player.vy = 0;
                this.player.ay = 0;
            } else if(this.player.y >= this.height - this.player.height) {
                this.player.y = this.height - this.player.height;
                this.player.vy = 0;
                this.player.ay = 0;
            
            }
        }

        this.terrain.forEach((t, index) => {
            t.x -= this.player.speed;
            if(t.collide(this.player)) {
                this.player.damage(1);
            }
            if(t.x < -t.width) {
                this.entityPool.recycle(this.terrain.splice(index,1));
            }
            this.shrapnel.forEach((s,index) => {
                if(s.collide(t)) {
                    s.vy *= -1;
                    s.y += s.vy;
                    // if it's still collide after rebounding, just remove it.
                    if(s.collide(t)) {
                        s.kill();
                    }
                }
            })
            this.enemies.forEach((e,index) => {
                if(e.collide(t)) {
                    e.damage(1);
                }
            }); 
        });
        
        this.playerBullets.forEach((b, playerBulletIndex) => {
            b.update();
            if (b.x > this.width || b.x < 0 || b.y > this.height || b.y < 0) {
                b.kill()
            }
            this.enemies.forEach((e,enemyIndex) => {
                if(b.collide(e)) {
                    e.damage(1);
                    b.kill()
                }
            })
            this.terrain.forEach((t,index) => {
                if (b.collide(t)) {
                    b.kill();
                };
            });
            if(b.dead) {
                this.entityPool.recycle(this.playerBullets.splice(playerBulletIndex,1));
            }
        });

        this.enemies.forEach((enemy, index) => {
            enemy.update();
            if(enemy.collide(this.player)) {
                enemy.damage(3)
                this.player.damage(3);
            }
            if(enemy.dead) {
                this.explode(enemy.x, enemy.y);
                this.blastShrapnel(enemy.x, enemy.y, 4, enemy.width/2);
            }
            if(enemy.done() || enemy.dead) {
                this.enemyPool.recycle(this.enemies.splice(index,1));
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
            if(w.cleared()) {
                this.powerUps.push(new PowerUp(w.lastEnemy.x, w.lastEnemy.y));
                w.destroy();
                this.enemyWaves.splice(index,1);
            }
        })

        this.powerUps.forEach((p, index) => {
            p.update();
            if(p.x <=p.width || p.x >=this.width-p.width) {
                p.vx *= -1;
            }
            if(p.y <= p.height || p.y >= this.height-p.height) {
                p.vy *= -1
            }
            this.terrain.forEach((t) => {
                if (t.collide(p)) {
                    
                }
            })
            if (p.collide(this.player)) {
                this.powerUps.splice(index,1);
                this.player.powerUp(1);
            }
        });

        this.particles.forEach((p, index) => {
            p.update();
            p.fade();
            p.width *= 0.97;
            p.height = p.width;
            
            if(p.width <= 1) {
                p.kill();
            }
            if(p.dead) {
                this.entityPool.recycle(this.particles.splice(index,1));
            }
        })

        this.shrapnel.forEach((s, index) => {
            s.x += -this.player.speed;
            s.update();
            if(s.x < -s.width || s.x > this.width + s.width || s.y < -s.height || s.y > this.height + s.height) {
                s.kill();
            }
            if(this.renderFlip >= 5) {
                //this.explode(s.x, s.y, 0.1, "#CCC");
            }
            if(s.dead) {
                this.entityPool.recycle(this.shrapnel.splice(index,1));
            } else {
                if(s.collide(this.player)) {
                    this.player.damage(1);
                    s.kill();
                }
            }
            this.playerBullets.forEach((pb, index2) => {
                if (pb.collide(s)) {
                    pb.kill();
                    s.kill();
                    if(s.width > 8) {
                        this.blastShrapnel(s.x, s.y, 2, s.width/2)
                    } else {
                        if(Math.random() > 0.75) {
                            this.powerUps.push(new PowerUp(s.x, s.y));        
                        }
                        
                    }
                }
            });
            

        })

        
        if(this.player.dead && !this.lostGame) {
            this.end();
        }

        if (this.player.chargeLevel >= this.chargesToWin) {
            if(!this.wonGame) {
                this.win();
            }
            this.player.vx = 20;
        }

        this.kb.update();
    }

    public spawnWave():void {
        let side:number = Math.random();
        let startY:number = 100+Math.random()*100;
        let turnDir:number = 90;
        if(side > 0.5) {
            startY = this.height - 100 - Math.random() * 100;
            turnDir = 270
        }
        let w:Wave = new Wave(this.width+100,startY , 0, 1+Math.random()*this.player.speed, this.enemyPool);
        let distance = 3+Math.random()*this.player.speed;
        w.move(180, 2+Math.random()*2, distance);
        w.move(turnDir,1+Math.random()*1, 2+Math.random()*this.player.speed);
        w.move(0,4, distance);
        this.enemyWaves.push(w);
        this.waveInterval -= 25;
        if(this.waveInterval <= 300) {
            this.waveInterval += Math.random()*100+100 - this.player.speed * 5;
        } 
    }
    
    private onPlayerFireBullet(e) {
        //console.log(e);
        let b:Entity = this.entityPool.getEntity(e.detail.x, e.detail.y, e.detail.width, e.detail.height,"pink");
        b.launch(e.detail.dir,20);
        this.playerBullets.push(b);
    }

    private blastShrapnel(x:number, y:number, amount:number = 1, size:number=10) {
        let i:number = 1;
        while(i<=amount) {
            let s:Entity = this.entityPool.getEntity(x,y,size,size,"red");
            s.launch(Math.random()*360,3);
            this.shrapnel.push(s);
            i++;
        }
    }

    private explode(x:number,y:number,amount:number=14, color:string="white") {
        let i:number = 0;
        let increment:number = 360/amount;
        while(i<amount) {
            let p:Entity = this.entityPool.getEntity(x,y,12,12,"white",30);
            p.launch(increment*i + Math.random()*increment,1+Math.random()*amount/10);
            this.particles.push(p);
            i++;
        }       
    }

    public end() {
        this.lostGame = true;
        document.dispatchEvent(new CustomEvent("LoadState", { detail: "GameOverState"}));

    }

    public win() {
        this.wonGame = true;
        document.dispatchEvent(new CustomEvent("LoadState", { detail: "WinState"}));

    }

    public exit():void {
        if(this.player.dead) {
            this.explode(this.player.x, this.player.y, 50);
        } else {
            this.player.autopilot = true;
        }
        
    }

    public render(ctx:CanvasRenderingContext2D):void {
        this.renderFlip++;
        if (this.renderFlip >=8) {
            this.renderFlip = 0;
        }
                
        let allEntities:Array<Entity> = this.terrain.concat(this.playerBullets.concat(this.powerUps.concat(this.particles.concat(this.shrapnel))))
        allEntities.forEach((e) => {
            e.render(ctx);
        });
        this.enemies.forEach((enemy, index) => {
            enemy.render(ctx);
        });
        
        this.player.render(ctx);
        
        for(let i:number=0; i<this.chargesToWin; i++) {
            let e:Entity = this.entityPool.getEntity(25+ i * 15, this.height-25, 10, 25, "#000066")
            if(i < this.player.chargeLevel) {
                if((!this.player.offline || this.renderFlip >= 4) && this.player.charge > i) {
                    e.color="#0000FF";
                }
                e.render(ctx);
            } else {
                e.color="#CCCCCC";
                e.render(ctx, false)
            }            
        }

    }

}
