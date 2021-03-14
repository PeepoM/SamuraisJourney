const FONT_HEIGHT = 65,
    OCCASIONAL_FONT_HEIGHT = 100,
    xOFFSET = 20;
FONT_NAME = " ThaleahFat",
    PAUSE_SCREEN_COLOR = "#525252";

class HUD {
    constructor(hud) {
        this.setUpHud();
        this.initHudIcons(hud);
        this.GAME_PAUSED = false;
    }

    initHudIcons(hud) {
        let HUD = Object.assign({}, hud);
        let HUD_LAYERS = [...HUD.layers];

        this.HUD_ICONS = bManager.setUpLayerBlocks(HUD_LAYERS, "triggers");
    }

    setUpHud() {
        this.cHUD = renderer.ALL_CANVASES.hud;

        this.HUDcxt = this.cHUD.getContext("2d");
        this.HUDcxt.font = `${FONT_HEIGHT}px`.concat(FONT_NAME);
    }

    hudIconsAreClicked(hudArray, icon, mouse) {
        let collision = listener.rMCol(icon, listener.mouse);

        if (collision) {
            switch (icon.name) {
                case "soundButton":
                    icon.soundPlaying = (icon.soundPlaying ? false : true);
                    let volume = (icon.soundPlaying ? GLOBAL_VOL : 0);
                    Howler.volume(volume);
                    break;
                case "ppButton":
                    icon.pause = (icon.pause ? false : true);
                    this.GAME_PAUSED = icon.pause;
                    break;
                case "restartLevel":
                    player.resetPlayer();
                    sound.resetSoundPlayer();
                    this.GAME_PAUSED = false;
                    break;
                case "restartGame":
                    sound.stopSound(`GTMLevel${gManager.LEVEL_NUMBER_INDEX}`);
                    gManager.LEVEL_NUMBER_INDEX = 1;
                    player.resetPlayer();
                    gManager.initGameComponents();
                    break;
            }

            mouse = {};
        } else if (!collision) {
            if (hudArray.indexOf(icon) == 1 && Object.keys(mouse).length >= 2)
                mouse = {};
        }

        return mouse;
    }

    drawHudIcons() {
        this.HUD_ICONS.forEach(icon => {
            if (icon.state !== "pause") {
                let iconName = icon.name;
                let imageToDraw;

                let iX = icon.x;
                let iY = icon.y;
                let iW = icon.width;
                let iH = icon.height;

                listener.mouse = this.hudIconsAreClicked(this.HUD_ICONS, icon, listener.mouse);

                icon.pause = this.GAME_PAUSED;

                if (iconName == "ppButton")
                    imageToDraw = IMAGE_LIB[(icon.pause ? "playButton" : "pauseButton")];
                else if (iconName == "soundButton")
                    imageToDraw = IMAGE_LIB[(icon.soundPlaying ? "soundPlaying" : "soundMuted")];

                let imageW = imageToDraw.width;
                let imageH = imageToDraw.height;

                this.HUDcxt.drawImage(imageToDraw, 0, 0, imageW, imageH, iX, iY, iW, iH);
            }
        });
    }

    drawHud() {
        this.clearHudScreen();

        let playerLives = player.hero.lives;
        let score = player.hero.score;

        let scoreIntW = this.HUDcxt.measureText(score.toString()).width;

        let LIVESx = xOFFSET;
        let LIVESy = FONT_HEIGHT / 1.5;

        let SCOREx = (CANVAS_W / 2) - (scoreIntW / 2);
        let SCOREy = FONT_HEIGHT / 1.5;

        this.HUDcxt.fillStyle = "BLACK";

        this.HUDcxt.fillText(`LIVES: ${playerLives}`, LIVESx, LIVESy);
        this.HUDcxt.fillText(`${score}`, SCOREx, SCOREy);

        this.drawHudIcons();
    }

    drawPauseScreen() {
        this.HUDcxt.fillStyle = PAUSE_SCREEN_COLOR;
        this.HUDcxt.fillRect(0, 0, CANVAS_W, CANVAS_H);

        this.HUD_ICONS.forEach(icon => {
            let iconName = icon.name;
            let imageToDraw;

            if (icon.state == "pause") {
                if (icon.changeable) {
                    let mX = listener.mouseMove.x;
                    let mY = listener.mouseMove.y;

                    let collision = listener.pointRectCollision(icon, mX, mY);
                    icon.selected = (collision ? true : false);

                    listener.mouse = this.hudIconsAreClicked(this.HUD_ICONS, icon, listener.mouse);

                    imageToDraw = (icon.selected ? iconName.concat("W") : iconName.concat("B"));
                } else imageToDraw = iconName;

                imageToDraw = IMAGE_LIB[imageToDraw];

                let imageW = imageToDraw.width;
                let imageH = imageToDraw.height;
                let iX = icon.x;
                let iY = icon.y;
                let iW = icon.width;
                let iH = icon.height;

                this.HUDcxt.drawImage(imageToDraw, 0, 0, imageW, imageH, iX, iY, iW, iH);
            }
        });

        this.drawHudIcons();
    }

    clearHudScreen() {
        this.HUDcxt.clearRect(0, 0, CANVAS_W, CANVAS_H);
    }
}