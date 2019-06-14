import React, { useEffect, useContext, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStop, faSortUp, faSortDown, faBan } from '@fortawesome/free-solid-svg-icons';
import { isMobile } from 'react-device-detect';
import { observer } from 'mobx-react-lite';

import Error from './Error.js';
import Tick from './Tick.js';
import Sound from './Sound.js';
import StoreContext from '../utils/context';

const App = observer(() => {

    const { beatmakerStore: {
        initialize,
        beat: {
            bpm,
            tickCount,
            ticks,
            sounds,
            name,
        },
        stepsPerTick,
        currentTick,
        tid,
        playing,
        nextTick,
        addBpm,
        addTickCount,
        playSounds,
        toggleSound,
        setCurrentTick,
        setTicks,
        setTid,
        setPlaying,
        setName,
    } } = useContext(StoreContext);

    const onKeyDown = (e) => {
        if (e.keyCode === 32 && e.target.type !== 'text') {
            setPlaying();
        }
    };

    useEffect(() => {
        if (playing) playSounds();
        setTid(setTimeout(nextTick, 60000 / (bpm * 4)));
    }, [currentTick]);

    useEffect(() => {
        if (!ticks) return;
        const length = ticks.length;
        if (length < tickCount * stepsPerTick) {
            for (let i = 0; i < stepsPerTick; i++) {
                ticks.push({ id: length + i, sounds: [] });
            }
        } else if (length > tickCount * stepsPerTick) {
            ticks.splice(-stepsPerTick, stepsPerTick);
        }
        setTicks([...ticks]);
    }, [tickCount]);

    useEffect(() => {
        if (playing) {
            playSounds();
            setTid(setTimeout(nextTick, 60000 / (bpm * 4)));
        } else {
            clearTimeout(tid);
        }
    }, [playing]);

    useEffect(() => {
        initialize();
    }, []);

    return (
        <div id='app' onKeyDown={onKeyDown} tabIndex='0'>
            <Error />
            {!isMobile ? (
                <Fragment>
                    <div id='header'>
                        <div id='playback'>
                            <div id='play-pause' className={playing ? 'playing' : ''} onClick={() => setPlaying(!playing)}>
                                {playing ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                            </div>
                            <div onClick={() => { setPlaying(false); setCurrentTick(0); }}>
                                <FontAwesomeIcon icon={faStop} />
                            </div>
                        </div>
                        <div id='settings'>
                            <div>
                                <div className='counter'>{bpm} BPM</div>
                                {!playing && (
                                    <div>
                                        <div onClick={() => addBpm(1)}><FontAwesomeIcon icon={faSortUp} /></div>
                                        <div onClick={() => addBpm(-1)}><FontAwesomeIcon icon={faSortDown} /></div>
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className='counter'>{tickCount} TICKS</div>
                                {!playing && (
                                    <div>
                                        <div onClick={() => addTickCount(1)}><FontAwesomeIcon icon={faSortUp} /></div>
                                        <div onClick={() => addTickCount(-1)}><FontAwesomeIcon icon={faSortDown} /></div>
                                    </div>
                                )}
                            </div>
                            <div className='name'>
                                <input value={name || ''} onChange={setName} />
                            </div>
                        </div>
                    </div>
                    <div id='tabs'>
                        <div id='ticks'>
                            {ticks && ticks.map(tick => {
                                const length = ticks.length * 34 + tickCount * 15;
                                const shouldWrap = ticks.length / 2 === tick.id && length > window.innerWidth;
                                return (
                                    <React.Fragment key={tick.id}>
                                        {shouldWrap && <br />}
                                        <Tick
                                            key={tick.id}
                                            id={tick.id}
                                            sounds={tick.sounds}
                                            active={currentTick === tick.id}
                                            toggleSound={toggleSound}
                                            style={{ marginRight: tick.id % 4 === 3 ? '15px' : '2px' }}
                                        />
                                    </React.Fragment>
                                )
                            })}
                        </div>
                    </div>
                    <div id='pads'>
                        {sounds && sounds.map(sound => (
                            <Sound key={sound.id} sound={sound} />
                        ))}
                    </div>
                </Fragment>
            ) : (
                <div className='mobile'>
                    <FontAwesomeIcon icon={faBan} />
                    <p>Deze app wordt niet ondersteund op dit apparaat. Gebruik een laptop of PC om de app te gebruiken.</p>
                </div>
            )}
        </div>
    );
});

export default App;
