import { State } from './state';

export class GameOverState extends State {
    private div;
    private container;

    constructor() {
        super();
        this.container = document.getElementById("container");
        this.div = document.createElement("div");
        this.div.id = "gameOver";
        let title = document.createElement("h1");
        title.innerHTML = "GAME OVER";
        this.div.appendChild(title);
        
        let playAgainButton = document.createElement("button");
        playAgainButton.innerHTML = "Play Again";
        playAgainButton.onclick = function() {
            document.dispatchEvent(new CustomEvent("LoadState", {detail:"GameState"}));
        }
        this.div.appendChild(playAgainButton);
    }

    public enter():void {
        this.container.appendChild(this.div);
    }

    public exit():void {
        this.container.removeChild(this.div);
    }
}