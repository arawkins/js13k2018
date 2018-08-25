import { Entity } from './entity';

export class Player extends Entity {

    constructor(x: number, y: number) {
        super(x,y);
        this.color = "blue";
        this.power = 0.25;
    }
}
