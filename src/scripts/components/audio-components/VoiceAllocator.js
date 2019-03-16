import React from 'react';
import isEqual from 'lodash/isEqual';

import VoiceContainer from './Voice-container';

export default class VoiceAllocator extends React.Component {
  constructor (props) {
    super(props);

    for (let idx = 0; idx < this.props.voices; idx++) {
      this[`voice${idx}`] = React.createRef();
    }
  }
  
  componentDidUpdate (prevProps, prevState) {
    const sortNumbersCorrectly = (a,b) => {
      return a - b;
    };

    const prevPropsSorted = prevProps.currentKeys.sort(sortNumbersCorrectly);
    const thisPropsSorted = this.props.currentKeys.sort(sortNumbersCorrectly);
  }
  
  render () {
    const voices = [];
    if (this.props.voices) {
      const usedKeys = {};
      const unusedKeys = [...this.props.currentKeys];

      for (let idx = 0; idx < this.props.voices; idx++) {
        const voice = this[`voice${idx}`];
        if (voice.props && voice.props.currentKey && this.props.currentKeys.includes(voice.props.currentKey)) {
          usedKeys[idx] = voice.props.currentKey;
          const idxOfKey = unusedKeys.indexOf(voice.props.currentKey);
          unusedKeys.splice(idxOfKey, 1);
        }
      }


      let addedKeys = 0;
      for (let idx = 0; idx < this.props.voices; idx++) {
        let currentKey

        if (usedKeys[idx]) {
          currentKey = usedKeys[idx];
        } else if (unusedKeys.length) {
          currentKey = unusedKeys[addedKeys];
          addedKeys++;
        }

        voices.push(
          <VoiceContainer
            currentKey={currentKey}
            ref={(voice => this[`voice${idx}`] = voice)}
            audioContext={this.props.audioContext}
            key={idx}>
            voice {idx}
          </VoiceContainer>)
      }
    }
    
    return (
      <React.Fragment>
        {voices}
      </React.Fragment>
    );
  }
}