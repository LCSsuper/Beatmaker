import { Howl } from 'howler';
// import axios from 'axios';

export const playSound = ({ file, start, end, volume }, init) => {
    // const splitted = file.split('|||');
    // let sound;
    // if (splitted[1]) {
    //     fileExists(splitted[1])
    //         .then(() => {
    //             sound = new Howl({ src: [splitted[0]], format: [splitted[1]] })
    //         });
    // } else {
    //     sound = new Howl({ src: [file] });
    // }
    // if (!sound) return;

    const sound = new Howl({ src: [file] });
    const startAt = sound.duration() * (start / 100);
    const stopAt = sound.duration() * (end / 100) - startAt;
    sound.seek(startAt);
    sound.volume(init ? 0 : volume);
    sound.play();
    setTimeout(() => sound.stop(), stopAt * 1000);
};

// export const fileExists = async (file) => new Promise((resolve, reject) => {
//     axios.get(file)
//         .then(() => {
//             resolve();
//         })
//         .catch(() => {
//             reject();
//         });
// });