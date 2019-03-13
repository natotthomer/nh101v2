import React from 'react';
import isEqual from 'lodash/isEqual';

import VoiceContainer from './Voice-container';

export default class VoiceAllocator extends React.Component {
  constructor (props) {
    super(props);

    // for (let idx = 0; idx < this.props.voices; idx++) {
    //   this[`voice${idx}`] = React.createRef();
    // }
  }
  
  componentDidUpdate (prevProps, prevState) {
    const sortNumbersCorrectly = (a,b) => {
      return a - b;
    };

    const prevPropsSorted = prevProps.currentKeys.sort(sortNumbersCorrectly);
    const thisPropsSorted = this.props.currentKeys.sort(sortNumbersCorrectly);

    if (!isEqual(prevPropsSorted, thisPropsSorted)) {
      for (let idx = 0; idx < this.props.voices; idx++) {
        console.log(this[`voice${idx}`])
      }
    }
  }
  
  render () {
    const voices = [];
    for (let idx = 0; idx < this.props.voices; idx++) {
      voices.push(
        <VoiceContainer
          ref={(voice => this[`voice${idx}`] = voice.getWrappedInstance())}
          audioContext={this.props.audioContext}
          key={idx}>
          voice {idx}
        </VoiceContainer>)
    }
    
    return (
      <React.Fragment>
        {voices}
      </React.Fragment>
    );
  }
}