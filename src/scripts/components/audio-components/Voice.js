import React, { Component } from 'react'

import VCO from './VCO'
import VCA from './VCA'
import VCF from './VCF'
import Echo from './Echo'

export default class Voice extends Component {
  constructor(props) {
    super(props);

    this.echo = React.createRef();
    this.vca = React.createRef();
    this.vcf = React.createRef();

    this.props.synth.vcos.forEach((vco, idx) => {
      this[`vco${idx}`] = React.createRef();
    });

    this.isVoiceOn = this.isVoiceOn.bind(this);
    this.isEnvelopeOn = this.isEnvelopeOn.bind(this);
  }

  isVoiceOn () {
    const isAmplifierEnvelopeOn = this.isEnvelopeOn(this.vca);
    const isFilterEnvelopeOn = this.isEnvelopeOn(this.vcf);

    return isAmplifierEnvelopeOn || isFilterEnvelopeOn
  }

  isEnvelopeOn (module) {
    if (module && module.current.envelope.current) {
      const envelopeState = module.current.envelope.current.state

      return !!envelopeState.attackStageEnd || !!envelopeState.releaseStageEnd;
    }
    return false
  }
  
  render () {
    const { audioContext, currentKey, synth, gateStartTime } = this.props
    
    const childrenProps = {
      vcaProps: {
        audioContext,
        currentKey,
        parameterValues: synth.vca,
        gateStartTime: gateStartTime
      },
      vcfProps: {
        audioContext,
        currentKey,
        parameterValues: synth.vcf,
        gateStartTime: gateStartTime
      },
      vcoProps: synth.vcos.map(vcoData => ({
        audioContext,
        currentKey,
        parameterValues: vcoData 
      })),
      echoProps: {
        audioContext,
        currentKey,
        parameterValues: synth.echo
      }
    }
  
    const { vcaProps, vcoProps, vcfProps, echoProps } = childrenProps
    
    const vcos = vcoProps.map((vcoData, idx) => {
      return (
        <VCO ref={this[`vco${idx}`]} key={idx} {...vcoData} />
      )
    })
    
    return (
      <React.Fragment>
        <div ref={this.echo}></div>
        <Echo
          parentNode={audioContext.destination}
          {...echoProps}>
          <VCA
            ref={this.vca}
            {...vcaProps}>
            <VCF
              ref={this.vcf}
              {...vcfProps}>
              {vcos}
            </VCF>
          </VCA>
        </Echo>
      </React.Fragment>
    )
  }
}

// export default Voice