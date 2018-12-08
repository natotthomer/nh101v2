import React, { Component } from 'react'

import VCO from './VCO'
import VCA from './VCA'
import VCF from './VCF'
import AudioAnalyser from './audio-analysis/AudioAnalyser'

export default class Voice extends Component {
  render () {
    const { audioContext, currentKeys, synth } = this.props
    
    const childrenProps = {
      vcaProps: { 
        audioContext: audioContext,
        currentKeys: currentKeys,
        moduleParameters: synth.vca,
        retrigger: synth.retrigger
      },
      vcfProps: {
        audioContext: audioContext,
        currentKeys: currentKeys,
        moduleParameters: synth.vcf
      },
      vcoProps: synth.vcos.map(vcoData => ({ 
        audioContext: audioContext,
        currentKeys: currentKeys,
        moduleParameters: vcoData 
      }))
    }

    const { vcaProps, vcoProps, vcfProps } = childrenProps
    
    return (
      <React.Fragment>
        <VCA parentNode={audioContext.destination} {...vcaProps} ref={vca => (this.vca = vca)}>
          <VCF {...vcfProps} ref={vcf => (this.vcf = vcf)} >
            <VCO {...vcoProps[0]} ref={vcoOne => (this.vcoOne = vcoOne)} />
            <VCO {...vcoProps[1]} ref={vcoTwo => (this.vcoTwo = vcoTwo)} />
          </VCF>
        </VCA>
      </React.Fragment>
    )
  }
}
