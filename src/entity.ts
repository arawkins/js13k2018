import { WaveCommand } from './wave';

export class Entity {
    public x: number;
    public y: number;
    public vx: number;
    public vy: number;
    public ax: number;
    public ay: number;
    public width: number;
    public height: number;
    public color: string;
    public alpha: number;
    public hp:number;
    public lifeTime:number;
    public currentLife:number;
    public dead:boolean;

    // keep dir protected to control radian/degree conversions
    protected dir: number;
    protected basePower:number;

    private commands:Array<EntityCommand>;
    private commandCounter:number = 0;
    private executedCurrentCommand:boolean;
    
    public update():void {
        this.vx += this.ax;
        this.vy += this.ay;
        this.x += this.vx;
        this.y += this.vy;
        this.currentLife--;
        if (this.currentLife <= 0) {
            this.kill();
        }
        if(this.commands.length > 0) {
            let wc:WaveCommand = this.commands[0];
            if(!this.executedCurrentCommand) {
                this.executeCommand(wc);
                this.executedCurrentCommand = true;
            }
            this.commandCounter++;
            if(this.commandCounter >= wc.duration) {
                this.commandCounter = 0;
                this.executedCurrentCommand = false;
                this.commands.shift();
            }
        }
    }

    public init(x:number=0, y:number=0,width:number=32, height:number=32, color:string="white", lifeTime:number = 999999) {
        this.x = x;
        this.y = y;
        this.width=width;
        this.height = height;
        this.color = color;
        this.lifeTime = lifeTime;
        this.currentLife = this.lifeTime;
        this.alpha = 1;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.dir = 0;
        this.dead = false;
        this.hp = 1;
        this.commands = [];
        this.executedCurrentCommand = false;
        this.commandCounter = 0;
    }
    
    public addCommand(c:EntityCommand):void {
        this.commands.push(c);
    }

    public done():boolean {
        return this.commands.length == 0;
    }

    public executeCommand(c:EntityCommand):void {
        if(c.dir != null && c.speed != null) {
            this.launch(c.dir, c.speed);
        }
    }

    public damage(amount:number) {
        this.hp -= amount;
        if(this.hp <=0) {
            this.kill();
        }
    }

    public kill():void {
        this.dead = true;
    }

    public power():number {
        return this.basePower;
    }

    public launch(directionInDegrees:number, speed:number) {
        this.turnTo(directionInDegrees);
        this.vx = speed * Math.cos(this.dir);
        this.vy = speed * Math.sin(this.dir);
    }

    public accelerate() {
        this.ax = Math.cos(this.dir) * this.power();
        this.ay = Math.sin(this.dir) * this.power();
    }

    public turnTo(directionInDegrees:number) {
        this.dir = directionInDegrees * Math.PI / 180; // convert to radians
    }

    public pointAt(targetEntity:Entity) {
        this.dir = Math.atan2(targetEntity.y - this.y, targetEntity.x - this.x);
    }

    public collide(targetEntity:Entity):boolean {
        if (this.x + this.width/2 > targetEntity.x - targetEntity.width/2) {
            if (this.x - this.width/2 < targetEntity.x + targetEntity.width/2) {
                if (this.y + this.height/2 > targetEntity.y - targetEntity.height/2) {
                    if (this.y - this.height/2 < targetEntity.y + targetEntity.height/2) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public fade() {
        this.alpha = this.currentLife / this.lifeTime;
        if(this.alpha < 0) {
            this.alpha = 0;
            this.kill();
        }
    }

    protected renderCircle(ctx:CanvasRenderingContext2D, offsetX:number=0,offsetY:number=0) {
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.arc(this.x+offsetX, this.y+offsetY, this.width, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }

    protected renderSquare(ctx:CanvasRenderingContext2D, drawFill:boolean = true) {
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = this.alpha;
        
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;

        ctx.rect(this.x-this.width/2, this.y-this.height/2, this.width, this.height);
        if (drawFill) {
            ctx.fill();
        } else {
            ctx.stroke();
        
        }
        ctx.restore();
    }


    public render(ctx: CanvasRenderingContext2D,drawFill:boolean = true): void {
        if(!this.dead) {
            this.renderSquare(ctx,drawFill);
        }   
    }
}

export class EntityPool {
    private entities:Array<Entity>;

    constructor() {
        this.entities = [];
    }

    public getEntity(x:number=0,y:number=0,width:number=32,height:number=32,color:string="white",lifeTime:number=999999):Entity {
        let e:Entity;
        if (this.entities.length > 0) {
            e = this.entities.pop();
        } else {
            e = new Entity()
        }
        e.init(x,y,width,height,color,lifeTime);
        return e;
    }

    public recycleEntity(e:Entity) {
        this.entities.push(e);
    }
    
    public recycle(arr:Array<Entity>) {
        arr.forEach((e) => {
            this.entities.push(e);
        });
    }
}

export class EntityCommand {
    public duration:number;
    public dir:number;
    public speed:number;

    constructor(dir:number, duration:number, speed:number) {
        this.dir = dir;
        this.speed = speed;
        this.duration = duration;
    }

}
