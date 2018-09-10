import { State } from './state';

export class TitleScreenState extends State {
    private titleDiv;
    private container;

    constructor() {
        super();
        this.container = document.getElementById("container");
        this.titleDiv = document.createElement("div");
        this.titleDiv.id = "title";
        let title = document.createElement("h1");
        title.innerHTML = "SPACE<BR>METER";
        this.titleDiv.appendChild(title);
        let instructions = document.createElement("p");
        instructions.innerHTML = "<p>Use arrow keys to move<br>Z to fire.<br>Collect yellow orbs to power the meter.<br>Fully power the meter to win.<br>Shooting and getting hit depletes the meter.<br>Fully deplete the meter you'll go offline.<br>Get hit while offline and that's it.";
        this.titleDiv.appendChild(instructions);
        let startButton = document.createElement("button");
        startButton.innerHTML = "Start";
        startButton.onclick = function() {
            document.dispatchEvent(new CustomEvent("LoadState", {detail:"GameState"}));
        }
        instructions.appendChild(startButton);
    }

    public enter():void {
        this.container.appendChild(this.titleDiv);
    }

    public exit():void {
        this.container.removeChild(this.titleDiv);
    }
}