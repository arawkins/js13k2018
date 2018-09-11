import { Entity } from './entity';
export class Particle extends Entity {

    public init() {
        super.init(0,0,12,12,"white",30);
    }

    public render(ctx:CanvasRenderingContext2D) {
        this.alpha = this.currentLife / this.lifeTime;
        if(this.alpha < 0) {
            this.alpha = 0;
        }
        super.render(ctx);
    }
}