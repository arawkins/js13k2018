export class Util {
    public clamp(num, min, max) {
        return num <= min ? min : num >= max ? max : num;
    }
}
