
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
    

    // keep dir protected to control radian/degree conversions
    protected dir: number;
    protected startupTime: number;
    protected startupCounter: number;
    protected startedUp: boolean;
    protected shutdownCounter:number;
    protected shutdownTime:number;
    protected minAlpha:number;
    protected basePower:number;

    constructor(x: number, y: number, width: number = 32, height: number = 32, color: string="white", power:number = 0.5) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.width = width;
        this.height = height;
        this.color = color;
        this.basePower = power;
        this.dir = 0;
        this.alpha = 1;
        this.startupTime = 45;
        this.startedUp = false;
        this.shutdownTime = 45;
        this.shutdownCounter = 0;
        this.startupCounter = 0;
        this.minAlpha = 0.2;
    }

    public update():void {
        this.vx += this.ax;
        this.vy += this.ay;
        this.x += this.vx;
        this.y += this.vy;
    }

    public reset() {
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.startedUp = false;
        this.startupCounter = 0;
        this.shutdownCounter = 0;
        this.dir = 0;
    }

    public power():number {
        return this.basePower;
    }

    public startup():void {
        this.shutdownCounter = 0;
        if(!this.startedUp) {
            this.startupCounter++;
            if (this.startupCounter > this.startupTime) {
                this.startupCounter = this.startupTime;
                this.startedUp = true;
            }
        }
    }


    public shutdown():void {
        this.startupCounter = 0;
        if(this.startedUp) {
            this.shutdownCounter++
            if(this.shutdownCounter > this.shutdownTime) {
                this.shutdownCounter = 0;
                this.startedUp = false;
            }
        } 
    }

    public online():boolean {
        return this.startedUp;
    }

    public launch(direction:number, speed:number) {
        this.turnTo(direction);
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

    protected renderCircle(ctx:CanvasRenderingContext2D) {
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }

    protected renderSquare(ctx:CanvasRenderingContext2D) {
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.rect(this.x-this.width/2, this.y-this.height/2, this.width, this.height);
        ctx.fill();
        ctx.restore();
    }

    protected adjustRenderAlpha() {
        if(this.online()) {
            this.alpha += 0.05;
            if (this.alpha > 1) { this.alpha = 1 }
        } else {
            this.alpha -= 0.05;
            if (this.alpha < this.minAlpha) { this.alpha = this.minAlpha };
        } 
    }

    public render(ctx: CanvasRenderingContext2D): void {
        this.adjustRenderAlpha();
        this.renderSquare(ctx);
    }
}
