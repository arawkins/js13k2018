import { Entity } from './entity';

export class Bullet extends Entity {

    constructor(x: number, y: number) {
        super(x, y);
        this.width = 15;
        this.height = 5;
        this.color = "pink";
    }

}
