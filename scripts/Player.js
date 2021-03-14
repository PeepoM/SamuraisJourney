const xVEL = 1.6,
    yVEL = 5,
    ladderVEL = 1,
    ACCELERATION = 0.2,
    TIMEOUT = 200;

class Player {
    constructor() {
        Object.assign(this.hero = {}, this.setUpHero());
    }

    setUpHero() {
        return bManager.TRIGGER_BLOCKS.find(hero => hero.name == "hero");;
    }

    movePlayer() {
        this.playerXMove();
        this.playerYMove();
        this.playerCollision();
    }

    playerXMove() {
        if (listener.kPressed.A && listener.kPressed.D)
            this.hero.velX = 0;
        else if (listener.kPressed.D && this.hero.velX < xVEL)
            this.hero.velX += ACCELERATION;
        else if (listener.kPressed.A && this.hero.velX > -xVEL)
            this.hero.velX -= ACCELERATION;

        if (this.hero.velX > 0) {
            this.hero.flipped = false;
            if (!listener.kPressed.D) this.hero.velX -= ACCELERATION;
        } else if (this.hero.velX < 0) {
            this.hero.flipped = true;
            if (!listener.kPressed.A) this.hero.velX += ACCELERATION;
        }

        // Round the velX variable according to the number of decimal places ACCELERATION has
        this.hero.velX = parseFloat(this.hero.velX.toFixed(1));

        this.hero.x += this.hero.velX;
    }

    playerYMove() {
        // Avoid jumping after double pressing W in the air 
        if (listener.kPressed.longP && !listener.kPressed.W && this.hero.velY == 0)
            listener.kPressed.longP = false;

        if (!(this.hero.climb && listener.kPressed.W)) this.hero.velY += GRAVITY;

        this.hero.y += this.hero.velY;
    }

    determineState() {
        if (this.hero.velY == 0 && !this.hero.climb) {
            this.hero.loop = true;
            if (this.hero.velX !== 0)
                return "pRun";
            else if (this.hero.velX == 0)
                return "pIdle";
        } else {
            if (this.hero.climb) {
                this.hero.loop = true;
                return "pClimb";
            }
            this.hero.loop = false;
            return "pJump";
        }
    }

    drawPlayerAnimation() {
        let pW = this.hero.width;
        let pH = this.hero.height;
        let pX = this.hero.x;
        let pY = this.hero.y;
        let flipped = this.hero.flipped;

        let state = this.determineState();

        let imageToDraw;
        if (flipped) imageToDraw = IMAGE_LIB[`${state}F`];
        else imageToDraw = IMAGE_LIB[`${state}`];

        this.hero.numberOfImages = imageToDraw.width / pW;

        if (this.hero.index >= this.hero.numberOfImages)
            this.hero.index = (this.hero.loop ? 0 : --this.hero.numberOfImages);

        renderer.cxt.drawImage(imageToDraw, this.hero.index * pW, 0, pW, pH, pX, pY, pW, pH);

        if (performance.now() - this.hero.timer >= TIMEOUT) {
            this.hero.index++;
            this.hero.timer = performance.now();
        }
    }

    resetPlayer() {
        this.hero.x = this.hero.startPosX;
        this.hero.y = this.hero.startPosY;
        this.hero.velX = 0;
        this.hero.velY = 0;
        this.hero.injured = false;
        this.hero.score = 0;
        this.hero.lives = 5;

        bManager = new BlockManager(LEVELS[gManager.LEVEL_NUMBER_INDEX - 1]);
    }

    playerIsInjured(pInjured, sBlinkingT, blinkingDur) {
        let timeBlinking = performance.now() - sBlinkingT;

        if (pInjured && timeBlinking >= blinkingDur || !pInjured)
            return false;
        return true;
    }

    decideWhetherToDrawThePlayer(injured, sBlinkingT, blinkingDur, emptySpace) {
        let timeBlinking = performance.now() - sBlinkingT;

        if (!injured || timeBlinking >= blinkingDur || (Math.floor(timeBlinking / emptySpace) % 2 == 0))
            return true;
        else false;
    }

    playerCollision() {
        let pX = this.hero.x;
        let pY = this.hero.y;
        let pW = this.hero.width;
        let pH = this.hero.height;
        let pVY = this.hero.velY;
        let pVX = this.hero.velX;

        this.detectCollision(pX, pY, pW, pH, pVY, pVX);
        this.detectMobCollision(pX, pY, pW, pH);
        this.detectTriggerBlocksCollision(pX, pY, pW, pH, pVY);

    }

    detectMobCollision(pX, pY, pW, pH) {
        bManager.MOBS.forEach(mob => {
            let mX = mob.x;
            let mY = mob.y;
            let mW = mob.width;
            let mH = mob.height;

            if (this.detectRectCollision(pX, pY, pW, pH, mX, mY, mW, mH) && !this.hero.injured) {
                this.hero.injured = true;
                this.hero.startBlinkingTime = performance.now();
                this.hero.lives--;

                if (this.hero.lives > 0) sound.playSound("pMobHit", 0.3);
                else if (this.hero.lives <= 0) {
                    sound.playSound("pDeath", 0.5);
                    this.resetPlayer();
                }
            }
        });
    }

    detectTriggerBlocksCollision(pX, pY, pW, pH, pVY) {
        this.hero.climb = false;
        let ladderCntr = 0;

        bManager.TRIGGER_BLOCKS.forEach(trigger => {
            let tX = trigger.x;
            let tY = trigger.y;
            let tW = trigger.width;
            let tH = trigger.height;
            let collision = this.detectRectCollision(pX, pY, pW, pH, tX, tY, tW, tH);

            if (collision) {
                let indexOfTrigger = bManager.TRIGGER_BLOCKS.indexOf(trigger);

                switch (trigger.name) {
                    case "ladder":
                        listener.kPressed.longP = true;
                        if (listener.kPressed.W) {
                            ladderCntr++;
                            this.hero.velY = -ladderVEL;
                        }
                        break;
                    case "coin":
                        this.hero.score++;
                        bManager.TRIGGER_BLOCKS.splice(indexOfTrigger, 1);
                        sound.playSound("pCoin", 0.1);
                        break;
                    case "potion":
                        this.hero.lives++;
                        bManager.TRIGGER_BLOCKS.splice(indexOfTrigger, 1);
                        sound.playSound("pHeal", 0.1);
                        break;
                    case "death":
                        sound.playSound("pDeath", 0.5);
                        this.resetPlayer();
                        sound.resetSoundPlayer();
                        break;
                    case "finish":
                        sound.stopSound(`GTMLevel${gManager.LEVEL_NUMBER_INDEX}`);
                        gManager.LEVEL_NUMBER_INDEX++;
                        gManager.initGameComponents();
                        break;
                }
            }
        });

        if (ladderCntr !== 0) this.hero.climb = true;
    }

    detectCollision(pX, pY, pW, pH, pVY) {
        bManager.COLLISION_BLOCKS.forEach(block => {
            let bX = block.x;
            let bY = block.y;
            let bW = block.width;
            let bH = block.height;

            if (this.detectRectCollision(pX, pY, pW, pH, bX, bY, bW, bH)) {
                if (pX + pW >= bX && pX + pW <= bX + xVEL && pY + pH > bY + pVY) {
                    this.hero.velX = 0;
                    this.hero.x = bX - pW;
                } else if (pX <= bX + bW && pX >= bX + bW - xVEL && pY + pH > bY + pVY) {
                    this.hero.velX = 0;
                    this.hero.x = bX + bW;
                } else if ((pX + pW >= bX + xVEL && pX + pW <= bX + bW - xVEL) ||
                    pX >= bX + xVEL && pX <= bX + bW - xVEL ||
                    (pX <= bX + xVEL && pX + pW >= bX + bW - xVEL)) {
                    if (this.hero.velY > 0 && pY < bY) {
                        this.hero.y = bY - pH;
                        if (listener.kPressed.W && !listener.kPressed.longP) {
                            this.hero.timer = performance.now();
                            this.hero.index = 0;
                            this.hero.velY = -yVEL;
                            listener.kPressed.longP = true;
                            sound.playSound("pJump", 0.5);
                        } else
                            this.hero.velY = 0;
                    } else if (this.hero.velY < 0 && pY > bY) {
                        this.hero.y = bY + bH;
                        this.hero.velY = 0;
                        this.hero.index = 1;
                        if (this.hero.climb) this.hero.index = 0;
                    }
                }
            }
        });
    }

    detectRectCollision(pX, pY, pW, pH, bX, bY, bW, bH) {
        if (pX > bX + bW || pX + pW < bX || pY > bY + bH || pY + pH < bY)
            return false;

        return true;
    }
}