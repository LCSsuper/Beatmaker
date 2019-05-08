import { Howl } from 'howler';

export const playSound = ({ file, startAt, volume }) => {
    const sound = new Howl({ src: [file] });
    const seek = sound.duration() * startAt
    sound.seek(seek);
    sound.volume(volume);
    sound.play();
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