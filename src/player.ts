import { Entity } from './entity';

export class Player extends Entity {

    private powerLevel:number;

    constructor(x: number, y: number) {
        super(x,y);
        this.color = "white";
        this.init();
    }

    public init() {
        this.powerLevel = 0;
        this.basePower = 0.25;
    }

    public powerUp(amount:number) {
        this.powerLevel += amount;
    }

    public spendPower(amount:number):boolean {
        if (this.powerLevel >= amount) {
            this.powerLevel -= amount;
            return true;
        }
        return false;
    }

    public getPowerLevel():number {
        return this.powerLevel;
    }

    public fire():void {
        let newBullet:Entity = new Entity(this.x+this.width/2, this.y, 15,5,"pink");
        newBullet.launch(0,20);
        document.dispatchEvent(new CustomEvent("PlayerFireBullet",{detail: newBullet}));
    }
}
