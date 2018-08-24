
export class Wall {
    public x:number;
    private height:number;
    private leftBound:number;
    private rightBound:number;
    private dir:number;
    private moveTimer:number;
    private moveCounter:number;
    private moving:boolean;
    private speed:number;

    constructor(height:number, startX:number, leftBound:number, rightBound:number, startDir:number) {
        this.height = height;
        this.x = startX;
        this.leftBound = leftBound;
        this.rightBound = rightBound;
        this.dir = startDir;
        this.resetMoveTimer();
        this.moving = false;
        this.speed = 2;
    }

    public update = ():void => {
        if (this.moving) {
            this.x += this.speed * this.dir;
            if ((this.dir >=1 && this.x > this.rightBound) || (this.dir <= -1 && this.x < this.leftBound)) {
                this.stopMoving();               
            }
        } else {
            this.moveCounter++;
            if (this.moveCounter >= this.moveTimer) {
                this.startMoving();
            }
        }  
    }

    private startMoving = ():void => {
        this.moving = true;
    }

    private resetMoveTimer = ():void => {
        this.moveCounter = 0;
        this.moveTimer = Math.random() * 300 + 20;
    }

    private stopMoving = ():void => {
        this.moving = false;
        this.resetMoveTimer();
        this.dir *= -1;
    }

    public draw = (ctx:CanvasRenderingContext2D):void => {
        ctx.save();
        if (!this.moving) {
            let timeToMove:number = this.moveTimer - this.moveCounter;
            if (timeToMove < 30 && timeToMove % 2 == 0) {
                ctx.strokeStyle = "white";
            } else {
                ctx.strokeStyle = "red";
            }
        } else {
            ctx.strokeStyle = "red";
        }
        
        ctx.beginPath();
        ctx.moveTo(this.x,0);
        ctx.lineTo(this.x, this.height);
        ctx.stroke(); 
        ctx.restore();
    }
}