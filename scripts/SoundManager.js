const GLOBAL_VOL = 0.75,
    THEME_VOL = 0.3;

class SoundManager {
    constructor(levelNmb, volume, loop) {
        this.setUpSoundEffects();
        this.playSound(`GTMLevel${levelNmb}`, volume, loop);
    }

    resetSoundPlayer() {
        let ThemeSongToPlay = `GTMLevel${gManager.LEVEL_NUMBER_INDEX}`;
        let loopSong = true;

        this.resetThemeSong(ThemeSongToPlay, THEME_VOL, loopSong);
    }

    resetThemeSong(sound, volume, loop) {
        this.stopSound(sound);
        this.playSound(sound, volume, loop);
    }

    playSound(sound, volume, loop) {
        this.ALL_SOUNDS[sound]._volume = volume;
        this.ALL_SOUNDS[sound]._loop = loop;
        this.ALL_SOUNDS[sound].play();
    }

    stopSound(sound) {
        this.ALL_SOUNDS[sound].stop();
    }

    setUpSoundEffects() {
        Howler.volume(GLOBAL_VOL);
        this.ALL_SOUNDS = {};

        let sDiv = document.getElementById("sounds");
        let audioF = sDiv.getElementsByTagName("link");

        for (const property in audioF) {
            if (audioF.hasOwnProperty(property)) {
                let sound = audioF[property];
                let soundSrc = sound.href;
                let soundName = sound.title;

                this.ALL_SOUNDS[soundName] = new Howl({
                    src: [soundSrc],
                    loop: false,
                    volume: 0.05
                });
            }
        }
    }
}