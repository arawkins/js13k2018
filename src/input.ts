export class Keyboard {

    private keys:Object;

    constructor() {
        this.keys = {};

        document.onkeydown = (e) => {
            if(this.keys[e.key] == undefined) {
                this.keys[e.key] = {};
            }
            this.keys[e.key]["down"] = true;
        }

        document.onkeyup = (e) => {
            this.keys[e.key]["down"] = false;
            this.keys[e.key]["hit"] = true;
        }
    }

    public isDown(key:string):boolean {
        if (this.keys.hasOwnProperty(key)) {
            return this.keys[key]["down"];
        } else {
            return false;
        }
    }

    public hit(key:string):boolean {
        if (this.keys.hasOwnProperty(key)) {
            return this.keys[key]["hit"];
        } else {
            return false;
        } 
    }

    public update() {
        for (const key in this.keys) {
            if (this.keys.hasOwnProperty(key)) {
                const element = this.keys[key];
                element["hit"] = false;
            }
        }
    }
}
