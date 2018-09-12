
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
    private dead:boolean;
    

    // keep dir protected to control radian/degree conversions
    protected dir: number;
    protected basePower:number;

    constructor(x: number=0, y: number=0, width: number = 32, height: number = 32, color: string="white") {
        this.basePower = 0.5;
        this.hp = 1;
        this.init(x,y,width,height,color);
    }

    public init(x: number=0, y: number=0, width: number = 32, height: number = 32, color: string="white") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.dir = 0;
        this.dead = false;
        this.hp = 1;
        this.alpha = 1;
    }

    public update():void {
        this.vx += this.ax;
        this.vy += this.ay;
        this.x += this.vx;
        this.y += this.vy;
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

    public isDead():boolean {
        return this.dead;
    }

    public alive():boolean {
        return !this.dead;
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
        if(!this.isDead()) {
            this.renderSquare(ctx,drawFill);
        }
        
    }
}


export class EntityPool {
    private entities:Array<Entity>;

    constructor() {
        this.entities = [];
    }

    public getEntity(x:number=0,y:number=0,width:number=32,height:number=32,color:string="white"):Entity {
        let e:Entity;
        if (this.entities.length > 0) {
            e = this.entities.pop();
        } else {
            e = new Entity();
        }
        e.init(x,y,width,height,color);;
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