import {Entity} from './entity';

export class Coin extends Entity {
    constructor(x:number, y:number) {
        super(x,y);
        this.startupTime = 150;
        this.color="yellow"
        this.width=7;
        this.height=7;
        this.minAlpha = 0;
        this.alpha = 0;
        this.shutdownTime = 30;
    }

    public render(ctx:CanvasRenderingContext2D) {
        this.adjustRenderAlpha();
        this.renderCircle(ctx);
    }
}