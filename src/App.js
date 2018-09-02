import React from 'react';

import BrainPort from './BrainPort';
import { greetings, personalityGreeting, signOff } from './lib/phraseLibrary';

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recognition: undefined,
      korean: undefined,
      currentListen: undefined,
      synth: undefined,
      language: 'english',
      status: 'stopped',
      switch: false,
      listenStop: false,
      dialogue: [],
      calledOn: false,
      motorMouth: false,
      msgBoxStyle: { transform: 'scaleX(0) scaleY(0)' },
      voice: 'Karen',
      userSpeech: undefined,
      brain: 'dumb',
      speakPitch: 1.2,
      speakRate: 1,
      speakFrequency: 1
    }

    this.addMessageToBox = this.addMessageToBox.bind(this);
    this.setTheState = this.setTheState.bind(this);
    this.speak = this.speak.bind(this);
  }

  componentDidMount() {
    const SpeechRecognition = window.webkitSpeechRecognition;
    const SpeechGrammarList = window.webkitSpeechGrammarList;
    const SpeechRecognitionEvent = window.webkitSpeechRecognitionEvent;

    let recognition = new SpeechRecognition();
    let SpeechRecognitionList = new SpeechGrammarList();

    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;

    var synth = window.speechSynthesis;

    recognition.onstart = () => {
      this.setState({ status: 'Ready' });
      console.log('Recognition Start');
    }

    recognition.onaudiostart = (event) => {
      this.setState({ status: 'listening...' })
      console.log('Audio Start');
    }

    recognition.onsoundstart = () => {
      this.setState({ status: 'Detecting sound...' });
      console.log('Sound Start');
    }

    recognition.onspeechstart = () => {
      this.setState({ status: 'Detecting Speech...' });
      console.log('Speech Start');
    }

    recognition.onaudioend = () => {
      this.setState({ status: 'Detecting Speech...' });
      // console.log('Audio ended');
    }

    recognition.onsoundend = () => {
      this.setState({ status: 'Sound ended' });
      // console.log('Sound ended');
    }

    recognition.onspeechend = () => {
      this.setState({ status: 'Speech ended' });
      // console.log('Speech ended');
    }

    recognition.onerror = (event) => {
      if(event.error !== 'abort') {
        this.setState({ status: 'Error' });
        this.addMessageToBox('helios', 'I have detected an error in speech recognition. I will display the details on the screen.');
        this.addMessageToBox('helios', event.error);
      }
    }

    recognition.onend = () => {
      this.setState({ status: 'Self end' });
      console.log('Self end', this.state.switch)
      if(this.state.switch === true) {
        this.deactivateListenMode();
        this.state.currentListen.start();
      }
    }

    recognition.onresult = async (event) => {
      let last = event.results.length - 1;
      let resultsObj = event.results[last];
      let resultsHash = {};
      let finalHash = {};
      let counter = 0;
      for(let key in resultsObj) {
        const transcript = resultsObj[key].transcript;
        const confidence = resultsObj[key].confidence
        resultsHash[transcript] = {
          confidence: confidence,
          index: counter
        }
        counter++;
      }

      for(let key in resultsHash) {
        finalHash[key.toLowerCase().trim()] = resultsHash[key];
      }

      console.log(finalHash)

      const hardStop = this.checkStopWord(finalHash);
      console.log(hardStop)

      const wasICalled = this.checkName(finalHash);
      console.log(wasICalled)

      if(!synth.speaking) {

        if(hardStop) {
          console.log('hard stop')
          await this.setState({ switch: false })
          const coinFlip = Math.random() > .5 ? true : false;
          const final = coinFlip ? 'Shutting down.' : 'Signing off.';
          let theSignOff = 'Acknowledging hard stop and performing shut down procedures.'
          await this.speak(theSignOff);
          setTimeout(() => {
            this.speak(final);
          }, 3000)

        } else {
          if(this.state.calledOn === true || this.state.needAcknowledge === false) {
            let userSpeech = this.processHeard(finalHash)
            this.addMessageToBox('user', userSpeech)
            await this.setState({ userSpeech })

          } else {
            if(wasICalled) {
              console.log('activating')
              if(this.state.language === 'korean') {
                recognition.abort();
                this.setState({ currentListen: this.state.korean })
                setTimeout(() => {
                  this.state.currentListen.start();
                }, 1750)
              }
              this.activateListenMode();
            }
          }
        }

      } else {
        console.log('Speech catured while I was talking', finalHash)
      }
    }

    let korean = Object.assign({}, this.state.recognition)
    korean.lang = 'ko';

    this.setState({ recognition, korean, synth, currentListen: recognition });
  }

  componentDidUpdate(prevProps, prevState) {
    //////////////////
    // SWITCH
    //////////////////
    if(prevState.switch !== this.state.switch) {
      console.log('switch', this.state.switch)
      if(this.state.switch) {
        this.startListening();
      } else {
        this.stopListening();
      }
    }

    //////////////////
    // DIALOGUE
    //////////////////
    if(prevState.dialogue.length !== this.state.dialogue.length) {
      let msgBox = document.querySelector('.messages');
      msgBox.scrollTop = msgBox.scrollHeight;
    }

    //////////////////
    // LANGUAGE
    //////////////////
    if(prevState.language !== this.state.language) {
      if(this.state.language === 'english') {
        this.setState({ currentListen: this.state.recognition })

      } else if(this.state.language === 'korean') {
        this.setState({ currentListen: this.state.korean })
      }
    }
  }

  async activateListenMode() {
    console.log('starting')
    setTimeout(async () => {
      await this.setTheState('msgBoxStyle', { transform: 'scaleX(1) scaleY(0)' })

      setTimeout(async () => {
        await this.setTheState('msgBoxStyle', { transform: 'scaleX(1) scaleY(1)' })

        setTimeout(async () => {
          await this.setTheState('calledOn', true)
          if(this.state.language === 'korean') {
            this.addMessageToBox('helios', '어떻게 도와 드릴까요?');
            this.state.currentListen.start();
          } else {
            let toSay = this.selectGreeting();
            console.log(typeof toSay)
            this.addMessageToBox('helios', toSay);
            this.speak(toSay)
          }

        }, 1250);
      }, 1000);
    });
  }

  addMessageToBox(who, message) {
    let dialogue = this.state.dialogue.slice();
    dialogue.push({ who, message });
    this.setState({ dialogue });
  }

  checkName(hashObj) {
    const names = [ 'helios', 'chileos', 'chelios', 'korean' ];
    let goodName = false;
    for(let i = 0; i < names.length; i++) {
      for(let key in hashObj) {
        if(key.includes(names[i])) {
          goodName = true;
        }
      }
    }

    if(goodName === true && hashObj['korean'] !== undefined) {
      this.setTheState('language', 'korean')
    }
    console.log('goodName', goodName)
    return goodName;
  }

  checkStopWord(hashObj) {
    const stopWords = [ 'stop listening', 'hard stop', 'shut down' ];
    let hardStop = false;
    for(let i = 0; i < stopWords.length; i++) {
      for(let key in hashObj) {
        if(key.includes(stopWords[i])) {
          hardStop = true;
        }
      }
    }
    return hardStop;
  }

  deactivateListenMode() {
    if(this.state.msgBoxStyle.transform === 'scaleX(1) scaleY(1)') {
      console.log('closing down');
      setTimeout(async () => {
        await this.setTheState('msgBoxStyle', { transform: 'scaleX(1) scaleY(0.1)' })

        setTimeout(async () => {
          await this.setTheState('msgBoxStyle', { transform: 'scaleX(0) scaleY(0)' })

        }, 1000)
      })
    }
    this.reset();
  }

  processHeard(hashObj) {
    while(hashObj[undefined] !== undefined) {
      delete hashObj[undefined];
    }

    let max = 0.0;
    let text;
    for(let key in hashObj) {
      if(hashObj[key].confidence > max) {
        max = hashObj[key].confidence;
        text = key.toString();
      }
    }

    text = text.split('.').join().trim();
    return text;
  }

  selectGreeting() {
    let toSay = '';
    let coinFlip = Math.random() > .5 ? true : false;
    let randOne = Math.floor(Math.random() * personalityGreeting.length);
    let randTwo = Math.floor(Math.random() * greetings.length);
    if(coinFlip) {
      toSay += personalityGreeting[randOne];
    }
    toSay += greetings[randTwo];
    return toSay
  }

  async setTheState(key, value, keyTwo, valueTwo, keyThree, valueThree, keyFour, valueFour) {
    let newState = {
      [key]: value,
      [keyTwo]: valueTwo,
      [keyThree]: valueThree,
      [keyFour]: valueFour
    }

    let safety = 0;
    while(newState.hasOwnProperty(undefined) && safety < 3) {
      delete newState[undefined]
      safety++;
    }

    if(safety >= 3) {
      console.log('Safety Triggered')
    }

    await this.setState( newState );
  }

  async speak(toSay, lang) {
    // await this.setState({ listenStop: true })
    let voices = this.state.synth.getVoices();
    let sayThis = new SpeechSynthesisUtterance(toSay);
    let name = this.state.voice;
    if(lang === 'korean') {
      name = 'Yuna'
    }
    voices.forEach(d => {
      if(d.name === name) {
        sayThis.voice = d
      }
    })
    sayThis.pitch = this.state.speakPitch;
    sayThis.rate = this.state.speakRate;
    this.state.synth.speak(sayThis);
  }

  startListening() {
    this.state.currentListen.start();
  }

  stopListening() {
    this.reset();
    this.state.currentListen.abort();
  }

  reset() {
    this.setState({
      language: 'english',
      status: 'stopped',
      dialogue: [],
      calledOn: false,
      needAcknowledge: true,
      msgBoxStyle: {},
      voice: 'Karen',
      userSpeech: '',
    })
  }

  render() {
    const buttonClass = this.state.switch ? 'start selected' : 'start';

    const messages = this.state.dialogue.map((element, index) => {
      let message;
      if(element.who === 'helios') {
        message = element.message + ' <<';
      } else {
        message = '>> ' + element.message;
      }
      return(
        <React.Fragment key={ index }>
          <p className={ element.who }>{ message }</p>
          <hr />
        </React.Fragment>
      );
    })

    let msgBox;
    if(this.state.brain === 'dumb' || this.state.brain === 'dumbkorean') {
      msgBox = this.state.msgBoxStyle;
    } else if(this.state.brain === 'config') {
      msgBox = {
        ...this.state.msgBoxStyle,
        border: '1px solid red',
      }
    }

    return (
      <main className="container">
        <h1 className="title">H E L I O S</h1>
        <p className="desc">Home v 0.1.0</p>
        <h1 className="state">STATUS: { this.state.status }</h1>
        <div className="messages" style={ msgBox }>
          { messages }
        </div>
        <div className="buttoncontainer">
          <button className={ buttonClass } onClick={() => this.setTheState('switch', true)}>START</button>
          <button className="stop" onClick={() => this.setTheState('switch', false)}>STOP</button>
        </div>
        <BrainPort
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
          motorMouth={ this.state.motorMouth }
          speakFrequency={ this.state.speakFrequency }
        />
      </main>
    );
  }
}

export default App;
