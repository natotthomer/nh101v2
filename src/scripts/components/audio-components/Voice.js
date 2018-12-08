import React, { Component } from 'react'

import VCO from './VCO'
import VCA from './VCA'
import VCF from './VCF'
import AudioAnalyser from './audio-analysis/AudioAnalyser'

export default class Voice extends Component {
  render () {
    const childrenProps = {
      vcaProps: { 
        audioContext: this.props.audioContext,
        currentKeys: this.props.currentKeys,
        moduleParameters: this.props.synth.vca
      },
      vcfProps: {
        audioContext: this.props.audioContext,
        currentKeys: this.props.currentKeys,
        moduleParameters: this.props.synth.vcf
      },
      vcoProps: this.props.synth.vcos.map(vcoData => ({ 
        audioContext: this.props.audioContext,
        currentKeys: this.props.currentKeys,
        moduleParameters: vcoData 
      }))
    }

    const { vcaProps, vcoProps, vcfProps } = childrenProps
    
    return (
      <React.Fragment>
        <VCA {...vcaProps} ref={vca => (this.vca = vca)}>
          <VCF {...vcfProps} ref={vcf => (this.vcf = vcf)} >
            <VCO {...vcoProps[0]} ref={vcoOne => (this.vcoOne = vcoOne)} />
            <VCO {...vcoProps[1]} ref={vcoTwo => (this.vcoTwo = vcoTwo)} />
          </VCF>
        </VCA>
      </React.Fragment>
    )
  }
}
