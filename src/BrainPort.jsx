import React from 'react';

import DumbBrain from './DumbBrain';
import DumbBrainKorean from './DumbBrainKorean';
import DumbBrainConfig from './DumbBrainConfig';
/*
  Brain gets these props
  ======================
  brain={ this.state.brain }
  ears={ this.state.currentListen }
  mouth={ this.state.synth }
  language={ this.state.language }
  shortMemory={ this.state.dialogue }
  input={ this.state.userSpeech }
  display={ this.addMessageToBox }
  speak={ this.speak }
  setAppState={ this.setTheState }
  needAcknowledge={ this.state.needAcknowledge }
*/

export default function BrainPort(props) {
  let toLoad;
  if(props.brain === 'dumb' && props.language === 'english') {
    toLoad = <DumbBrain
                ears={ props.ears }
                mouth={ props.mouth }
                language={ props.language }
                shortMemory={ props.shortMemory }
                input={ props.input }
                display={ props.display }
                speak={ props.speak }
                setAppState={ props.setAppState }
                speakFrequency={ props.speakFrequency }
                instance={ props.instance }
              />
  } else if(props.brain === 'dumb' && props.language === 'korean') {
    toLoad = <DumbBrainKorean
                ears={ props.ears }
                mouth={ props.mouth }
                language={ props.language }
                shortMemory={ props.shortMemory }
                input={ props.input }
                display={ props.display }
                speak={ props.speak }
                setAppState={ props.setAppState }
                speakFrequency={ props.speakFrequency }
              />
  } else if(props.brain === 'config' && props.language === 'english') {
    toLoad = <DumbBrainConfig
                ears={ props.ears }
                mouth={ props.mouth }
                language={ props.language }
                shortMemory={ props.shortMemory }
                input={ props.input }
                display={ props.display }
                speak={ props.speak }
                setAppState={ props.setAppState }
                needAcknowledge={ props.needAcknowledge }
                speakFrequency={ props.speakFrequency }
                speakPitch={ props.speakPitch }
                speakRate={ props.speakRate }
                instance={ props.instance }
              />
  }

  return( toLoad );
}
