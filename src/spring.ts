import { Circle } from './circle';

export class Spring {
    private spring: number;
    private ball: Circle;
    private targetX: number;
    private friction: number;
    private held:boolean;
    private windAmount:number;
    private maxWind:number;

    constructor(spring:number, startX:number, startY:number, targetX:number) {
        this.targetX = targetX;
        this.spring = spring;
        this.friction = 0.98;
        this.ball = new Circle(startX, startY, 32);
        this.held = false;
        this.windAmount = 0;
        this.maxWind = 50;
    }

    public update = ():void => {
        if (!this.held) {
            let dx:number = this.targetX - this.ball.x;
            this.ball.ax = dx * this.spring;
            this.ball.vx *= this.friction;
            
        }
        this.ball.move();
    }

    public pull = (dx:number):void => {
        //this.ball.vx = 0;
        //this.ball.ax = 0;
        /*
        this.windAmount += dx;
        if (this.windAmount > this.maxWind) {
            this.windAmount = this.maxWind;
        } else if (this.windAmount < -this.maxWind) {
            this.windAmount = -this.maxWind;
        }*/
        this.held = true;
        this.ball.ax = 0.5*dx;
    }

    public release = ():void => {
        this.held = false;
        this.ball.vx += this.windAmount;
        this.windAmount = 0;
        this.ball.ax = 0;
    }

    public draw = (ctx:CanvasRenderingContext2D):void => {
        this.ball.draw(ctx);
    }
}