import { Entity } from './entity';

export class Player extends Entity {

    public charge:number;
    public chargeLevel:number;
    private startCharge:number;
    public speed:number;
    private rechargeCounter:number;
    private rechargeInterval:number;
    public offline:boolean;
    public autopilot:boolean;

    constructor() {
        super();
        this.color = "white";
        this.startCharge = 8;
        this.init(0,0);
    }

    public init(x: number, y: number) {
        super.init(x,y);
        this.chargeLevel = this.startCharge;
        this.charge = this.chargeLevel;
        this.basePower = 0.25;
        this.rechargeCounter = 0;
        this.rechargeInterval = 30;
        this.speed = 2;
        this.hp = 3;
        this.offline = false;
        this.autopilot = false;
    }

    public powerUp(amount:number) {
        if(this.hp <3) {
            this.hp += amount;
        } else {
            this.chargeLevel += amount;
        }
        this.offline = false;
        this.charge += amount;
        if(this.charge > this.chargeLevel) {
            this.charge = this.chargeLevel;
        }
    }

    public getChargeLevel():number {
        return this.chargeLevel;
    }

    public power():number {
        if(this.offline) {
            return this.basePower / 2;
        } else {
            return this.basePower + this.speed * 0.025 / 2;
        }
    }

    public damage(amount:number) {
        if(this.offline) {
            this.kill();
        }
        else if(this.charge > 0) {
            this.charge -= amount
            if(this.charge <= 0) {
                this.charge = 0;
            }
        } 
        
    }

    public launchBullet(x:number,y:number,dir:number,width:number=15,height:number=5) {
        let detail:Object = {
            x,
            y,
            dir,
            width,
            height
        }
        document.dispatchEvent(new CustomEvent("PlayerFireBullet",{detail: detail}));
    }

    public fire():void {
        if(!this.offline && this.charge > 0) {
            if(this.chargeLevel >= 10) {
                this.launchBullet(this.x, this.y-5,0);
                this.launchBullet(this.x, this.y+5,0);
            } else {
                this.launchBullet(this.x, this.y,0);
            }
            if(this.chargeLevel >= 12) {
                this.launchBullet(this.x, this.y-10,340,7.5,7.5);
                this.launchBullet(this.x, this.y+10,20,7.5,7.5);
            }
            if(this.chargeLevel >= 11) {
                this.launchBullet(this.x,this.y,180);
            }
            if(this.chargeLevel >= 14) {
                this.launchBullet(this.x, this.y, 270,5,15);
                this.launchBullet(this.x, this.y, 90, 5,15);
            }
            if(this.chargeLevel >= 20) {
                this.launchBullet(this.x, this.y-20,0);
                this.launchBullet(this.x, this.y+20,0)
            }
            this.charge -= 1;
            this.rechargeCounter = 0;
        }
    }

    public update():void {
        super.update();
        
        this.speed = 2 + this.chargeLevel - this.startCharge;
        if(this.speed < 2) {
            this.speed = 2;
        }
        
        if(this.charge < this.chargeLevel) {
            this.rechargeCounter++;
            if(this.rechargeCounter >= this.rechargeInterval) {
                this.rechargeCounter = 0;
                this.charge++;
            }
        } else {
            this.offline = false;
        }
        if(this.charge == 0) {
            this.offline = true;
        }
    }

    public render(ctx:CanvasRenderingContext2D) {
        if(this.alive()) {
            super.renderSquare(ctx,!this.offline)
        }
    }
}
