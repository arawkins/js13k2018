import { Entity } from './entity';

export class Bullet extends Entity {

    constructor(x: number, y: number) {
        super(x, y);
        this.width = 5;
        this.height = 5;
        this.color = "pink";
    }

    public render(ctx: CanvasRenderingContext2D): void {
        this.renderCircle(ctx);
    }
}
