import {Entity} from './entity';

export class Starfield {
    private stars:Array<Entity>;
    private stars2:Array<Entity>;
    private stars3:Array<Entity>;
    private allStars:Array<Entity>;
    private width:number;
    private height:number;
    
    constructor(width:number, height:number) {
        this.stars = [];
        this.stars2= [];
        this.stars3=[];
        this.allStars=[];
        this.width = width;
        this.height = height;
        for(let i=0; i<25; i++) {
            let s1:Entity = new Entity(Math.random()*width, Math.random()*height, 1, 1, "white");
            s1.alpha = 0.25;
            let s2:Entity = new Entity(Math.random()*width, Math.random()*height, 2, 2, "white");
            s2.alpha = 0.35;
            let s3:Entity = new Entity(Math.random()*width, Math.random()*height, 3, 3, "white");
            s3.alpha = 0.45;
            this.stars.push(s1);
            this.stars2.push(s2);
            this.stars3.push(s3);
            this.allStars.push(s1);
            this.allStars.push(s2);
            this.allStars.push(s3);
        }
    }

    public scroll(vx:number, vy:number) {
        this.stars.forEach((s) => {
            s.x += -1 * vx;
            s.y += -1 * vy;
        })
        this.stars2.forEach((s) => {
            s.x += -2 * vx;
            s.y += -2 * vy;
        })
        this.stars3.forEach((s) => {
            s.x += -3 * vx;
            s.y += -3 * vy;
        })
    }

    public update():void {
        this.allStars.forEach(s => {
            s.update();
            if(s.x < 0) {
                s.x += this.width + 10;
                s.y = Math.random() * this.height;
            }
        });
        
    }

    public render(ctx:CanvasRenderingContext2D):void {
        this.allStars.forEach(s => {
            s.render(ctx);
        });
    }
}