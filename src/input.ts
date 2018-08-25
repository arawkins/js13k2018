export class Keyboard {

    private keys:Object;

    constructor() {
        this.keys = {};

        document.onkeydown = (e) => {
            this.keys[e.key] = true;
        }

        document.onkeyup = (e) => {
            this.keys[e.key] = false;
        }
    }

    public isDown(key:string):boolean {
        if (this.keys.hasOwnProperty(key)) {
            return this.keys[key];
        } else {
            return false;
        }
    }
}
