import { Howl } from 'howler';

export const playSound = ({ file, start, end, volume }, init) => {
    const sound = new Howl({ src: [file] });
    const startAt = sound.duration() * (start / 100);
    const stopAt = sound.duration() * (end / 100) - startAt;
    sound.seek(startAt);
    sound.volume(init ? 0 : volume);
    sound.play();
    setTimeout(() => sound.stop(), stopAt * 1000);
};

export const exportToJson = (objectData) => {
    let filename = 'config.json';
    let contentType = 'application/json;charset=utf-8;';
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(objectData)))], { type: contentType });
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        var a = document.createElement('a');
        a.download = filename;
        a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(objectData));
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}