import { State } from './state';
import { GameState } from './game';
import { TitleScreenState } from './titlescreen';
import { GameOverState } from './gameover';
import { Starfield } from './starfield';
import './style.css';

var WIDTH:number = 1280;
var HEIGHT:number = 720;

var currentState:State;
var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
var gameState: GameState;
var titleScreenState: TitleScreenState;
var gameOverState: GameOverState;
var starField: Starfield;

window.onload = () => {

    document.documentElement.style.overflow = 'hidden'; 

    let container = document.createElement('div');
    container.id = "container";

    canvas = document.createElement('canvas');
    canvas.id     = "game";
    canvas.width  = WIDTH;
    canvas.height = HEIGHT;
    canvas.classList.add('red_border');
    container.appendChild(canvas);
    document.body.appendChild(container);
    ctx = canvas.getContext("2d");    
    
    starField = new Starfield(WIDTH, HEIGHT);  

    gameState = new GameState(WIDTH,HEIGHT);
    titleScreenState = new TitleScreenState();
    gameOverState = new GameOverState();

    document.addEventListener("LoadState", onLoadState);
    
    loadState(titleScreenState);
    gameLoop();
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    currentState.update();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);    
    starField.update();
    starField.render(ctx);
    currentState.render(ctx);
}

function loadState(state:State):void {
    if (currentState != null) {
        currentState.exit();
    } 
    currentState = state;
    currentState.enter();
}

function onLoadState(e) {
    switch(e.detail) {
        case "TitleScreenState":
        loadState(titleScreenState);
        break;

        case "GameState":
        loadState(gameState);
        break;

        case "GameOverState":
        loadState(gameOverState);
        break;
    }
}