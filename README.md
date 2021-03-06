Helios-react
======
###### ver. 0.1.0
###### Iteration 3

NOTES:
------
## 9/3/18 Monday
#### Complexity
  For one, I got way too excited to play with SR and SS that it because this bloated mess of events firing. Also this was too long of a coding stretch. I started getting dull in the head when trying to reason about the flow. 

  Notes for next time. Covered below... more modularity, even within the base component. In the refactor or next iteration, I think that detaching the dialogue box would be a tremendous help since there really wont be any more render logic. The goal, as I type this, I'm thinking, The base component should really be simply managing state for the SR, SS, and port outs. The goal is no other logic whatsoever. Farm it all out.

#### Modularity
  I wanted to be able to make this a modular system but I broke my own rule with the base component because I saw it as this rocket or huge engine that you stick things on. I'm currently considering separating SS and SR.

  _Cons_ - The whole, shutting of the SR until I detect SS is completely done will likely suck if I separate it. It also might be more annoying since there will be more files.

  _Pros_ - More modular, less complexity.

#### Language
  The original logic was that I'd have a base language and then I can just switch to whatever language based on key words that it's listening for. But I think the whole having a separate process to load up a language other than the base language was a headache. 

  Notes for next time. This is a clear one. Have a default, but even the default should use the same process to load in as the foreign ones. Easier that way.

#### Speech processing
  Switch for fine for a first run at this. I accomplished my goal of collecting commonly misheard phrases.

  Notes for next time. Definitely speech normalize based on the collected phrases. Don't forget to get rid of the confidence key and only keep the value. Consider increasing the number of considered possibilities. Maybe 2. 

Base Component Logic Flow Documentation
------
The purpose of the Base Component (BC) (App.jsx), is to provide and manage verbal and text interface with Helios and produce speech when necessary. Other components will then be added to process and use the information provided by the BC.

### On Load
  Load up Speech Recognition (SR) for both korean and english, loading english as the default language. Each are then set to state.

  Only the browser speech synthesizer (synth) object is initialized and set to state here since the SpeechSynthesisUtterance object needs to be instantiated with the phrase to say.

### Start Button Click
  Sets the switch state to true, then componentDidUpdate will trigger start or SR. Helios will then begin listening.

  Helios is given a range of 5 possible word matches to what it hears in this initial state. These are packaged up and labeled hashObj. The key of the hashObj is what the SR process thinks you said, and the value is the confidence value. Helios listens for one of three things. Its name, the word "_korean_", or a stop phrase in this order.  
  
  -Stop Phrase  
      When one of hard-coded phrases are heard, it sets the switch state to false. Then componentDidUpdate will trigger a reset of variable state and abort the SR. As switch is set to false, this will shut the system down.

  -Its name  
      When it hears its name, it opens the dialogue box signifying that Helios is now active. The calledOn state is used to represent that acknowledgement is no longer necessary.

  -"_Korean_"  
      When it hears the word "_korean_", it treats it like hearing its name, as well as setting language state to 'korean'. When the dialogue box opens, it loads the korean SR instance.

### Stop Button Click
  Sets the switch state to false, then componentDidUpdate will trigger a reset of variable state and abort listening.

### Active State
  Helios displays a greeting message at the start. If the language is korean, the active listening is delayed until the dialogue box is fully visible, while english is immediate. That's because Helios needs to stop the current SR process, then load the korean SR instance, and start that process.

  If calledOn state is true, speech heard is processed to one is stored to state and passed along to the Brain component which will then decide the appropriate response.

  Upon hearing speech, the results are processed down to one result based on the accuracy confidence rating. The speech is lowercased, trimmed, and returned as a string. The result is then passed along to other modules.

### Error handling
  When an error is detected in the SR instance, Helios will display the error on the screen.

Brain Port Functional Component
------
The purpose of this component is to act as a port for the various logic brains. This component renders nothing. It receives props and methods from the Base Component and passes them along to the currently loaded logic brain. 






