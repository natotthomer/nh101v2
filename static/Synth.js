var oscillatorNode = audioCtx.createOscillator();
var gainNode = audioCtx.createGain();

gainNode.gain.setValueAtTime(0, audioCtx.currentTime)

oscillatorNode.type = 'triangle'
oscillatorNode.start()
oscillatorNode.connect(gainNode)
gainNode.connect(audioCtx.destination)

const REGISTERED_KEYS = [65, 87, 83, 69, 68, 70, 84, 71, 89, 72, 85, 74, 75, 79, 76, 80, 186]

window.onload = function () {

    var dps = []; // dataPoints
    var chart = new CanvasJS.Chart("chartContainer", {
        title :{
            text: "Dynamic Data"
        },
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
            yVal = gainNode.gain.value
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
    };
    
    updateChart(dataLength);
    setInterval(function(){updateChart()}, updateInterval);
    
}

class Envelope extends Component {
    constructor (props) {
        super(props)

        this.state = {
            attackTime: 0.5,
            decayTime: 0.5,
            releaseTime: 0.5,
            sustainLevel: 0.5,
            controller: 'keyboard',
            octave: 4,
            currentKey: null,
            triggerStartTime: null
        }

        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.updateAttackTime = this.updateAttackTime.bind(this)
        this.updateDecayTime = this.updateDecayTime.bind(this)
        this.updateSustainLevel = this.updateSustainLevel.bind(this)
        this.updateReleaseTime = this.updateReleaseTime.bind(this)
        this.frequencyFromNoteNumber = this.frequencyFromNoteNumber.bind(this)
    }

    frequencyFromNoteNumber (note) {
        return 440 * Math.pow(2, (note - 69) / 12)
    }

    handleKeyDown (e) {
        const keyCode = e.keyCode
        if (REGISTERED_KEYS.includes(keyCode) && this.state.currentKey !== keyCode) {
            this.setState({ currentKey: keyCode, triggerStartTime: audioCtx.currentTime }, () => {
                const noteNumber = REGISTERED_KEYS.indexOf(keyCode) + (12 * this.state.octave)
                oscillatorNode.frequency.setValueAtTime(this.frequencyFromNoteNumber(noteNumber), audioCtx.currentTime)
                gainNode.gain.cancelScheduledValues(audioCtx.currentTime)
                gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime)
                gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + this.state.attackTime)
                gainNode.gain.linearRampToValueAtTime(this.state.sustainLevel, audioCtx.currentTime + this.state.attackTime + this.state.decayTime)
            })
        }
    }

    handleKeyUp (e) {
        if (this.state.currentKey) {
            this.setState({ triggerStartTime: null })
            gainNode.gain.cancelAndHoldAtTime(audioCtx.currentTime)
            gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + this.state.releaseTime)
            this.setState({ currentKey: null })
        }
    }
    
    updateAttackTime (e) {
        let diff
        if (this.state.triggerStartTime) {
            diff = audioCtx.currentTime - this.state.triggerStartTime
        }
        this.setState({ attackTime: parseFloat(e.target.value) }, () => {
            if (diff !== undefined) {
                const newTime = audioCtx.currentTime + this.state.attackTime - diff
                console.log('newTime: ', newTime)
                console.log('currentTime', audioCtx.currentTime)
                gainNode.gain.linearRampToValueAtTime(1, newTime)
            }
        })
    }

    updateDecayTime (e) {
        this.setState({ decayTime: parseFloat(e.target.value) })
    }

    updateSustainLevel (e) {
        this.setState({ sustainLevel: parseFloat(e.target.value) })
    }

    updateReleaseTime (e) {
        this.setState({ releaseTime: parseFloat(e.target.value) })
    }
    
    render () {
        return (
            <div onKeyUp={this.handleKeyUp} onKeyDown={(e) => this.handleKeyDown(e)} tabIndex={1} style={{ height: '100%', width: '100%' }}>
                <div id="chartContainer" style={{ height: "300px", width: "100%" }}></div>

                <div id="sliders">
                    <input type='range' min={0.0} max={10.0} step={0.001} value={this.state.attackTime} onChange={this.updateAttackTime} /> Attack {this.state.attackTime}
                    <input type='range' min={0.0} max={1.0} step={0.001} value={this.state.decayTime} onChange={this.updateDecayTime} /> Decay {this.state.decayTime}
                    <input type='range' min={0.0} max={1.0} step={0.001} value={this.state.sustainLevel} onChange={this.updateSustainLevel} /> Sustain {this.state.sustainLevel}
                    <input type='range' min={0.0} max={1.0} step={0.001} value={this.state.releaseTime} onChange={this.updateReleaseTime} /> Release {this.state.releaseTime}
                </div>
                <div>Current Controller: {this.state.controller}</div>
                <div>Current Octave: {this.state.octave}</div>
            </div>
        )
    }
}