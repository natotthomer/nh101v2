import React from 'react'

export default class AudioVisualizer extends React.Component {
    constructor (props) {
        super(props);

        this.draw = this.draw.bind(this)
    }

    componentDidUpdate() {
        this.draw();
    }

    draw () {
        // const { audioData } = this.props;
        // const canvas = this.canvas
        // const height = canvas.height;
        // const width = canvas.width;
        // const context = canvas.getContext('2d');
        // let x = 0;
        // const sliceWidth = (Number(width) * 1.0) / audioData.length;

        // context.lineWidth = 2;
        // context.strokeStyle = '#000000';
        // context.clearRect(0, 0, width, height);

        // context.beginPath();
        // context.moveTo(0, height / 2);

        // for (const item of audioData) {
        //     const y = (item / 255.0) * height;
        //     context.lineTo(x, y);
        //     x += sliceWidth;
        // }

        // context.lineTo(x, height / 2);
        // context.stroke();

        const { audioData } = this.props;

        const context = this.canvas.getContext('2d');

        var width = context.canvas.width;
        var height = context.canvas.height;
        var scaling = height / 256;
        var risingEdge = 0;
        var edgeThreshold = 5;

        this.props.analyser.getByteTimeDomainData(audioData);

        context.fillStyle = 'rgba(0, 20, 0, 0.1)';
        context.fillRect(0, 0, width, height);

        context.lineWidth = 2;
        context.strokeStyle = 'rgb(0, 200, 0)';
        context.beginPath();
        

        // No buffer overrun protection
        while (audioData[risingEdge++] - 128 > 0 && risingEdge <= width)
        if (risingEdge >= width) risingEdge = 0;

        while (audioData[risingEdge++] - 128 < edgeThreshold && risingEdge <= width);
        if (risingEdge >= width) risingEdge = 0;

        for (var x = risingEdge; x < audioData.length && x - risingEdge < width; x++)
            context.lineTo(x - risingEdge, height - audioData[x] * scaling);

        context.stroke();
    }

    render () {
        return <canvas width="300" height="100" ref={ref => (this.canvas = ref)} />;
    }
}