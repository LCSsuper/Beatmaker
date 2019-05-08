import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import Wave from './Wave.js';

const colors = [
    { id: 1, color: '#60d394' },
    { id: 2, color: '#d36060' },
    { id: 3, color: '#c060d3' },
    { id: 4, color: '#d3d160' },
    { id: 5, color: '#6860d3' },
    { id: 6, color: '#60b2d3' },
];

const Sound = ({ id, file, startAt, volume, onPlay, setTime, setVolume }) => {

    return (
        <div
            className='sound-container'
            style={{ background: colors.find(c => c.id === id).color }}
        >
            <div>
                <div onClick={() => onPlay(id)} className='button'>
                    <FontAwesomeIcon icon={faPlay} />
                </div>
            </div>
            <div className='wave'>
                <Wave src={file} onSeek={data => setTime(id, data)} startAt={startAt} />
            </div>
            <div className='volume'>
                <Slider vertical min={0} value={volume * 100} max={100} onChange={value => setVolume(id, value / 100)} />
            </div>
        </div>
    );
};

export default Sound;