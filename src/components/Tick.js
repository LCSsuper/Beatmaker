import React from 'react';

const colors = [
    { id: 1, color: '#60d394' },
    { id: 2, color: '#d36060' },
    { id: 3, color: '#c060d3' },
    { id: 4, color: '#d3d160' },
    { id: 5, color: '#6860d3' },
    { id: 6, color: '#60b2d3' },
];

const Tick = ({ id, sounds, active, toggleSound, style }) => (
    <div className={`tick ${active ? 'active' : ''}`} style={style} >
        {colors.map(color => (
            <div
                key={color.id}
                className='sound-in-tick'
                style={{ background: color.color, opacity: sounds.includes(color.id) ? '1' : '0.2' }}
                onClick={() => toggleSound(color.id, id)}
            ></div>
        ))}
    </div>
);

export default Tick;