import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStop, faSortUp, faSortDown, faDownload, faUpload } from '@fortawesome/free-solid-svg-icons';

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

    const setTime = (soundId, percentage) => {
        const index = sounds.findIndex(s => s.id === soundId);
        sounds[index].startAt = percentage;
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
            if ('bpm' in config && 'sounds' in config && 'tickCount' in config && 'ticks' in config) {
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

        setSounds([
            { id: 1, file: 'sounds/kick.wav', startAt: 0, volume: 1 },
            { id: 2, file: 'sounds/hihat.wav', startAt: 0, volume: 1 },
            { id: 3, file: 'sounds/snare.wav', startAt: 0, volume: 1 },
            { id: 4, file: 'sounds/clap.wav', startAt: 0, volume: 1 },
            { id: 5, file: 'sounds/perc.wav', startAt: 0, volume: 1 },
            { id: 6, file: 'sounds/808.wav', startAt: 0, volume: 1 },
        ]);
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
                        setTime={setTime}
                        setVolume={setVolume}
                        startAt={sound.startAt}
                    />
                ))}
            </div>
        </div>
    );
}

export default App;
