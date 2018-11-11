Features:
-FM
-Sync
-Cross-mod
-Filter Keyboard amount
-Portamento
-add envelope responses (logarithmic, exponential, etc.)
-expand oscilloscope to be able to show off various data
-waveshaping
-PWM
-Polyphony/Voice Allocation
-Octave/1-note stack
-filter type/slope control
-more retrigging options (per envelope?)
-FX --> delay, reverb, chorus, distortion
-LFOs
-sequencer
-MIDI
-Supersaw
-patch saving
-Keyboard
    -touch events
-more rigorous module and sub-module styling
-standardize addition of new modules (VCOs, filters, etc.)
-variable envelope response times (fast, medium, slow)

Bugs:
-Fix filter env
-fix envelope timing & clicking
-fix oscilloscope

Other/Housekeeping:
-build/find Knob/Slider
-clean up constants/utils organization
-clean up VCF/VCA components
    -modularize modulation
    -programmatize handlers
    -state manipulation/consumption
        -Mobx/Context

Tech
-consider Redux for global state --> would help with decoupling (acting as an event manager)
-PWA --> Manifest, HTTPS, Service Worker