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

    if (!isEqual(prevPropsSorted, thisPropsSorted)) {
      // const voicesOn 
      for (let idx = 0; idx < this.props.voices; idx++) {
        
        // console.log(this[`voice${idx}`].wrappedInstance)
        // console.log(this[`voice${idx}`].wrappedInstance.isVoiceOn())
        // window.setTimeout(() => {
        //   console.log(this[`voice${idx}`].wrappedInstance.isVoiceOn())
        // }, 1)
      }
    }
  }
  
  render () {
    const voices = [];
    if (this.props.voices) {
      console.log(this.props.currentKeys)
      const usedKeys = {};
      const unusedKeys = [...this.props.currentKeys];

      for (let idx = 0; idx < this.props.voices; idx++) {
        const voice = this[`voice${idx}`];
        // console.log(voice.props ? voice.props.currentKey : 'yo')
        if (voice.props && voice.props.currentKey && this.props.currentKeys.includes(voice.props.currentKey)) {
          usedKeys[idx] = voice.props.currentKey;
          const idxOfKey = unusedKeys.indexOf(voice.props.currentKey);
          unusedKeys.splice(idxOfKey, 1);
        }
      }


      let addedKeys = 0;
      for (let idx = 0; idx < this.props.voices; idx++) {
        // console.log(this.props.currentKeys[idx])

        let currentKey

        // console.log(unusedKeys)

        if (usedKeys[idx]) {
          console.log(usedKeys[idx], 'poo')
          currentKey = usedKeys[idx];
        } else if (unusedKeys.length) {
          currentKey = unusedKeys[addedKeys];
          addedKeys++;
        }
        
        // console.log(this.props.currentKeys)

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