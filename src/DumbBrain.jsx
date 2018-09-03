import React from 'react';

import { amAble } from './lib/phraseLibrary';
import DateAndTime from './modules/DateAndTime';

export default class DumbBrain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toSpeak: '',
      forceSpeak: false,
      external: '',
    }
  }

  componentDidMount() {
    console.log('Dumb brain loaded')
  }

  componentDidUpdate(prevProps) {
    if(prevProps.input !== this.props.input && this.props.input !== '') {
      console.log('this is running');
      this.processing(this.props.input);
    }
  }

  output(message, toSpeak) {
    const { display } = this.props;
    if(toSpeak !== undefined) {
      toSpeak = message;
    }
    this.setState({ toSpeak })
    display('helios', message)
  }

  async processing(input) {
    const { setAppState, speakFrequency, speak } = this.props;
    const { currentTime, timerGivenNone } = DateAndTime;

    let replyShow;
    let timeObj;
    let toSay;
    let alreadySpoke = false;
    input = input.split('please').join('');
    console.log('received', input);

    switch(input) {
      ////////////////////
      // CONFIGURATION
      ////////////////////
      case 'switch to configuration mode':
      case 'switch to config mode':
      case 'switch to configuration':
      case 'switch to config':
      case 'bring up configuration mode':
      case 'bring up config mode':
      case 'bring up configuration':
      case 'bring up config':
        this.output('Entering configuration mode');
        setAppState('brain', 'config')
        break;

      ////////////////////////////
      // DATE AND TIME MODULE
      ////////////////////////////
      case 'tell me the time':
      case 'tell me what time it is':
      case 'can you tell me the time':
      case 'can you tell me what time it is':
        timeObj = currentTime();
        await this.setState({ forceSpeak: true })
      case 'what time is it':
      case 'do you know the time':
      case 'do you know what time it is':
      case 'have you got the time':
      case 'do you have the time':
      case 'show me the time':
      case 'show me what time it is':
        timeObj = currentTime();
        replyShow = `The current time is ${timeObj.timeShow}`;
        this.output(replyShow, `The current time is ${timeObj.timeSay}`);
        break;
      case 'set a timer':
      case 'set a timer for me':
      case 'can you set a timer':
      case 'can you set a timer for me':
        let rand = Math.floor(Math.random() * amAble.length);
        replyShow = amAble[rand];
        replyShow += ' For how long should I set a timer for?';
        this.output(replyShow)
        break;
      //////////////////////
      // Home Utilities
      //////////////////////
      case 'is my mother home':
      case 'is my mother home right now':
      case 'is my mom home':
      case 'is my mome home right now':
      case 'is she in':
      case 'is she in right now':
      case 'is she currently in':
      case 'is she currently in right now':
      case 'is she at home':
      case 'is she home':
      case 'is she currently home':
      case 'is she currently at home':
      case 'is she at home right now':
        fetch('http://67.250.209.166:6001/api/ping', {
          headers: {
            secretHandshake: process.env.REACT_APP_SECRET
          }
        })
        .then(response => response.json())
          .then(data => {
            if(data === 'Yes') {
              this.output('She is currently at home.', 'She is indeed, currently at home');
            } else {
              this.output('She is currently not at home.', 'She currently is not in at the moment.');
            }
          })
        break;
      // default:
      //   replyShow = 'I\'m sorry but I didn\'t catch that. Could you please try again?';
      //   this.output(replyShow)
      //   speak('I\'m sorry but I didn\'t catch that. Could you please try again?')
      //   break;
    }

    if(speakFrequency === 2) {
      speak(this.state.toSpeak);

    } else if(this.state.forceSpeak && speakFrequency > 0) {
      speak(this.state.toSpeak);
    }
  }

  render() {
    return( null );
  }
}

function hashToString(hash) {
  for(let key in hash) {
    return key
  }
}

function trimResults(hash) {
  let toDelete = [];
  console.log(hash)
  for(let key in hash) {
    if(hash[key].index > 0) {
      toDelete.push(key)
      hash[key] = hash[key].confidence;
    }
  }
  toDelete.forEach(d => {
    delete hash[d];
  })
}

function makeLeftOver(key, target) {
  let targetLength = target.length;
  let leftOver = key.slice(targetLength);
  return leftOver;
}


