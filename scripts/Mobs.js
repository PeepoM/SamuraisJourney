class Mobs {
    processMobs() {
        bManager.MOBS.forEach(mob => {
            let mobName = mob.name;
            let W = mob.width;
            let H = mob.height;
            let imageToDraw = (mob.flipped ? IMAGE_LIB[`${mobName}F`] : IMAGE_LIB[mobName]);

            this.moveMobs(mob);
            renderer.drawAnimationOfAnObject(imageToDraw, mob, W, H);
        });
    }

    mobXMove(mob) {
        mob.x += mob.velX;
        mob.distX += Math.abs(mob.velX);

        if (mob.distX >= mob.DISTANCE) {
            mob.velX = -mob.velX;
            mob.distX = 0;
            mob.flipped = (mob.flipped ? false : true);
        }
    }

    mobYMove(mob) {
        mob.y += mob.velY;
        mob.distY += Math.abs(mob.velY);

        if (mob.distY >= mob.DISTANCE) {
            mob.velY = -mob.velY;
            mob.distY = 0;
        }
    }

    moveMobs(mob) {
        if (mob.velX !== 0) this.mobXMove(mob);
        else if (mob.velY !== 0) this.mobYMove(mob);
    }
}