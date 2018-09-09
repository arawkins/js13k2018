import { Enemy } from './enemy';
import { PowerUp } from './powerup';

export class Wave {

    public started:boolean;

    private enemies:Array<Enemy>;
    private commands:Array<WaveCommand>;
    private enemySpacing:number;
    private y:number;
    private x:number;
    private startTime:number;
    private startCounter:number;
    private enemyType:number;
    private finalEnemy:Enemy;

    constructor(x:number, y:number, startTimeInSeconds:number, numEnemies:number, enemyType:number = 1) {
        this.enemies = [];
        this.commands = [];
        this.enemySpacing = 20;
        this.y = y;
        this.x = x;
        this.startTime = startTimeInSeconds * 60;
        this.startCounter = 0;
        this.enemyType = enemyType;
        this.started = false;
        while(this.enemies.length < numEnemies) {
            let e:Enemy = new Enemy(this.x, this.y);
            this.enemies.push(e);
        }
    }

    public update():void {
        if(!this.started) {
            this.startCounter++;
        }
        if(!this.cleared()) {
            for(let i:number=this.enemies.length-1; i>=0; i--) {
                let e:Enemy = this.enemies[i];
                if(e.alive()) {
                    this.finalEnemy = e;
                    break;
                }
            }
        }
    }

    public ready():boolean {
        return this.startCounter > this.startTime;
    }

    public getEnemies():Array<Enemy> {
        return this.enemies;
    }

    public cleared():boolean {
        let cleared = true;
        this.enemies.forEach((e) => {
            if (!e.isDead()) {
                cleared = false;
            }
        })
        return cleared;
    }

    public start():void {
        this.started = true;
        this.startCounter = 0;
        this.enemies.forEach((e, index) => {
            // if this is not the first enemy, add a wait command at 
            // the beginning of it's command list to space out the enemies
            if(index > 0) {
                let wc:WaveCommand = new WaveCommand();
                wc.duration = this.enemySpacing * index;
                e.addCommand(wc);
            }
            this.commands.forEach((c) => {
                e.addCommand(c);
            })
        })
        this.finalEnemy = this.enemies[this.enemies.length-1];
    }

    public move(dir:number, seconds:number, speed:number=1) {
        let c:WaveCommand = new WaveCommand();
        c.duration = seconds * 60; // 60fps, so it should last 60 times per second of duration
        c.dir = dir;
        c.speed = speed;
        this.commands.push(c);
    }

    public fire() {
        let c:WaveCommand = new WaveCommand();
        c.fire = true;
        this.commands.push(c);
    }

    public wait(seconds:number) {
        let c:WaveCommand = new WaveCommand();
        c.fire = false;
        c.duration = seconds * 60; // 60fps, so it should last 60 times per second of duration
        this.commands.push(c);
    }

    public addEnemy(e:Enemy) {
        this.enemies.push(e);
    }

    public spawnPowerUp():PowerUp {
        return new PowerUp(this.finalEnemy.x, this.finalEnemy.y);
    }
}

export class WaveCommand {
    public duration:number;
    public fire:boolean;
    public dir:number;
    public speed:number;

    constructor() {
        this.dir = null;
        this.speed = 0;
        this.fire = false;
        this.duration = 0;
    }

}