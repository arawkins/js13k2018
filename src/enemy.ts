import { Entity } from './entity';
import { WaveCommand } from './wave';

export class Enemy extends Entity {

    private rateOfFire:number = 0;
    private fireCounter:number = 0;
    private commands:Array<WaveCommand>;
    private commandCounter:number = 0;
    private executedCurrentCommand:boolean;

    public hasPowerUp:boolean;
    

    constructor() {
        super();
        this.commands = [];
        this.commandCounter = 0;
        this.executedCurrentCommand = false;
        this.hasPowerUp = false;
    }

    public fire():void {
        this.fireCounter++;
        if (this.fireCounter >= this.rateOfFire) {
            this.fireCounter = 0;
            document.dispatchEvent(new CustomEvent("EnemyFireBullet",{detail: {x:this.x, y:this.y}}));
        }
        
    }

    public init(x:number, y:number):void {
        super.init(x,y);
        this.commands = [];
        this.executedCurrentCommand = false;
        this.hasPowerUp = false;
        this.commandCounter = 0;
        this.color="red"
    }
   
    public kill():void {
        super.kill();
        this.commands = [];
    }

    public addCommand(wc:WaveCommand):void {
        this.commands.push(wc);
    }

    public done():boolean {
        return this.commands.length == 0;
    }

    public update():void {
        super.update();
        if(this.commands.length > 0) {
            let wc:WaveCommand = this.commands[0];
            if(!this.executedCurrentCommand) {
                this.executeCommand(wc);
                this.executedCurrentCommand = true;
            }
            this.commandCounter++;
            if(this.commandCounter >= wc.duration) {
                this.commandCounter = 0;
                this.executedCurrentCommand = false;
                this.commands.shift();
            }
        }
    }

    public executeCommand(wc:WaveCommand):void {
        if(wc.fire) {
            this.fire();
        }

        if(wc.dir != null && wc.speed != null) {
            this.launch(wc.dir, wc.speed);
        }
    }
}
