import { State } from './state';
import { Keyboard } from './input';
import { Player } from './player';
import { Enemy } from './enemy';
import { Entity } from './entity';
import { Wave } from './wave';
import { PowerUp } from './powerup';
import { Particle } from './particle';
import { Starfield } from './starfield';

export class GameState extends State {

    private FRICTION:number = 0.95;
    private width:number;
    private height:number;

    private kb: Keyboard;
    private player: Player;
    private playerBullets: Array<Entity>;
    private enemyBullets: Array<Entity>;
    private shrapnel: Array<Entity>;
    private entityPool:Array<Entity>;
    private particles: Array<Particle>;
    private particlePool:Array<Particle>;
    
    private enemies: Array<Enemy>;
    private enemyPool:Array<Enemy>;
    private enemyWaves: Array<Wave>;
    private powerUps: Array<PowerUp>;
    private starfield:Starfield;

    private waveCounter:number;
    private waveInterval:number;
    private waveCount:number;
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
        document.addEventListener("EnemyFireBullet", this.onEnemyFireBullet.bind(this));
        document.addEventListener("PlayerFireBullet", this.onPlayerFireBullet.bind(this)); 
        this.particlePool = [];
        this.entityPool = [];
        this.enemyPool = [];
        
    }

    public start() {
        this.player = new Player(75,this.height/2);
        this.player.init();
        this.enemies = [];      
        this.playerBullets = [];
        this.enemyBullets = [];
        this.powerUps = [];
        this.particles = [];
        this.shrapnel = [];
        this.enemyWaves = [];
        this.terrain = [];
        this.terrainInterval = 1500;
        this.terrainCounter = 0;
        this.waveInterval = 600;
        this.waveCounter = 0;
        this.waveCount = 0;
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

        this.waveCounter++;
        if(this.waveCounter >= this.waveInterval) {
            this.waveCounter = 0;
            this.waveCount++;
            let side:number = Math.random();
            if (side < 0.5) {
                let w:Wave = new Wave(this.width+100, 100+Math.random()*100, 0, 1+Math.random()*this.player.speed, this.enemyPool, 1);
                this.terrain.forEach((t) => {
                    while(w.y > t.y - t.height/2 && w.y < t.y + t.height/2) {
                        w.y += 50;
                    }
                })
                w.move(180, 2+Math.random()*2, 3+Math.random()*this.player.speed);
                w.fire();
                w.move(90,1+Math.random()*1, 3+Math.random()*this.player.speed);
                w.fire();
                w.move(0,4, 3+Math.random()*this.player.speed);
                this.enemyWaves.push(w);
            } else {
                let w2:Wave = new Wave(this.width+100, this.height-100-Math.random()*100,0,Math.random()*this.player.speed+1,this.enemyPool, 1);
                this.terrain.forEach((t) => {
                    while(w2.y > t.y - t.height/2 && w2.y < t.y + t.height/2) {
                        w2.y -= 50;
                    }
                })
                w2.move(180, 2+Math.random()*4, 3+Math.random()*this.player.speed);
                w2.fire();
                w2.move(270,1+Math.random()*1, 3+Math.random()*this.player.speed);
                w2.fire();
                w2.move(0,6, 3+Math.random()*this.player.speed);
                this.enemyWaves.push(w2);
            }
            this.waveInterval -= 25;
            if(this.waveInterval <= 300) {
                this.waveInterval += Math.random()*100+100 - this.player.speed * 5;
            }
            
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
            let t:Entity = new Entity(this.width + tWidth, Math.random()*this.height, tWidth, tHeight, "#999999");
            this.terrain.push(t);
            //console.log(t);
        }

        this.terrain.forEach((t, index) => {
            //console.log(t.x, t.y);
            t.x -= this.player.speed;
            if(t.collide(this.player)) {
                this.player.damage(1);
            }
            if(t.x < -t.width) {
                this.terrain.splice(index,1);
            
            }
            this.shrapnel.forEach((s,index) => {
                if(s.collide(t)) {
                    s.vy *= -1;
                    s.y += s.vy;
                    // if it's still collide after rebounding, just remove it.
                    if(s.collide(t)) {
                        this.shrapnel.splice(index,1);
                    }
                }
            })
            this.enemies.forEach((e,index) => {
                if(e.collide(t)) {
                    e.kill();
                    this.explode(e.x, e.y);
                    this.blastShrapnel(e.x, e.y, 4, e.width/2);
                }
            });
            this.playerBullets.forEach((pb,index) => {
                if (pb.collide(t)) {
                    this.playerBullets.splice(index,1);
                };
            });
            this.enemyBullets.forEach((eb,index) => {
                if(eb.collide(t)) {
                    this.enemyBullets.splice(index,1);
                }
            });
        });
        
        
        if (this.player.alive()) {
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
                    let p:Particle;
                    if (this.particlePool.length > 0) {
                        p = this.particlePool.pop();
                        p.init();
                        p.x = this.player.x - Math.random()*16;
                        p.y = this.player.y + smokeY;
                    } else {
                        p = new Particle(this.player.x, this.player.y+smokeY, "white", 30);
                        
                    }
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
        
        this.playerBullets.forEach((b, playerBulletIndex) => {
            b.update();
            if (b.x > this.width || b.x < 0 || b.y > this.height || b.y < 0) {
                this.playerBullets.splice(playerBulletIndex,1);
            }
            this.enemies.forEach((e,enemyIndex) => {
                if(b.collide(e)) {
                    e.damage(1);
                    this.playerBullets.splice(playerBulletIndex,1);
                    if(e.isDead()) {
                        if(e.hasPowerUp) {
                            this.powerUps.push(new PowerUp(e.x, e.y));
                        }
                        this.enemies.splice(enemyIndex,1);
                        this.enemyPool.push(e);
                        e.kill();
                        this.explode(e.x, e.y);
                        this.blastShrapnel(e.x, e.y, 4, e.width/2);
                    }
                }
            })
        });

        this.enemyBullets.forEach((b, index) => {
            b.update();
            if (b.x > this.width || b.x < 0 || b.y > this.height || b.y < 0) {
                this.enemyBullets.splice(index,1);
            } else if (this.player.alive() && b.collide(this.player)) {
                this.enemyBullets.splice(index,1);
                this.entityPool.push(b);
                this.player.damage(1);
                
            }
            
        });

        this.enemies.forEach((enemy, index) => {
            enemy.update();
            if(enemy.collide(this.player)) {
                this.enemies.splice(index,1);
                this.enemyPool.push(enemy);
                this.player.damage(3);
                this.explode(enemy.x, enemy.y, 24);
            }
            if(enemy.done()) {
                this.enemies.splice(index,1);
                this.enemyPool.push(enemy);
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
                this.powerUps.push(w.spawnPowerUp());
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
            if (p.collide(this.player)) {
                this.powerUps.splice(index,1);
                this.player.powerUp(p.getPowerLevel());
            }
        });

        this.particles.forEach((p, index) => {
            p.update();
            p.width *= 0.97;
            p.height = p.width;
            if(p.width <= 1) {
                p.kill();
            }
            if(p.isDead()) {
                this.particles.splice(index,1);
                this.particlePool.push(p);
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
            if(s.isDead()) {
                this.shrapnel.splice(index,1);
                this.entityPool.push(s);
            } else {
                if(s.collide(this.player)) {
                    this.player.damage(1);
                    s.kill();
                }
            }
            this.playerBullets.forEach((pb, index2) => {
                if (pb.collide(s)) {
                    this.playerBullets.splice(index2,1);
                    this.shrapnel.splice(index,1);
                    if(s.width >= 8) {
                        this.blastShrapnel(s.x, s.y, 2, s.width/2)
                    } else {
                        let r:number = Math.random();
                        if(r > 0.75) {
                            this.powerUps.push(new PowerUp(s.x, s.y))
                        }
                        
                    }
                }
            });
            

        })

        
        if(this.player.isDead() && !this.lostGame) {
            
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


    private onEnemyFireBullet(e) {
        let enemyBullet:Entity = e.detail;
        enemyBullet.init();
        let dx:number = this.player.x - enemyBullet.x;
        let dy:number = this.player.y - enemyBullet.y;
        let dir:number = Math.atan2(dy, dx) * 180 / Math.PI;
        enemyBullet.launch(dir, 5);        
        this.enemyBullets.push(e.detail);
    }

    private onPlayerFireBullet(e) {
        this.playerBullets.push(e.detail);
    }

    private blastShrapnel(x:number, y:number, amount:number = 1, size:number=10) {
        let i:number = 1;
        while(i<=amount) {
            let s:Entity;
            if(this.entityPool.length > 0) {
                s = this.entityPool.pop();
                s.init();
                s.x = x;
                s.y = y;
                s.width = size;
                s.height = size;
                s.color ="red"
            } else {
                s = new Entity(x,y,size,size,"red");
            }
            
            s.launch(Math.random()*360,3);
            this.shrapnel.push(s);
            i++;
        }
    }

    private explode(x:number,y:number,amount:number=14, color:string="white") {
        let i:number = 0;
        let increment:number = 360/amount;
        while(i<amount) {
            let p:Particle;
            
            if(this.particlePool.length > 0) {
                p = this.particlePool.pop();
                p.init();
                p.x = x;
                p.y = y;
                p.color = color;
            } else {
                p = new Particle(x,y, color);
            }
            p.launch(increment*i + Math.random()*increment,1+Math.random()*amount/10);
            this.particles.push(p);
            i++;
        }       
        
    }

    public end() {
        //this.player.kill();
        this.lostGame = true;
        document.dispatchEvent(new CustomEvent("LoadState", { detail: "GameOverState"}));

    }

    public win() {
        this.wonGame = true;
        document.dispatchEvent(new CustomEvent("LoadState", { detail: "WinState"}));

    }

    public exit():void {
        if(this.player.isDead()) {
            this.explode(this.player.x, this.player.y, 50);
            this.explode(this.player.x+50*Math.random(), this.player.y+50*Math.random(), 50);
            this.explode(this.player.x-50*Math.random(), this.player.y-50*Math.random(), 50);
            this.explode(this.player.x+50*Math.random(), this.player.y-50*Math.random(), 50);
            this.explode(this.player.x-50*Math.random(), this.player.y+50*Math.random(), 50);
        } else {
            
            this.player.autopilot = true;
        }
        
    }

    public render(ctx:CanvasRenderingContext2D):void {
        this.renderFlip++;
        if (this.renderFlip >=8) {
            this.renderFlip = 0;
        }

        this.starfield.scroll(this.player.speed, 0);
        this.terrain.forEach((t, index) => {
            t.render(ctx);
        });
        
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
        this.powerUps.forEach((p) => {
            p.render(ctx);
        })
        this.particles.forEach((p) => {
            p.render(ctx);
        })
        this.shrapnel.forEach((s) => {
            s.render(ctx);
        })
       
        for(let i:number=0; i<this.chargesToWin; i++) {
            let e:Entity = new Entity(25+ i * 15, this.height-25, 10, 25, "#000066");
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