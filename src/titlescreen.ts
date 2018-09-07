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
        title.innerHTML = "WARP<BR>OFFLINE";
        this.titleDiv.appendChild(title);
        let instructions = document.createElement("p");
        instructions.innerHTML = "<p>Use arrow keys to move<br>Z to fire.<br>Collect energy to power the warp core.";
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