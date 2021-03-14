const ZOOM = 5;

class Camera {
    constructor() {
        this.xOFFSET = (CANVAS_W / (2 * ZOOM));
        this.yOFFSET = CANVAS_H / (2 * ZOOM);
    }

    adjustCamera() {
        this.transformCamera();
        this.translateCamera();
    }

    transformCamera() {
        renderer.cxt.setTransform(ZOOM, 0, 0, ZOOM, 0, -(ZOOM - 1) * CANVAS_H);
        renderer.cxt.save();
    }

    translateCamera() {
        let camX, camY;

        if (player.hero.x - this.xOFFSET <= 0)
            camX = 0;
        else if (player.hero.x + this.xOFFSET >= CANVAS_W)
            camX = -(CANVAS_W - 2 * this.xOFFSET);
        else
            camX = -(player.hero.x - this.xOFFSET);

        if (player.hero.y + this.yOFFSET >= bManager.LEVEL_H)
            camY = -Math.abs(bManager.LEVEL_H - CANVAS_H);
        else
            camY = -(player.hero.y + this.yOFFSET) + CANVAS_H;

        renderer.cxt.translate(camX, camY);
    }

    restoreCamera() {
        renderer.cxt.restore();
    }
}