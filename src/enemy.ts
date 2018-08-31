import { Entity } from './entity';

export class Turret extends Entity {

    private rateOfFire:number = 30;
    private fireCounter:number = 0;

    constructor(x:number,y:number) {
        super(x,y);
        this.color = "red";
        this.alpha = 0.2;
    }

    public fire() {
        this.fireCounter++;
        if (this.fireCounter >= this.rateOfFire) {
            this.fireCounter = 0;
            let bulletDetail = {
                x: this.x,
                y: this.y,
                dir: this.dir * 180/Math.PI,
                speed: 5
            }
            let fireBulletEvent = new CustomEvent("FireBullet",{detail: bulletDetail});
            document.dispatchEvent(fireBulletEvent);
        }
    }

    public render(ctx:CanvasRenderingContext2D) {
        
        super.render(ctx);
    }

}