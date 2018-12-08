import React from 'react'

export default class VCAInterface extends React.Component {
  return (
    <div className="module" id="amplifier-controls">
      <div className="module-title">VCA</div>
      <div className="module-controls">
        <div className="module-controls-column">
          <Range title="Attack"
            min={0.001}
            max={10.0}
            step={0.001}
            value={this.state.amplifierAttackTime}
            handleChange={this.handleAmplifierAttackTimeChange} />
          <Range title="Decay"
            min={0.001}
            max={10.0}
            step={0.001}
            value={this.state.amplifierDecayTime}
            handleChange={this.handleAmplifierDecayTimeChange} />
          <Range title="Sustain"
            min={0.001}
            max={1.0}
            step={0.001}
            value={this.state.amplifierSustainLevel}
            handleChange={this.handleAmplifierSustainLevelChange} />
          <Range title="Release"
            min={0.000}
            max={10.0}
            step={0.001}
            value={this.state.amplifierReleaseTime}
            handleChange={this.handleAmplifierReleaseTimeChange} />
        </div>
        <div className="module-controls-column">
          <input type='button' name="retrigger-mode" onClick={this.handleRetriggerChange} value={`Retrigger ${this.state.retrigger ? 'on' : 'off'}`} />
        </div>
      </div>
    </div>
  )
}