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
  }
  
  render () {
    const { audioContext, currentKeys, synth, gateStartTime } = this.props
    
    const childrenProps = {
      vcaProps: {
        audioContext: audioContext,
        currentKeys: currentKeys,
        parameterValues: synth.vca,
        gateStartTime: gateStartTime
      },
      vcfProps: {
        audioContext: audioContext,
        currentKeys: currentKeys,
        parameterValues: synth.vcf,
        gateStartTime: gateStartTime
      },
      vcoProps: synth.vcos.map(vcoData => ({
        audioContext: audioContext,
        currentKeys: currentKeys,
        parameterValues: vcoData 
      })),
      echoProps: {
        audioContext: audioContext,
        currentKeys: currentKeys,
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
        <div ref={this.echo}>asdfh</div>
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