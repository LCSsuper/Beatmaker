import { observable, action, decorate } from 'mobx';
import { blobToBase64String, base64StringToBlob } from 'blob-util';

import { playSound } from '../utils/utils';

const storage = window.localStorage;

class BeatmakerStore {
    constructor() {
        this.beat = {};
        this.stepsPerTick = 4;
        this.currentTick = 0;
        this.tid = 0;
        this.playing = false;
        this.playSound = playSound;
        this.error = '';
    };

    initialize = () => {
        let beats = this.get('beats');
        if (!beats) {
            beats = [
                { id: 'beat-1', name: 'New beat' },
            ];
            this.set('beats', beats);

            const beat = {
                id: 'beat-1',
                name: 'New beat',
                bpm: 144,
                tickCount: 4,
                ticks: [
                    { id: 0, sounds: [] },
                    { id: 1, sounds: [] },
                    { id: 2, sounds: [] },
                    { id: 3, sounds: [] },
                    { id: 4, sounds: [] },
                    { id: 5, sounds: [] },
                    { id: 6, sounds: [] },
                    { id: 7, sounds: [] },
                    { id: 8, sounds: [] },
                    { id: 9, sounds: [] },
                    { id: 10, sounds: [] },
                    { id: 11, sounds: [] },
                    { id: 12, sounds: [] },
                    { id: 13, sounds: [] },
                    { id: 14, sounds: [] },
                    { id: 15, sounds: [] },
                ],
                sounds: [
                    { id: 1, file: 'sounds/kick.wav', start: 0, end: 100, volume: 1 },
                    { id: 2, file: 'sounds/hihat.wav', start: 0, end: 100, volume: 1 },
                    { id: 3, file: 'sounds/snare.wav', start: 0, end: 100, volume: 1 },
                    { id: 4, file: 'sounds/clap.wav', start: 0, end: 100, volume: 1 },
                    { id: 5, file: 'sounds/perc.wav', start: 0, end: 100, volume: 1 },
                    { id: 6, file: 'sounds/808.wav', start: 0, end: 100, volume: 1 },
                ],
            };

            this.set('beat-1', beat);
        }

        const beat1 = this.get('beat-1');

        // storage.removeItem('beat-1');
        // storage.removeItem('beats');

        this.beat = beat1;
        this.bpm = beat1.bpm;
        this.sounds = beat1.sounds;
        this.tickCount = beat1.tickCount;
        this.ticks = beat1.ticks;

        this.sounds.forEach(sound => {
            if (sound.base64) {
                const blob = base64StringToBlob(sound.base64);
                sound.file = URL.createObjectURL(blob);
            }
        });

        this.beat.sounds = [...this.sounds];
        this.set(this.beat.id, this.beat);
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
        if (this.beat.bpm + amount === 181 || this.beat.bpm + amount === 59) return;
        this.beat.bpm = this.beat.bpm + amount;
        this.set(this.beat.id, this.beat);
    };

    addTickCount = (amount) => {
        if (this.beat.tickCount + amount === 17 || this.beat.tickCount + amount === 3) return;
        this.beat.tickCount = this.beat.tickCount + amount;
        this.set(this.beat.id, this.beat);
    };

    playSounds = () => {
        if (!this.beat.ticks.length) return;
        this.beat.ticks[this.currentTick].sounds.forEach(soundId => {
            const sound = this.beat.sounds.find(s => s.id === soundId);
            playSound(sound);
        });
    };

    toggleSound = (soundId, tickId) => {
        if (this.beat.ticks[tickId].sounds.includes(soundId)) {
            const index = this.beat.ticks[tickId].sounds.indexOf(soundId);
            this.beat.ticks[tickId].sounds.splice(index, 1);
            this.setTicks([...this.beat.ticks]);
        } else {
            this.beat.ticks[tickId].sounds.push(soundId);
            this.setTicks([...this.beat.ticks]);
        }
    };

    setCurrentTick = (currentTick) => {
        this.currentTick = currentTick;
    };

    setTime = (soundId, value) => {
        const [start, end] = value;
        const index = this.beat.sounds.findIndex(s => s.id === soundId);
        this.beat.sounds[index].start = start;
        this.beat.sounds[index].end = end;
        this.beat.sounds = [...this.beat.sounds];
        this.set(this.beat.id, this.beat);
    };

    setTicks = (ticks) => {
        if (ticks.length) {
            this.beat.ticks = ticks;
            this.set(this.beat.id, this.beat);
        }
    };

    setTid = (tid) => {
        this.tid = tid;
    };

    setVolume = (soundId, percentage) => {
        const index = this.beat.sounds.findIndex(s => s.id === soundId);
        this.beat.sounds[index].volume = percentage;
        this.beat.sounds = [...this.beat.sounds];
        this.set(this.beat.id, this.beat);
    };

    setFile = async (soundId, file) => {
        if (!file) {
            this.setError('No file found');
            return;
        } else if (!file.type.startsWith('audio')) {
            this.setError(`No audiofile. Found type: ${file.type}`);
            return;
        } else if (file.size > 1000000) {
            this.setError(`File too large, max 1MB. Found size: ${(file.size / 1000000).toFixed(2)}MB`);
            return;
        }

        const base64 = await blobToBase64String(file);
        
        const blob = await base64StringToBlob(base64);
        const src = URL.createObjectURL(blob);

        const index = this.beat.sounds.findIndex(s => s.id === soundId);

        this.beat.sounds[index].file = src;
        this.beat.sounds[index].base64 = base64;
        this.beat.sounds[index].type = file.type;
        this.beat.sounds = [...this.beat.sounds];
        this.set(this.beat.id, this.beat);
        playSound(this.beat.sounds[index], true);
    };

    setName = (e) => {
        this.beat.name = e.target.value;
        this.set(this.beat.id, this.beat);
    };

    setPlaying = (playing = !this.playing) => {
        this.playing = playing;
    };

    get(id) {
        return JSON.parse(storage.getItem(id));
    };

    set(id, value) {
        storage.setItem(id, JSON.stringify(value));
    };

    setError = (error) => {
        this.error = error;
        setTimeout(() => this.error = '', 4000);
    };
};

decorate(BeatmakerStore, {
    initialize: action,
    stepsPerTick: observable,
    currentTick: observable,
    tid: observable,
    beat: observable,
    playing: observable,
    error: observable,
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
    setError: action,
});

export default new BeatmakerStore();