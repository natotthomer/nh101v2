import {
  UPDATE_VCO, UPDATE_VCF, UPDATE_VCA, UPDATE_GATE_START_TIME, 
  UPDATE_CURRENT_KEY, UPDATE_RETRIGGER, UPDATE_ECHO
} from '../constants/synth-constants'

const _nulLSynth = {
  vcos: [
    {
      oscillatorOctave: 4,
      oscillatorDetune: 0,
      oscillatorWaveform: 'sawtooth',
      oscillatorGain: 0.5,
      id: 0
    }, {
      oscillatorOctave: 4,
      oscillatorDetune: 0,
      oscillatorWaveform: 'sawtooth',
      oscillatorGain: 0.0,
      id: 1
    }
  ],
  vcf: {
    frequency: {
      baseValue: 2000,
      attackTime: 1.0,
      decayTime: 1.0,
      sustainLevel: 0.5,
      releaseTime: 0.3,
      envelopeAmount: 1.0,
      range: [20, 20000]
    },
    Q: {
      baseValue: 1.0,
      range: [0.0, 40.0]
    }
  },
  vca: {
    gain: {
      baseValue: 0.0,
      attackTime: 1.0,
      decayTime: 1.0,
      sustainLevel: 0.5,
      releaseTime: 0.3,
      envelopeAmount: 1.0,
      range: [0.0, 1.0]
    }
  },
  echo: {
    echoVolume: 0.0,
    echoFeedback: 0.0,
    echoTime: 0.5
  },
  controller: 'keyboard',
  currentKey: null,
  gateStartTime: null,
  retrigger: true
}

const SynthReducer = (state = _nulLSynth, action) => {
  switch (action.type) {
    case UPDATE_VCO: {
      console.log(action.data.value)
      
      return {
        ...state,
        vcos: [
          ...state.vcos.map((vco, idx) => {
            console.log(action.data.id)
            if (idx === action.data.id) {
              console.log('poo')
              return {
                ...state.vcos[idx],
                [action.data.parameter]: action.data.value
              }
            }
            return vco
          })
        ]
      }
    }
    case UPDATE_VCF: {
      return {
        ...state,
        vcf: {
          ...state.vcf,
          [action.data.audioParam]: {
            ...state.vcf[action.data.audioParam],
            [action.data.parameter]: action.data.value
          }
        }
      }
    }
    case UPDATE_VCA: {
      return {
        ...state,
        vca: {
          ...state.vca,
          [action.data.audioParam]: {
            ...state.vca[action.data.audioParam],
            [action.data.parameter]: action.data.value
          }
        }
      }
    }
    case UPDATE_GATE_START_TIME: {
      const gateStartTime = action.data.value
      
      return Object.assign({}, state, { gateStartTime })
    }
    case UPDATE_CURRENT_KEY: {
      const currentKey = action.data.value
      
      return Object.assign({}, state, currentKey)
    }
    case UPDATE_RETRIGGER: {
      const retrigger = !state.trigger

      return Object.assign({}, state, { retrigger })
    }
    case UPDATE_ECHO: {
      const echo = {...state.echo}
      echo[action.data.parameter] = action.data.value
      return Object.assign({}, state, { echo: {...echo} })
    }
    default: 
      return state
  }
}

export default SynthReducer