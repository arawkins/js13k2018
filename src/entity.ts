
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
    public power: number;

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
        this.power = power;
    }

    public update():void {
        this.vx += this.ax;
        this.vy += this.ay;
        this.x += this.vx;
        this.y += this.vy;
    }

    public moveLeft():void {
        this.ax = -this.power;
    }

    public moveRight():void {
        this.ax = this.power;
    }

    public moveUp():void {
        this.ay = -this.power;
    }

    public moveDown():void {
        this.ay = this.power;
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
        ctx.restore();
    }
}
