Helios-react
======
###### ver. 0.1.0
###### Iteration 3

Base Component Logic Flow Documentation
------
### On Load
  Load up speech recognition for both korean and english, loading english as the default language. Each are then set to state.

  Only the browser speech synthesizer object is initialized and set to state here since the SpeechSynthesisUtterance object needs to be instantiated with the phrase to say.

### Start Button Click
  Sets the switch state to true, then componentDidUpdate will trigger start or speech recognition. Helios will then begin listening.

  Helios is given a range of 5 possible word matches to what it hears in this initial state. Helios listens for one of three things. Its name, the word "_korean_", or a stop phrase in this order.
    *Stop Phrase
      When one of hard-coded phrases are heard, it sets the switch state to false. Then componentDidUpdate will trigger a reset of variable state and abort the speech recognition. As switch is set to false, this will shut the system down.
    *Its name
      When it hears its name, it opens the dialogue box signifying that Helios is now active.
    *"**Korean"
      When it hears the word "_korean_", it treats it like hearing its name, as well as setting language state to 'korean'. When the dialogue box opens, it loads the korean Speech Recognition instance.

### Stop Button Click
  Sets the switch state to false, then componentDidUpdate will trigger a reset of variable state and abort listening.




