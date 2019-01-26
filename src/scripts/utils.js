const frequencyFromNoteNumber = noteNumber => {
  return 440 * Math.pow(2, (noteNumber - 69) / 12)
}

export const calculateOscillatorFrequency = (noteNumber, detuneAmount) => {
  const baseFrequency = frequencyFromNoteNumber(noteNumber)
  let adjustedFrequency = baseFrequency
  
  if (detuneAmount > 0) {
    const frequencyOfNextNoteUp = frequencyFromNoteNumber(noteNumber + 1)
    adjustedFrequency += (frequencyOfNextNoteUp - adjustedFrequency) * detuneAmount
  } else if (detuneAmount < 0) {
    const frequencyOfNextNoteDown = frequencyFromNoteNumber(noteNumber - 1)
    adjustedFrequency -= (adjustedFrequency - frequencyOfNextNoteDown) * detuneAmount
  }

  return adjustedFrequency
}

export const calculateAttackFrequency = (filterCutoff, filterEnvelopeAmount) => {
  return ((20000 - filterCutoff) * filterEnvelopeAmount) + filterCutoff
}

export const calculateSustainGain = (filterCutoff, filterEnvelopeAmount, filterSustainLevel) => {
  return calculateAttackFrequency(filterCutoff, filterEnvelopeAmount) * filterSustainLevel
}

export const handleGenericControlChange = (props, value) => {
  const data = {
    audioParam: props.audioParam,
    parameter: props.parameter
  }

  isNaN(props.id) ? data.id = null : data.id = props.id
  switch (props.valueType) {
    case 'float': {
      data.value = parseFloat(value)
      break
    }
    case 'integer': {
      data.value = parseInt(value)
      break
    }
    case 'string': {
      data.value = value
    }
    case 'boolean': {
      data.value = value
    }
  }
  
  props.handleChange(data)
}

export const makeLogarithmicSlope = (startValue, endValue) => {
  // yValues should map between the initial value and the final value rather than just between 0 and 1

  // It also needs to know whether to reverse the values (if descending)
  const yValues = new Float32Array(4096)
  const results = new Float32Array(4096)
  const startAndEndValuesInAscendingOrder = startValue < endValue ? [startValue, endValue] : [endValue, startValue]
  for (let i = 0; i < yValues.length; i++) {
    let newYValue
    if (i === 0) {
      newYValue = 0
    } else if (i === yValues.length - 1) {
      newYValue = 1
    } else {
      newYValue = (Math.log((i / yValues.length) + ((1 / 100) * (2 / 3))) / 5) + 1
    }
    yValues[i] = newYValue
  }


  for (let i = 0; i < results.length; i++) {
    let newValue = ((startAndEndValuesInAscendingOrder[1] - startAndEndValuesInAscendingOrder[0]) * yValues[i]) + startAndEndValuesInAscendingOrder[0]

    results[i] = newValue
  }

  if (endValue < startValue) {
    results.reverse()
  }
  
  return results
}