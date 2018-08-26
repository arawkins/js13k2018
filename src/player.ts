import { Entity } from './entity';

export class Player extends Entity {

    private onlineSpeedThreshold:number = 1;
    public speedBoost:number;

    constructor(x: number, y: number) {
        super(x,y);
        this.color = "blue";
        this.basePower = 0.25;
        this.speedBoost = 0;
    }

    public update() {
        super.update();
        let vz:number = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
    }

    public power():number {
        return this.basePower + this.speedBoost;
    }

    public online():boolean {
        return (Math.abs(this.vx) > this.onlineSpeedThreshold || Math.abs(this.vy) > this.onlineSpeedThreshold);
    }
}
