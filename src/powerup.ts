import { Entity } from './entity';

export class PowerUp extends Entity {

    constructor(x:number,y:number) {
        super();
        super.init(x,y,8,8,"orange");
        this.launch(Math.random()*45,2);
    }
    
    public render(ctx:CanvasRenderingContext2D) {
        super.renderCircle(ctx);
    }
}