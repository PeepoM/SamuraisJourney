const CANVAS_W = 1280,
    CANVAS_H = 720;

class GameRenderer {
    constructor() {
        this.setUpRenderer();
    }

    setUpRenderer() {
        this.gameC = this.setUpCanvas("gameC", CANVAS_W, CANVAS_H, "visible");
        this.cxt = this.gameC.getContext("2d");

        let stage = document.getElementById("stage");
        let canvases = stage.getElementsByTagName("canvas");
        this.ALL_CANVASES = {};
        let layerCounter = 0;

        for (let property in canvases) {
            if (canvases.hasOwnProperty(property)) {
                let canvas = canvases[property];
                let canvasId = canvas.id;

                if (canvasId !== this.gameC.id) {
                    let visibility = (canvasId == "hud" ? "visible" : "hidden");

                    let canvas = this.setUpCanvas(canvasId, CANVAS_W, CANVAS_H, visibility);

                    if (canvasId !== "hud") this.preRenderBlocks(canvas.getContext("2d"), layerCounter);

                    this.ALL_CANVASES[canvasId] = canvas;
                    layerCounter++;
                }
            }
        }
    }

    drawHud() {
        hud.drawHud();
    }

    drawPlayer() {
        let pInjured = player.hero.injured;
        let sBlinkT = player.hero.startBlinkingTime;
        let blinkDur = player.hero.blinkingDuration;
        let emptySpace = player.hero.TIMEOUT_BETWEEN_BLINKS;

        player.hero.injured = player.playerIsInjured(pInjured, sBlinkT, blinkDur);

        if (player.decideWhetherToDrawThePlayer(player.hero.injured, sBlinkT, blinkDur, emptySpace))
            player.drawPlayerAnimation();
    }

    drawDrawableTriggerBlocks() {
        bManager.TRIGGER_BLOCKS.forEach(trigger => {
            if (trigger.isDrawable) {
                let triggerName = trigger.name;
                let imageToDraw = IMAGE_LIB[triggerName];
                let W = trigger.width;
                let H = trigger.height;

                this.drawAnimationOfAnObject(imageToDraw, trigger, W, H);
            }
        });
    }

    drawAnimationOfAnObject(imageToDraw, object, W, H) {
        let sW = imageToDraw.width / object.numberOfImages;
        let sH = imageToDraw.height;
        let x = object.x;
        let y = object.y;
        let timer = object.timer;
        let TIMEOUT = object.TIMEOUT;

        if (object.index >= object.numberOfImages) object.index = 0;

        this.cxt.drawImage(imageToDraw, object.index * sW, 0, sW, sH, x, y, W, H);

        if (performance.now() - timer >= TIMEOUT) {
            object.index++;
            object.timer = performance.now();
        }
    }

    drawBackground() {
        this.cxt.drawImage(this.ALL_CANVASES.background, 0, 0);
    }

    drawForegroundBlocks() {
        this.cxt.drawImage(this.ALL_CANVASES.fBlocks, 0, 0);
    }

    drawBackgroundBlocks() {
        this.cxt.drawImage(this.ALL_CANVASES.bBlocks, 0, 0);
    }

    setUpCanvas(nameC, W, H, visibility) {
        let c = document.getElementById(nameC);
        c.width = W;
        c.height = H;
        c.style.visibility = visibility;

        let cxt = c.getContext("2d");
        cxt.imageSmoothingEnabled = false;

        return c;
    }

    preRenderBlocks(context, layerToDraw) {
        let imageToDraw = IMAGE_LIB[bManager.LEVEL_TILESET];
        let lW = bManager.LEVEL.width;
        let y = 0;

        let layerOfBlocks = bManager.DRAWABLE_BLOCKS[layerToDraw];

        layerOfBlocks.forEach(blocks => {
            for (let x = 0; x < lW; x++) {
                if (blocks[x] !== 0) {
                    let number = blocks[x];
                    let tW = bManager.LEVEL.tilewidth;
                    let tH = bManager.LEVEL.tileheight;
                    let numberOfTilesHorizontal = imageToDraw.width / tW;
                    let row = (number - 1) % numberOfTilesHorizontal;
                    let columns = Math.floor((number - 1) / numberOfTilesHorizontal);

                    context.drawImage(imageToDraw, row * tW, columns * tH, tW, tH, x * tW, y * tH, tW, tH);
                }
            }
            y++;
        });
    }

    clearScreen() {
        this.cxt.clearRect(0, 0, CANVAS_W, CANVAS_H);
    }
}