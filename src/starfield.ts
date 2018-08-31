import {Entity} from './entity';

export class Starfield {
    private stars:Array<Entity>;
    private width:number;
    private height:number;
    
    constructor(width:number, height:number) {
        this.stars = [];
        this.width = width;
        this.height = height;
        for(let i=0; i<25; i++) {
            let s1:Entity = new Entity(Math.random()*width, Math.random()*height, 1, 1, "white");
            s1.vx = -1;
            s1.alpha = 0.25;
            let s2:Entity = new Entity(Math.random()*width, Math.random()*height, 2, 2, "white");
            s2.vx = -2;
            s2.alpha = 0.35;
            let s3:Entity = new Entity(Math.random()*width, Math.random()*height, 3, 3, "white");
            s3.vx = -3;
            s3.alpha = 0.45;
            this.stars.push(s1);
            this.stars.push(s2);
            this.stars.push(s3);
        }
    }

    public update():void {
        this.stars.forEach(s => {
            s.update();
            if(s.x < 0) {
                s.x += this.width + 10;
                s.y = Math.random() * this.height;
            }
        });
    }

    public render(ctx:CanvasRenderingContext2D):void {
        this.stars.forEach(s => {
            s.render(ctx);
        });
    }
}