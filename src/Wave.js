import React from 'react'
import ReactDOM from 'react-dom'
import WaveSurfer from 'wavesurfer.js'

export default class Wave extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.$el = ReactDOM.findDOMNode(this);
    this.$waveform = this.$el.querySelector('.wave');
    this.wavesurfer = WaveSurfer.create({
      container: this.$waveform,
      waveColor: 'gray',
      progressColor: 'black',
      height: '80',
      responsive: true
    });
    this.wavesurfer.load(this.props.src);
    this.wavesurfer.seekTo(this.props.startAt);
    this.wavesurfer.on('seek', this.props.onSeek);
  }
  
  render() {
    return (
      <div className='waveform'>
        <div className='wave'></div>
      </div>
    )
  }
}