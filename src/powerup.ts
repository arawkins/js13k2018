import { Entity } from './entity';

export class PowerUp extends Entity {

    constructor(x:number,y:number) {
        super(x,y,12,12,"orange");
        this.launch(Math.random()*360,2);
    }

    public getPowerLevel():number {
        return 1;
    }
    
    public render(ctx:CanvasRenderingContext2D) {
        super.renderCircle(ctx);
    }
}