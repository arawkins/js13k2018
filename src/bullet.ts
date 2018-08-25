import { Entity } from './entity';

export class Bullet extends Entity {

    constructor(x: number, y: number) {
        super(x, y);
        this.width = 2;
        this.height = 2;
        this.color = "pink";
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    }
}
