import { Entity } from './entity';

export class Wall extends Entity {
    constructor(x:number, y:number, width:number, height:number) {
        super(x,y,width,height);
        this.alpha = 1;
        this.color = "#999999";
    }

    public online():boolean {
        return true;
    }
}