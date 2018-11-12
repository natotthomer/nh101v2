import React from 'react'

export default class VCFInterface extends React.Component {
    render () {
        return (
            <div className="module" id="filter-controls">
                <div className="module-title">VCF</div>
                <div className="module-controls">
                    <div className="module-controls-column">
                        <Envelope handleChange={this.handleChange}
                            name={'filter'}
                            attackTime={this.state.filterAttackTime}
                            decayTime={this.state.filterDecayTime}
                            sustainLevel={this.state.filterSustainLevel}
                            releaseTime={this.state.filterReleaseTime} />
                        <Range title="Attack"
                            min={0.001}
                            max={10.0}
                            step={0.001}
                            value={this.state.filterAttackTime}
                            handleChange={this.handleFilterAttackTimeChange} />
                        <Range title="Decay"
                            min={0.001}
                            max={10.0}
                            step={0.001}
                            value={this.state.filterDecayTime}
                            handleChange={this.handleFilterDecayTimeChange} />
                        <Range title="Sustain"
                            min={0.001}
                            max={1.0}
                            step={0.001}
                            value={this.state.filterSustainLevel}
                            handleChange={this.handleFilterSustainLevelChange} />
                        <Range title="Release"
                            min={0.001}
                            max={10.0}
                            step={0.001}
                            value={this.state.filterReleaseTime}
                            handleChange={this.handleFilterReleaseTimeChange} />
                    </div>
                    <div className="module-controls-column">
                        <Range title="Cutoff"
                            min={20}
                            max={20000}
                            step={0.001}
                            value={this.state.filterCutoffFrequency}
                            handleChange={this.handleFilterCutoffFrequencyChange} />
                        <Range title="Resonance"
                            min={0.001}
                            max={75}
                            step={0.001}
                            value={this.state.filterQ}
                            handleChange={this.handleFilterQChange} />
                        <Range title="Envelope Amount"
                            min={0.0}
                            max={1.0}
                            step={0.001}
                            value={this.state.filterEnvelopeAmount}
                            handleChange={this.handleFilterEnvelopeAmountChange} />
                    </div>
                </div>
            </div>
        )
    }
}