import { Entity } from './entity';
import { WaveCommand } from './wave';

export class Enemy extends Entity {

    private rateOfFire:number = 0;
    private fireCounter:number = 0;
    private commands:Array<WaveCommand>;
    private commandCounter:number = 0;
    private executedCurrentCommand:boolean;
    

    constructor(x:number,y:number) {
        super(x,y);
        this.commands = [];
        this.commandCounter = 0;
        this.color = "red";
        this.executedCurrentCommand = false;
    }

    public fire():void {
        this.fireCounter++;
        if (this.fireCounter >= this.rateOfFire) {
            this.fireCounter = 0;
            let bullet:Entity = new Entity(this.x, this.y, 5,5,"red");                                 
            document.dispatchEvent(new CustomEvent("EnemyFireBullet",{detail: bullet}));
        }
        
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
