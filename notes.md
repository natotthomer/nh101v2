either I need a nested state structure, or I need redux, or I need a stable system for parsing and converting complex function names to key value pairs in state

I think Redux is the way
    -it allows for a more thoughtful and less brittle methodology for handling what boils down to managing a global state
    -my way entails passing a method that calls setState() from the state-handling parent to its children for them to call with the appropriate input data or event as arguments
        -though I think this is an interesting option for bespoke state management (to make it modular and programmatic), it seems quite brittle without taking extreme, probably unnecessarily close care