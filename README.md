Helios-react
======
###### ver. 0.1.0
###### Iteration 3

Base Component Logic Flow Documentation
------
The purpose of the Base Component (BC) (App.jsx), is to provide and manage verbal and text interface with Helios and produce speech when necessary. Other components will then be added to process and use the information provided by the BC.

### On Load
  Load up Speech Recognition (SR) for both korean and english, loading english as the default language. Each are then set to state.

  Only the browser speech synthesizer (synth) object is initialized and set to state here since the SpeechSynthesisUtterance object needs to be instantiated with the phrase to say.

### Start Button Click
  Sets the switch state to true, then componentDidUpdate will trigger start or SR. Helios will then begin listening.

  Helios is given a range of 5 possible word matches to what it hears in this initial state. These are packaged up and labeled hashObj. The key of the hashObj is what the SR process thinks you said, and the value is the confidence value. Helios listens for one of three things. Its name, the word "_korean_", or a stop phrase in this order.
    *Stop Phrase
      When one of hard-coded phrases are heard, it sets the switch state to false. Then componentDidUpdate will trigger a reset of variable state and abort the SR. As switch is set to false, this will shut the system down.
    *Its name
      When it hears its name, it opens the dialogue box signifying that Helios is now active. The calledOn state is used to represent that acknowledgement is no longer necessary.
    *"**Korean"
      When it hears the word "_korean_", it treats it like hearing its name, as well as setting language state to 'korean'. When the dialogue box opens, it loads the korean SR instance.

### Stop Button Click
  Sets the switch state to false, then componentDidUpdate will trigger a reset of variable state and abort listening.

### Active State
  Helios displays a greeting message at the start. If the language is korean, the active listening is delayed until the dialogue box is fully visible, while english is immediate. That's because Helios needs to stop the current SR process, then load the korean SR instance, and start that process.

  If calledOn state is true, speech heard is processed to one is stored to state and passed along to the Brain component which will then decide the appropriate response.

  Upon hearing speech, the results are processed down to one result based on the accuracy confidence rating. The speech is lowercased, trimmed, and returned as a string. The result is then passed along to other modules.

### Error handling
  When an error is detected in the SR instance, Helios will display the error on the screen.








