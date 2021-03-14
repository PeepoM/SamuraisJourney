const GRAVITY = 0.28;
let gManager, sound, player, mobs, listener, camera, bManager, renderer, hud;
let LEVELS, IMAGE_LIB;

class GameManager {
    constructor() {
        this.LEVEL_NUMBER_INDEX = 1;
        LEVELS = this.loadLevels(TileMaps);
        this.loadImages();
    }

    initGameComponents() {
        bManager = new BlockManager(LEVELS[this.LEVEL_NUMBER_INDEX - 1]);
        sound = new SoundManager(this.LEVEL_NUMBER_INDEX, THEME_VOL, true);
        player = new Player();
        mobs = new Mobs();
        listener = new EventListener();
        camera = new Camera();
        renderer = new GameRenderer();
        hud = new HUD(TileMaps.hudIcons);
    }

    gameLoop() {
        if (!hud.GAME_PAUSED) {
            player.movePlayer();
            camera.adjustCamera();

            renderer.clearScreen();
            renderer.drawBackground();
            renderer.drawBackgroundBlocks();
            renderer.drawDrawableTriggerBlocks();
            renderer.drawPlayer();
            mobs.processMobs();
            renderer.drawForegroundBlocks();
            renderer.drawHud();

            camera.restoreCamera();
        } else
            hud.drawPauseScreen();

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    loadLevels(TileMaps) {
        let levels = [];

        for (const property in TileMaps) {
            if (TileMaps.hasOwnProperty(property)) {
                let level = TileMaps[property];
                levels.push(level);
            }
        }

        return levels;
    }

    imageIsLoaded(counter) {
        counter--;

        if (counter == 0) {
            // START THE GAME, ONLY WHEN ALL THE IMAGES AND MAPS ARE PROPERLY LOADED 
            this.initGameComponents();
            this.gameLoop();
        }
        return counter;
    }

    loadImages() {
        let div = document.getElementById("images");
        let images = div.getElementsByTagName("img");
        let imagesToLoad = images.length;
        IMAGE_LIB = {};

        for (let property in images) {
            if (images.hasOwnProperty(property)) {
                let image = images[property];
                let imageId = image.id;
                IMAGE_LIB[imageId] = image;

                if (!image.complete)
                    image.onload = () => imagesToLoad = this.imageIsLoaded(imagesToLoad);
                else
                    imagesToLoad = this.imageIsLoaded(imagesToLoad);
            }
        }
    }
}

gManager = new GameManager();
