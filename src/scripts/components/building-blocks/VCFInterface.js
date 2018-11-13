import React from 'react'

import EnvelopeInterface from './EnvelopeInterface'
import Range from '../input/Range'

const VCFInterface = props => {
    const inputSettings = {
        cutoff: {
            title: 'cutoff',
            min: 20,
            max: 20000,
            step: 0.001,
            valueType: 'float',
            parameter: 'filterCutoffFrequency'
        },
        resonance: {
            title: 'resonance',
            min: 0.001,
            max: 75,
            step: 0.001,
            valueType: 'float',
            parameter: 'filterQ'
        },
        envelopeAmount: {
            title: 'Envelope Amount',
            min: 0.0,
            max: 1.0,
            step: 0.001,
            valueType: 'float',
            parameter: 'filterEnvelopeAmount'
        },
        attackTime: {
            title: 'Attack',
            min: 0.001,
            max: 10.0,
            step: 0.001,
            valueType: 'float',
            parameter: 'filterAttackTime'
        },
        decayTime: {
            title: 'Decay',
            min: 0.001,
            max: 10.0,
            step: 0.001,
            valueType: 'float',
            parameter: 'filterDecayTime'
        },
        sustainLevel: {
            title: 'Sustain',
            min: 0.0,
            max: 1.0,
            step: 0.001,
            valueType: 'float',
            parameter: 'filterSustainLevel'
        },
        releaseTime: {
            title: 'Release',
            min: 0.001,
            max: 10.0,
            step: 0.001,
            valueType: 'float',
            parameter: 'filterReleaseTime'
        }
    }
    
    return (
        <React.Fragment>
            <div className="module-controls-column">
                <EnvelopeInterface
                    name={'filter'}
                    handleChange={props.updateVCF}
                    attackTime={Object.assign({}, inputSettings.attackTime, { value: props.vcf.filterAttackTime })}
                    decayTime={Object.assign({}, inputSettings.decayTime, { value: props.vcf.filterDecayTime })}
                    sustainLevel={Object.assign({}, inputSettings.sustainLevel, { value: props.vcf.filterSustainLevel })}
                    releaseTime={Object.assign({}, inputSettings.releaseTime, { value: props.vcf.filterReleaseTime })} />
            </div>
            <div className="module-controls-column">
                <Range {...props.vcf} {...inputSettings.cutoff} handleChange={props.updateVCF} />
                <Range {...props.vcf} {...inputSettings.resonance} handleChange={props.updateVCF} />
                <Range {...props.vcf} {...inputSettings.envelopeAmount} handleChange={props.updateVCF} />
            </div>
        </React.Fragment>
    )
}

export default VCFInterface