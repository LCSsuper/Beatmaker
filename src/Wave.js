import React, { useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

const Wave = ({ src, onSeek, time }) => {

    const [ref, setRef] = useState(null);

    useEffect(() => {
        if (!ref) return;
        const wavesurfer = WaveSurfer.create({
            container: ref,
            waveColor: 'gray',
            progressColor: 'transparent',
            cursorWidth: '0',
            height: '80',
            responsive: true
        });

        wavesurfer.load(src);
        wavesurfer.on('seek', onSeek);
    }, [ref]);

    return (
        <div className='waveform'>
            <div className='start' style={{ width: `${time[0]}%` }}></div>
            <div className='end' style={{ width: `${100 - time[1]}%` }}></div>
            <div className='wave' ref={setRef}></div>
        </div>
    );
};

export default Wave;