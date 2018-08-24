
export class Circle {
    public x: number = 0;
    public y: number = 0;
    public vx: number = 0;
    public vy: number = 0;
    public ax: number = 0;
    public ay: number = 0;

    public radius: number = 10;
    public lineWidth: number = 2;
    public color: string = "red";


    constructor(x: number, y: number, radius: number, color: string = "red", line_width: number = 2) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.color = color;
        this.lineWidth = line_width;
    }

    public move = (): void => {
        this.vx += this.ax;
        this.vy += this.ay;
        this.x += this.vx;
        this.y += this.vy;
        
    }

    public draw = (ctx: CanvasRenderingContext2D): void => {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();   
    }
}