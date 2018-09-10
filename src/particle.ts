import { Entity } from './entity';
export class Particle extends Entity {
    private lifeTime:number;
    private currentLife:number;

    constructor(x:number,y:number,color:string="white", lifeTime:number=30) {
        super(x,y,12,12,color);
        this.lifeTime = lifeTime;
        this.currentLife = this.lifeTime;
    }

    public init() {
        super.init();
        this.currentLife = this.lifeTime;
        this.alpha = 1;
        this.width=12;
        this.height=12;
    }
    public update() {
        super.update();
        this.currentLife--;
        if (this.currentLife <= 0) {
            this.kill();
        }
    }

    public render(ctx:CanvasRenderingContext2D) {
        this.alpha = this.currentLife / this.lifeTime;
        if(this.alpha < 0) {
            this.alpha = 0;
        }
        super.render(ctx);
    }
}