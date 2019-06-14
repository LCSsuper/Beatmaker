import { Howl } from 'howler';

export const playSound = ({ file, start, end, volume, type }, mute) => {
    const sound = type ? new Howl({ src: [file], format: [type.split('/')[1]] }) : new Howl({ src: [file] });
    const startAt = sound.duration() * (start / 100);
    const stopAt = sound.duration() * (end / 100) - startAt;
    sound.seek(startAt);
    sound.volume(mute ? 0 : volume);
    sound.play();
    setTimeout(() => sound.stop(), stopAt * 1000);
};