import React, { useEffect, useState, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStop, faSortUp, faSortDown, faDownload, faUpload, faBan } from '@fortawesome/free-solid-svg-icons';
import { isMobile } from 'react-device-detect';

import Tick from './Tick.js';
import Sound from './Sound.js';

import { playSound, exportToJson } from './utils';

const App = () => {
    const [bpm, setBpm] = useState(144);
    const [tickCount, setTickCount] = useState(8);
    const [currentTick, setCurrentTick] = useState(0);
    const [ticks, setTicks] = useState([]);
    const [tid, setTid] = useState(0);
    const [sounds, setSounds] = useState([]);

    // Playback
    const [playing, setPlaying] = useState(false);

    const nextTick = () => {
        if (!playing) return;

        const next = currentTick + 1;
        if (next === tickCount * 4) {
            setCurrentTick(0);
        } else {
            setCurrentTick(next);
        }
    };

    const addBpm = (amount) => {
        if (bpm + amount === 181 || bpm + amount === 59) return;
        setBpm(bpm + amount);
    };

    const addTickCount = (amount) => {
        if (tickCount + amount === 17 || tickCount + amount === 3) return;
        setTickCount(tickCount + amount);
    };

    const playSounds = () => {
        if (!ticks.length) return;
        ticks[currentTick].sounds.forEach(soundId => {
            const sound = sounds.find(s => s.id === soundId);
            playSound(sound);
        });
    };

    const toggleSound = (soundId, tickId) => {
        if (ticks[tickId].sounds.includes(soundId)) {
            const index = ticks[tickId].sounds.indexOf(soundId);
            ticks[tickId].sounds.splice(index, 1);
            setTicks([...ticks]);
        } else {
            ticks[tickId].sounds.push(soundId);
            setTicks([...ticks]);
        }
    };

    const setTime = (soundId, value) => {
        const [start, end] = value;
        const index = sounds.findIndex(s => s.id === soundId);
        sounds[index].start = start;
        sounds[index].end = end;
        setSounds([...sounds]);
    };

    const setVolume = (soundId, percentage) => {
        const index = sounds.findIndex(s => s.id === soundId);
        sounds[index].volume = percentage;
        setSounds([...sounds]);
    };

    const onKeyDown = (e) => {
        if (e.keyCode === 32) {
            setPlaying(!playing);
        }
    };

    const uploadConfig = (e) => {
        if (!e.target.files[0]) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const config = JSON.parse(e.target.result);
            if (
                'bpm' in config 
                && 'sounds' in config 
                && 'tickCount' in config 
                && 'ticks' in config
            ) {
                setBpm(config.bpm);
                setTicks(config.ticks);
                setSounds(config.sounds);
                setTickCount(config.tickCount);
            }
        };
        reader.readAsText(e.target.files[0]);
    };

    const downloadConfig = () => {
        exportToJson({
            bpm,
            ticks,
            sounds,
            tickCount,
        });
    };

    useEffect(() => {
        for (let i = 0; i < tickCount * 4; i++) {
            ticks.push({ id: i, sounds: [] });
        }

        setTicks(ticks);

        const _sounds = [
            { id: 1, file: 'sounds/kick.wav', start: 0, end: 100, volume: 1 },
            { id: 2, file: 'sounds/hihat.wav', start: 0, end: 100, volume: 1 },
            { id: 3, file: 'sounds/snare.wav', start: 0, end: 100, volume: 1 },
            { id: 4, file: 'sounds/clap.wav', start: 0, end: 100, volume: 1 },
            { id: 5, file: 'sounds/perc.wav', start: 0, end: 100, volume: 1 },
            { id: 6, file: 'sounds/808.wav', start: 0, end: 100, volume: 1 },
        ];

        _sounds.forEach(sound => {
            playSound(sound, true);
        });

        setSounds(_sounds);
    }, []);

    useEffect(() => {
        if (playing) playSounds();
        setTid(setTimeout(nextTick, 60000 / (bpm * 4)));
    }, [currentTick]);

    useEffect(() => {
        const length = ticks.length;
        if (length < tickCount * 4) {
            for (let i = 0; i < 4; i++) {
                ticks.push({ id: length + i, sounds: [] });
            }
        } else if (length > tickCount * 4) {
            ticks.splice(-4, 4);
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

    return (
        <div id='app' onKeyDown={onKeyDown} tabIndex='0'>
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
                        </div>
                        <div id='download'>
                            <div>
                                <input type="file" name="file" onChange={uploadConfig} />
                                <FontAwesomeIcon icon={faUpload} />
                            </div>
                            <div onClick={downloadConfig}>
                                <FontAwesomeIcon icon={faDownload} />
                            </div>
                        </div>
                    </div>
                    <div id='tabs'>
                        <div id='ticks'>
                            {ticks.map(tick => {
                                const length = ticks.length * 34 + tickCount * 15;
                                const shouldWrap = ticks.length / 2 === tick.id && length > window.innerWidth;
                                return (
                                    <React.Fragment>
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
                        {sounds.map(sound => (
                            <Sound
                                key={sound.id}
                                id={sound.id}
                                volume={sound.volume}
                                onPlay={() => playSound(sound)}
                                file={sound.file}
                                time={[sound.start, sound.end]}
                                setTime={setTime}
                                setVolume={setVolume}
                            />
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
}

export default App;
