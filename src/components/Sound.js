import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faUpload } from '@fortawesome/free-solid-svg-icons';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { observer } from 'mobx-react-lite';

import Wave from './Wave.js';
import StoreContext from '../utils/context';

const colors = [
    { id: 1, color: '#60d394' },
    { id: 2, color: '#d36060' },
    { id: 3, color: '#c060d3' },
    { id: 4, color: '#d3d160' },
    { id: 5, color: '#6860d3' },
    { id: 6, color: '#60b2d3' },
];

const Sound = observer(({ sound, sound: { id, file, start, end, volume }}) => {

    const { beatmakerStore: {
        playSound,
        setTime,
        setVolume,
        // setFile,
    } } = useContext(StoreContext);

    // const uploadAudio = (e) => {
    //     const file = e.target.files[0];
    //     if (!file || !file.type.startsWith('audio')) return;
    //     const src = URL.createObjectURL(file);
    //     setFile(id, `${src}|||${file.type.split('/')[1]}`);
    // };

    return (
        <div
            className='sound-container'
            style={{ background: colors.find(c => c.id === id).color }}
        >
            <div>
                <div onClick={() => playSound(sound)} className='button'>
                    <FontAwesomeIcon icon={faPlay} />
                </div>
                {/* <div className='button'>
                    <input type="file" name="file" onChange={uploadAudio} />
                    <FontAwesomeIcon icon={faUpload} />
                </div> */}
            </div>
            <div className='wave'>
                <Wave src={file} time={[start, end]} />
                <div className='range-container'>
                    <Range min={0} max={100} value={[start, end]} pushable={5} onChange={value => setTime(id, value)} />
                </div>
            </div>
            <div className='volume'>
                <Slider vertical min={0} max={100} value={volume * 100} onChange={value => setVolume(id, value / 100)} />
            </div>
        </div>
    );
});

export default Sound;