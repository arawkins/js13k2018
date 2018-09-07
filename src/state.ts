export abstract class State {
    public enter():void {}
    public exit():void {}; 
    public update():void {};
    public render(ctx:CanvasRenderingContext2D):void {};
}

