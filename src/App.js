import React from 'react';

import BrainPort from './BrainPort';
import { greetings, personalityGreeting, signOff } from './lib/phraseLibrary';

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recognition: undefined,
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

  async componentDidMount() {
    const SpeechRecognition = window.webkitSpeechRecognition;
    const SpeechGrammarList = window.webkitSpeechGrammarList;
    const SpeechRecognitionEvent = window.webkitSpeechRecognitionEvent;

    let recognition = new SpeechRecognition();
    let SpeechRecognitionList = new SpeechGrammarList();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;

    var synth = window.speechSynthesis;
    let timer;

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
      // timer = setTimeout(() => {
      //   this.state.recognition.stop()
      // }, 8000)
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
      if(event.error !== 'aborted') {
        this.setState({ status: 'Error' });
        this.addMessageToBox('helios', 'I have detected an error in speech recognition. I will display the details on the screen.');
        this.addMessageToBox('helios', event.error);
      } else if(this.state.switch === true && this.state.language === 'english') {
        this.startListening();
      }
    }

    recognition.onend = async () => {
      this.setState({ status: 'Self end' });
      console.log('Self end', this.state.switch)
      if(this.state.switch === true) {
        await this.deactivateListenMode();
        await this.reset()
        await this.setState({ switch: true })
        await this.startListening();
      }
    }

    recognition.onresult = async (event) => {
      console.log('Is Helios Speaking?', this.state.synth.speaking);
      console.log('Is Helios Speaking?', synth.speaking);
      console.log('Is Helios Speaking?', this.state.listenStop)
      console.log('new result')
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

      console.log('finalhash', finalHash)

      const hardStop = this.checkStopWord(finalHash);
      console.log('hardstop', hardStop)

      console.log(this.state.calledOn)
      const wasICalled = this.checkName(finalHash);
      console.log('was I called?', wasICalled)

      if(!this.state.listenStop) {

        if(hardStop) {
          console.log('hard stop')
          await this.setState({ switch: false })
          const coinFlip = Math.random() > .5 ? true : false;
          const final = coinFlip ? 'Shutting down.' : 'Signing off.';
          let theSignOff = 'Acknowledging hard stop and performing shut down procedures.'
          this.stopListening();
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
              console.log('not hardstop, active if called')
              if(wasICalled === 'korean') {
                await this.state.recognition.abort();
                recognition.lang = 'ko-KR';
                await this.setState({
                  language: 'korean'
                })
                console.log('recog lang', recognition.lang)
              } else if(wasICalled === true) {
                recognition.lang = 'en-US';
              }
              this.activateListenMode();
            }
          }
        }

      } else {
        console.log('Speech catured while I was talking', finalHash)
        await this.setState({ listenStop: false })
      }
    }
    console.log('onresult done')
    await this.setState({ synth, recognition });
  }

  async componentDidUpdate(prevProps, prevState) {
    //////////////////
    // SWITCH
    //////////////////
    if(prevState.switch !== this.state.switch) {
      console.log('switch changed from', prevState.switch, 'to', this.state.switch)
      if(this.state.switch) {
        console.log('switch is on')
        this.startListening();
      } else {
        console.log('switch is off')
        this.state.recognition.abort();
        this.deactivateListenMode();
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
    // CALLED ON
    //////////////////
    if(prevState.calledOn !== this.state.calledOn) {
      console.log(prevState.calledOn, 'v', this.state.calledOn);
      console.log(this)
    }
  }

  async activateListenMode() {
    console.log('starting activeListenMode')
    console.log('activeListen lang:', this.state.language)
    setTimeout(async () => {
      await this.setTheState('msgBoxStyle', { transform: 'scaleX(1) scaleY(0)' })

      setTimeout(async () => {
        await this.setTheState('msgBoxStyle', { transform: 'scaleX(1) scaleY(1)' })

        setTimeout(async () => {
          await this.setTheState('calledOn', true)
          if(this.state.language === 'korean') {
            this.addMessageToBox('helios', '어떻게 도와 드릴까요?');
            this.speak('어떻게 도와 드릴까요?', 'korean')
          } else {
            let toSay = this.selectGreeting();
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

  async changeLanguage(lang, recog){
    if(lang === 'korean') {
      let obj = Object.assign({}, recog)
      obj.lang = 'ko-KR';
      await this.setState({
        language: 'korean'
      })
    }
    return recog;
  }

  checkName(hashObj) {
    const names = [ 'helios', 'chileos', 'chelios', 'korean' ];
    let goodName = false;
    if(!this.state.calledOn) {
      for(let i = 0; i < names.length; i++) {
        for(let key in hashObj) {
          if(key.includes(names[i])) {
            goodName = true;
          }
        }
      }

      if(goodName === true && hashObj['korean'] !== undefined) {
        goodName = 'korean'
      }
    } else {
      goodName = true;
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
      this.setState({ status: 'Ready...' })
      setTimeout(async () => {
        await this.setTheState('msgBoxStyle', { transform: 'scaleX(1) scaleY(0.1)' })

        setTimeout(async () => {
          await this.setTheState('msgBoxStyle', { transform: 'scaleX(0) scaleY(0)' })

        }, 1000)
      })
    }
    this.resetLanguage();
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
    let voices = this.state.synth.getVoices();
    let sayThis = new SpeechSynthesisUtterance(toSay);

    await this.setState({ listenStop: true })
    sayThis.onend = async (event) => {
      console.log('Utterance has finished being spoken after ' + event.elapsedTime + ' milliseconds.');
    }
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
    if(this.state.synth.speaking) {
      this.setState({ listenStop: true })
    }
  }

  startListening() {
    this.state.recognition.start();
  }

  stopListening() {
    this.reset();
    if(this.state.recognition) {
      this.state.recognition.abort();
    }
  }

  reset() {
    this.setState({
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
    })
  }

  resetLanguage() {
    this.setState({
      listenStop: false,
      dialogue: [],
      motorMouth: false,
      voice: 'Karen',
      brain: 'dumb',
      speakPitch: 1.2,
      speakRate: 1,
      speakFrequency: 1
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
          <button className={ buttonClass } onClick={() => this.setState({switch: true})}>START</button>
          <button className="stop" onClick={() => this.setState({switch: false})}>STOP</button>
        </div>
        <BrainPort
          brain={ this.state.brain }
          ears={ this.state.recognition }
          mouth={ this.state.synth }
          language={ this.state.language }
          shortMemory={ this.state.dialogue }
          input={ this.state.userSpeech }
          display={ this.addMessageToBox }
          speak={ this.speak }
          setAppState={ this.setTheState }
          instance={ this }
          needAcknowledge={ this.state.needAcknowledge }
          motorMouth={ this.state.motorMouth }
          speakFrequency={ this.state.speakFrequency }
          speakPitch={ this.state.speakPitch }
          speakRate={ this.state.speakRate }
        />
      </main>
    );
  }
}

export default App;
