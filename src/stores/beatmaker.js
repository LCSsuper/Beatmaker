import { observable, action, decorate } from 'mobx';

import { playSound, exportToJson } from '../utils/utils';

class BeatmakerStore {
    constructor() {
        this.bpm = 144;
        this.tickCount = 8;
        this.stepsPerTick = 4;
        this.currentTick = 0;
        this.ticks = [];
        this.tid = 0;
        this.sounds = [
            { id: 1, file: 'sounds/kick.wav', start: 0, end: 100, volume: 1 },
            { id: 2, file: 'sounds/hihat.wav', start: 0, end: 100, volume: 1 },
            { id: 3, file: 'sounds/snare.wav', start: 0, end: 100, volume: 1 },
            { id: 4, file: 'sounds/clap.wav', start: 0, end: 100, volume: 1 },
            { id: 5, file: 'sounds/perc.wav', start: 0, end: 100, volume: 1 },
            { id: 6, file: 'sounds/808.wav', start: 0, end: 100, volume: 1 },
        ];
        this.playing = false;
        this.playSound = playSound;

        for (let i = 0; i < this.tickCount * 4; i++) {
            this.ticks.push({ id: i, sounds: [] });
            this.ticks = [...this.ticks];
        }

        this.sounds.forEach(sound => {
            playSound(sound, true);
        });
    };

    nextTick = () => {
        if (!this.playing) return;

        const next = this.currentTick + 1;
        if (next === this.tickCount * this.stepsPerTick) {
            this.currentTick = 0;
        } else {
            this.currentTick = next;
        }
    };

    addBpm = (amount) => {
        if (this.bpm + amount === 181 || this.bpm + amount === 59) return;
        this.bpm = this.bpm + amount;
    };

    addTickCount = (amount) => {
        if (this.tickCount + amount === 17 || this.tickCount + amount === 3) return;
        this.tickCount = this.tickCount + amount;
    };

    playSounds = () => {
        if (!this.ticks.length) return;
        this.ticks[this.currentTick].sounds.forEach(soundId => {
            const sound = this.sounds.find(s => s.id === soundId);
            playSound(sound);
        });
    };

    toggleSound = (soundId, tickId) => {
        if (this.ticks[tickId].sounds.includes(soundId)) {
            const index = this.ticks[tickId].sounds.indexOf(soundId);
            this.ticks[tickId].sounds.splice(index, 1);
            this.ticks = [...this.ticks];
        } else {
            this.ticks[tickId].sounds.push(soundId);
            this.ticks = [...this.ticks];
        }
    };

    setCurrentTick = (currentTick) => {
        this.currentTick = currentTick;
    };

    setTime = (soundId, value) => {
        const [start, end] = value;
        const index = this.sounds.findIndex(s => s.id === soundId);
        this.sounds[index].start = start;
        this.sounds[index].end = end;
        this.sounds = [...this.sounds];
    };

    setTicks = (ticks) => {
        this.ticks = ticks;
    };

    setTid = (tid) => {
        this.tid = tid;
    };

    setVolume = (soundId, percentage) => {
        const index = this.sounds.findIndex(s => s.id === soundId);
        this.sounds[index].volume = percentage;
        this.sounds = [...this.sounds];
    };

    setFile = (soundId, src) => {
        const index = this.sounds.findIndex(s => s.id === soundId);
        this.sounds[index].file = src;
        this.sounds = [...this.sounds];
        playSound(this.sounds[index], true);
    };

    setPlaying = (playing = !this.playing) => {
        this.playing = playing;
    };

    uploadConfig = (e) => {
        if (!e.target.files[0]) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const config = JSON.parse(e.target.result);
            if (
                'bpm' in config 
                && 'sounds' in config 
                && 'tickCount' in config 
                && 'ticks' in config
            ) {
                this.bpm = config.bpm;
                this.ticks = config.ticks;
                this.sounds = config.sounds;
                this.tickCount = config.tickCount;
            }
        };
        reader.readAsText(e.target.files[0]);
    };

    downloadConfig = () => {
        exportToJson({
            bpm: this.bpm,
            ticks: this.ticks,
            sounds: this.sounds,
            tickCound: this.tickCount,
        });
    };
};

decorate(BeatmakerStore, {
    bpm: observable,
    tickCount: observable,
    stepsPerTick: observable,
    currentTick: observable,
    ticks: observable,
    tid: observable,
    sounds: observable,
    playing: observable,
    nextTick: action,
    addBpm: action,
    addTickCount: action,
    toggleSound: action,
    setCurrentTick: action,
    setTime: action,
    setTicks: action,
    setTid: action,
    setFile: action,
    setPlaying: action,
    uploadConfig: action,
});

export default new BeatmakerStore();