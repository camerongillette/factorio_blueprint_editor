class Entity{
    constructor(imagePath, rotation, direction,width,height,mirrorFlippedHorizontal=0){
        this.imagePath = imagePath;
        this.rotation = rotation;
        this.direction = direction;
        this.width = width;
        this.height = height;
        this.mirrorFlippedHorizontal = mirrorFlippedHorizontal;
    }
}
