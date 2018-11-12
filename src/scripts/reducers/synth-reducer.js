import {
    UPDATE_VCO, UPDATE_VCF, UPDATE_VCA, UPDATE_GATE_START_TIME, UPDATE_CURRENT_KEY, UPDATE_RETRIGGER
} from '../constants/synth-constants'

const _nulLSynth = {
    vcos: [
        {
            oscillatorOctave: 3,
            oscillatorDetune: 0,
            oscillatorWaveform: 'sawtooth',
            oscillatorGain: 0.5,
            id: 0
        }, {
            oscillatorOctave: 4,
            oscillatorDetune: 0,
            oscillatorWaveform: 'sawtooth',
            oscillatorGain: 0.5,
            id: 1
        }
    ],
    vcf: {
        filterAttackTime: 1.0,
        filterDecayTime: 1.0,
        filterSustainLevel: 0.5,
        filterReleaseTime: 0.3,
        filterCutoffFrequency: 1000,
        filterQ: 1.0,
        filterEnvelopeAmount: 1.0
    },
    vca: {
        amplifierAttackTime: 1.0,
        amplifierDecayTime: 1.0,
        amplifierSustainLevel: 0.5,
        amplifierReleaseTime: 0.3
    },
    controller: 'keyboard',
    currentKey: null,
    gateStartTime: null,
    retrigger: true
}

// const data = {
//     parameter: 'detune',
//     vcoID: 1,
//     value: 0.0041
// }

// this.props.updateVCO()

const SynthReducer = (state = _nulLSynth, action) => {
    switch (action.type) {
        case UPDATE_VCO: {
            // console.log(action)
            
            const vcos = [...state.vcos]
            const vco = vcos[action.data.id]

            vco[action.data.parameter] = action.data.value
            vcos[action.data.id] = vco

            return Object.assign({}, state, { vcos })
        }
        case UPDATE_VCF: {
            const vcf = {...state.vcf}
            vcf[action.data.parameter] = action.data.value

            return Object.assign({}, state, { vcf })
        }
        case UPDATE_VCA: {
            const vca = {...state.vca}
            vca[action.data.parameter] = action.data.value
            
            return Object.assign({}, state, { vca })
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
        default: 
            return state
    }
}

export default SynthReducer