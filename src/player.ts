import { Entity } from './entity';

export class Player extends Entity {

    constructor(x: number, y: number) {
        super(x,y);
        this.color = "white";
        this.basePower = 0.25;
    }

    public fire():void {
        let newBullet:Entity = new Entity(this.x+this.width/2, this.y, 15,5,"pink");
        newBullet.launch(0,20);
        document.dispatchEvent(new CustomEvent("PlayerFireBullet",{detail: newBullet}));
    }
}
