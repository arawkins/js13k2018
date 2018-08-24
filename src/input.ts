class KeyState {
    private key:string;
    private down:boolean;
    private downFor:number;
    private wasDown:boolean;
    private wasDownClearTimer:number;

    constructor(key:string) {
        this.key = key;
    }

    public press() {
        if (!this.down) {
            this.down = true;
            this.downFor = 0;    
        }
    }

    public release() {
        this.down = false;
        this.wasDown = true;
        this.wasDownClearTimer = 0;
    }

    public update() {
        if(this.down) {
            this.downFor++;
        }
        if (this.wasDown) {
            this.wasDownClearTimer++;
            if (this.wasDownClearTimer > 1) {
                this.wasDown = false;
            }
        }
    }

    public isDown():boolean {
        return this.down;
    }

    public released():boolean {
        return this.wasDown;
    }
}

export class Keyboard {

    static UP:string = "ArrowUp";
    static DOWN:string = "ArrowDown";
    static LEFT:string = "ArrowLeft";
    static RIGHT:string = "ArrowRight";

    private keys:Object;

    constructor() {

        this.keys = {};

        document.onkeydown = (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key].press();
            } else {
                let ks = new KeyState(e.key);
                this.keys[e.key] = ks;
                ks.press();
            }
        }

        document.onkeyup = (e) => {
            this.keys[e.key].release();
        }
    }

    public isDown(key:string):boolean {
        if (this.keys.hasOwnProperty(key)) {
            return this.keys[key].isDown();
        } else {
            return false;
        }
    }

    public released(key:string):boolean {
        if (this.keys.hasOwnProperty(key)) {
            return this.keys[key].released();
        } else {
            return false;
        }
    }


    public update() {
        for (const key in this.keys) {
            if (this.keys.hasOwnProperty(key)) {
                const element = this.keys[key];
                element.update();
            }
        }
    }
}