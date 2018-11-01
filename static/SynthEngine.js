import React, { Component } from 'react'

const REGISTERED_KEYS = [65, 87, 83, 69, 68, 70, 84, 71, 89, 72, 85, 74, 75, 79, 76, 80, 186]

window.onload = function () {

    
    
}

export default class SynthEngine extends Component {
    constructor (props) {
        super(props)

        this.state = {
            attackTime: 0.001,
            decayTime: 0.1,
            releaseTime: 0.001,
            sustainLevel: 0.001,
            controller: 'keyboard',
            octave: 4,
            currentKey: null,
            triggerStartTime: null,
            gate: false
        }

        this.oscillatorNode = this.props.audioContext.createOscillator();
        this.gainNode = this.props.audioContext.createGain();

        this.gainNode.gain.setValueAtTime(0, this.props.audioContext.currentTime)

        this.oscillatorNode.type = 'triangle'
        this.oscillatorNode.start()
        this.oscillatorNode.connect(this.gainNode)
        this.gainNode.connect(this.props.audioContext.destination)

        this.updateAttackTime = this.updateAttackTime.bind(this)
        this.updateDecayTime = this.updateDecayTime.bind(this)
        this.updateSustainLevel = this.updateSustainLevel.bind(this)
        this.updateReleaseTime = this.updateReleaseTime.bind(this)
        this.frequencyFromNoteNumber = this.frequencyFromNoteNumber.bind(this)
    }

    componentDidUpdate (prevProps, prevState) {
        const { currentKeys } = this.props.keyboard
        const currentKey = currentKeys[currentKeys.length - 1]

        if (this.props.keyboard.gate === true) {
            const key = currentKeys[currentKeys.length - 1]
            if (REGISTERED_KEYS.includes(key) && this.state.currentKey !== key) {
                this.setState({ currentKey: key, triggerStartTime: this.props.audioContext.currentTime, gate: true }, () => {
                    console.log('blah')
                    const noteNumber = REGISTERED_KEYS.indexOf(key) + (12 * this.state.octave)
                    this.oscillatorNode.frequency.setValueAtTime(this.frequencyFromNoteNumber(noteNumber), this.props.audioContext.currentTime)
                    this.gainNode.gain.cancelScheduledValues(this.props.audioContext.currentTime)
                    this.gainNode.gain.linearRampToValueAtTime(0, this.props.audioContext.currentTime)
                    this.gainNode.gain.linearRampToValueAtTime(1, this.props.audioContext.currentTime + this.state.attackTime)
                    this.gainNode.gain.linearRampToValueAtTime(this.state.sustainLevel, this.props.audioContext.currentTime + this.state.attackTime + this.state.decayTime)
                })
            }
        } else if (this.props.keyboard.gate === false && prevProps.keyboard.gate === true) {
            console.log('other')
            this.setState({ triggerStartTime: null, gate: false })
            this.gainNode.gain.cancelAndHoldAtTime(this.props.audioContext.currentTime)
            this.gainNode.gain.linearRampToValueAtTime(0, this.props.audioContext.currentTime + this.state.releaseTime)
            this.setState({ currentKey: null })
        }
    }

    componentDidMount () {
        CanvasJS.addColorSet("greenShades",
                [//colorSet Array
                "#9F4F0F",
                "#008080",
                "#2E8B57",
                "#3CB371",
                "#90EE90"                
                ])
        
        var dps = []; // dataPoints
        var chart = new CanvasJS.Chart("chartContainer", {
            title :{
                text: "Amplifier gain over time"
            },
            colorSet: "greenShades",
            axisY: {
                includeZero: false
            },
            axisX: {
                labelAngle: -30
            },
            data: [{
                type: "line",
                dataPoints: dps
            }]
        });
        
        var xVal = 0;
        var yVal = 100; 
        var updateInterval = 1;
        var dataLength = 2000; // number of dataPoints visible at any point
        
        var updateChart = function (count) {
        
            count = count || 1;
        
            for (var j = 0; j < count; j++) {
                yVal = this.gainNode.gain.value
                dps.push({
                    x: xVal,
                    y: yVal
                });
                xVal++;
            }
        
                if (dps.length > dataLength) {
                    dps.shift();
                }
        
            chart.render();
        }.bind(this);
        
        updateChart(dataLength);
        setInterval(function(){updateChart()}, updateInterval);
    }

    // updateAttackTime (e) {
    //     let diff
    //     if (this.state.triggerStartTime) {
    //         diff = this.props.audioContext.currentTime - this.state.triggerStartTime
    //     }
    //     // console.log('diff', this.state.attackTime - parseFloat(e.target.value))
    //     const oldAttackTime = this.state.attackTime
    //     const newAttackTime = parseFloat(e.target.value)
    //     // console.log('new, old', newAttackTime, oldAttackTime)
    //     this.setState({ attackTime: newAttackTime }, () => {
    //         console.log(this.state.attackTime)
    //         if (diff !== undefined) {
    //             const newTime = this.props.audioContext.currentTime + newAttackTime - diff
    //             // console.log('newTime: ', newTime)
    //             // console.log('currentTime', this.props.audioContext.currentTime)
    //             console.log('last')
    //             this.gainNode.gain.linearRampToValueAtTime(1, newTime)
    //         }
    //     })
    // }

    updateDecayTime (e) {
        this.setState({ decayTime: parseFloat(e.target.value) })
    }

    updateSustainLevel (e) {
        this.setState({ sustainLevel: parseFloat(e.target.value) })
    }

    updateReleaseTime (e) {
        this.setState({ releaseTime: parseFloat(e.target.value) })
    }

    frequencyFromNoteNumber (noteNumber) {
        return 440 * Math.pow(2, (noteNumber - 69) / 12)
    }

    render () {
        return (
            <div style={{ height: '100%', width: '100%' }}>
                <div id="chartContainer" style={{ height: "300px", width: "100%" }}></div>

                <div id="sliders">
                    <input type='range' min={0.001} max={10.0} step={0.001} value={this.state.attackTime} /> Attack {this.state.attackTime}
                    <input type='range' min={0.001} max={10.0} step={0.001} value={this.state.decayTime} /> Decay {this.state.decayTime}
                    <input type='range' min={0.000} max={1.0} step={0.001} value={this.state.sustainLevel} /> Sustain {this.state.sustainLevel}
                    <input type='range' min={0.001} max={10.0} step={0.001} value={this.state.releaseTime} /> Release {this.state.releaseTime}
                </div>
                <div>Current Controller: {this.state.controller}</div>
                <div>Current Octave: {this.state.octave}</div>
            </div>
        )
    }
}