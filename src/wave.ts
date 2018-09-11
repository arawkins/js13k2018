import { EntityPool, Entity } from './entity';

export class Wave {

    public started:boolean;

    private enemies:Array<Entity>;
    private commands:Array<WaveCommand>;
    private enemySpacing:number;
    public lastEnemy:Entity;
    public y:number;
    public x:number;
    private startTime:number;
    private startCounter:number;

    constructor(x:number, y:number, startTimeInSeconds:number, numEnemies:number, enemyPool:EntityPool) {
        this.enemies = [];
        this.commands = [];
        this.enemySpacing = 20;
        this.y = y;
        this.x = x;
        this.startTime = startTimeInSeconds * 60;
        this.startCounter = 0;
        this.started = false;
        while(this.enemies.length < numEnemies) {
            let e:Entity = enemyPool.getEntity(this.x, this.y, 32,32,"red",999999);
            this.enemies.push(e);
        }
        this.lastEnemy = this.enemies[this.enemies.length-1];
    }

    public update():void {
        if(!this.started) {
            this.startCounter++;
        }
        this.enemies.forEach((e) => {
            if(!e.dead) {
                this.lastEnemy = e;
            }
        });
    }

    public ready():boolean {
        return this.startCounter > this.startTime;
    }

    public getEnemies():Array<Entity> {
        return this.enemies;
    }

    public cleared():boolean {
        let cleared = true;
        this.enemies.forEach((e) => {
            if (!e.dead) {
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
        
    }

    public move(dir:number, seconds:number, speed:number=1) {
        let c:WaveCommand = new WaveCommand();
        c.duration = seconds * 60; // 60fps, so it should last 60 times per second of duration
        c.dir = dir;
        c.speed = speed;
        this.commands.push(c);
    }

    public addEnemy(e:Entity) {
        this.enemies.push(e);
    }

    public destroy() {
        this.enemies = [];
        this.commands = [];
        this.lastEnemy = null;
    }

}

export class WaveCommand {
    public duration:number;
    public dir:number;
    public speed:number;

    constructor() {
        this.dir = null;
        this.speed = 0;
        this.duration = 0;
    }

}