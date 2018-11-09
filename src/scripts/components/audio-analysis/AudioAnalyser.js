import React from 'react'
import AudioVisualizer from './AudioVisualizer'

export default class AudioAnalyser extends React.Component {
    constructor (props) {
        super(props)

        this.analyser = props.audioContext.createAnalyser()
        this.analyser.fftSize = 2048;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);

        this.state = { 
            audioData: new Uint8Array(0) 
        };

        this.tick = this.tick.bind(this)
    }

    componentDidMount () {
        this.rafId = requestAnimationFrame(this.tick);
    }
    
    componentDidUpdate (prevProps, prevState) {
        if (!prevProps.output && this.props.output) {
            this.props.input.connect(this.analyser)
            this.analyser.connect(this.props.output)
        }
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rafId);
        this.analyser.disconnect();
        this.props.input.disconnect();
        this.props.input.connect(this.props.output)
    }

    tick () {
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.setState({ audioData: this.dataArray });
        this.rafId = requestAnimationFrame(this.tick);
    }
    
    render() {
        return <AudioVisualizer audioData={this.state.audioData} analyser={this.analyser} />;
    }
}