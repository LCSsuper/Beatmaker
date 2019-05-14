import React, { useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

// import { fileExists } from '../utils/utils';

const Wave = ({ src, id, time }) => {

    const [ref, setRef] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!ref) return;
        setError(false);
        ref.innerHTML = '';
        const wavesurfer = WaveSurfer.create({
            container: ref,
            waveColor: 'gray',
            progressColor: 'transparent',
            cursorWidth: '0',
            height: '80',
            responsive: true
        });

        // const splitted = src.split('|||');
        // if (splitted[1]) {
        //     fileExists(splitted[1])
        //         .then(() => {
        //             wavesurfer.load(splitted[1]);        
        //         })
        //         .catch(() => {
        //             setError(true);
        //         })
        // } else {
        //     wavesurfer.load(src);
        // }

        wavesurfer.load(src);
    }, [ref, src]);

    return (
        <div className='waveform'>
            {error && (<div className='error'>NO AUDIO</div>)}
            <div className='start' style={{ width: `${time[0]}%` }}></div>
            <div className='end' style={{ width: `${100 - time[1]}%` }}></div>
            <div className='wave' ref={setRef}></div>
        </div>
    );
};

export default Wave;