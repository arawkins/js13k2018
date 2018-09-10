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

    constructor(x: number, y: number) {
        super(x,y);
        this.color = "white";

        this.startCharge = 8;
        this.init();
    }

    public init() {
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



    public spendPower(amount:number):boolean {
        if (this.chargeLevel >= amount) {
            this.chargeLevel -= amount;
            return true;
        }
        return false;
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

    public fire():void {
        if(!this.offline && this.charge > 0) {
            let newBullet:Entity = new Entity(this.x, this.y, 15,5,"pink");
            if(this.chargeLevel >= 10) {
                newBullet.y += 5;
                let bullet2:Entity = new Entity(this.x, this.y-5,15,5,"pink");
                bullet2.launch(0,20);
                document.dispatchEvent(new CustomEvent("PlayerFireBullet",{detail: bullet2}));
            }
            newBullet.launch(0,20);
            
            document.dispatchEvent(new CustomEvent("PlayerFireBullet",{detail: newBullet}));

            if(this.chargeLevel >= 12) {
                let b3:Entity = new Entity(this.x, this.y-10, 7.5,7.5, "pink");
                let b4:Entity = new Entity(this.x, this.y+10, 7.5,7.5, "pink");
                b3.launch(340,20);
                b4.launch(20,20);
                document.dispatchEvent(new CustomEvent("PlayerFireBullet",{detail: b3}));
                document.dispatchEvent(new CustomEvent("PlayerFireBullet",{detail: b4}));
            }

            if(this.chargeLevel >= 11) {
                let b5:Entity = new Entity(this.x, this.y, 15,5,"pink");
                b5.launch(180,20);
                document.dispatchEvent(new CustomEvent("PlayerFireBullet",{detail: b5}));
            }

            if(this.chargeLevel >= 14) {
                let b6:Entity = new Entity(this.x, this.y, 5,15,"pink");
                let b7:Entity = new Entity(this.x, this.y, 5,15,"pink");
                b6.launch(270,20);
                b7.launch(90,20);
                document.dispatchEvent(new CustomEvent("PlayerFireBullet",{detail: b6}));
                document.dispatchEvent(new CustomEvent("PlayerFireBullet",{detail: b7}));
            }

            if(this.chargeLevel >= 20) {
                let b8:Entity = new Entity(this.x, this.y - 20, 15, 5, "pink");
                let b9:Entity = new Entity(this.x, this.y + 20, 15,5, "pink");
                b8.launch(0,20);
                b9.launch(0,20);
                document.dispatchEvent(new CustomEvent("PlayerFireBullet",{detail: b8}));
                document.dispatchEvent(new CustomEvent("PlayerFireBullet",{detail: b9}));
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
