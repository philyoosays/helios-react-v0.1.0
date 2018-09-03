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
      context: '',
      subject: '',
      method: '',
      tempContext: '',
      timeout: undefined,
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

  componentWillUnmount() {
    if(this.state.timeout !== undefined) {
      this.props.speak('My brain is undocking but there is a timer that I am cancelling')
      clearTimeout(this.state.timeout);
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
    const { speakFrequency, speak, setAppState } = this.props;
    const { currentTime, timerGivenNone, setTimer } = DateAndTime;

    let time;
    let replyShow;
    let timeObj;
    let toSay;
    let alreadySpoke = false;
    input = input.split('please').join('');
    console.log('received', input);

    let toMatch = await needVerbalResponse(input, this);
    console.log('toMatch', toMatch)

    if(input !== undefined) {
      switch(toMatch) {
        ////////////////////
        // CONFIGURATION
        ////////////////////
        case 'switch to configuration mode':
        case 'switch to config mode':
        case 'switch to configuration':
        case 'switch to config':
        case 'switch 2 configuration mode':
        case 'switch 2 config mode':
        case 'switch 2 configuration':
        case 'switch 2 config':
        case 'bring up configuration mode':
        case 'bring up config mode':
        case 'bring up configuration':
        case 'bring up config':
          this.output('Entering configuration mode');
          setAppState('brain', 'config')
          break;
      }

      switch(toMatch) {
        ////////////////////////////
        // DATE AND TIME MODULE
        ////////////////////////////
        case 'the time':
        case 'what time it is':
        case 'do you know what time it is':
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

        /////////////////////////////////////
        // SET TIMER WITHOUT GIVEN TIME
        /////////////////////////////////////
        case 'set a timer':
        case 'set a timer for me':
        case 'can you set a timer':
        case 'can you set a timer for me':
          let rand = Math.floor(Math.random() * amAble.length);
          replyShow = amAble[rand];
          replyShow += ' For how long should I set a timer for?';
          this.output(replyShow)
          break;
      }

      //////////////////////////////////
      // SET TIMER WITH GIVEN TIME
      //////////////////////////////////
      if(toMatch.slice(0, 15) === 'set a timer for') {
        time = setTimer(toMatch.slice(16));
      } else if(toMatch.slice(0, 23) === 'can you set a timer for') {
        time = setTimer(toMatch.slice(24));
      } else if(toMatch.slice(0, 22) === 'please set a timer for') {
        time = setTimer(toMatch.slice(23));
      }

      ///////////////////////////////
      // Prep for HOME UTILITIES
      ///////////////////////////////
      if(toMatch && toMatch.slice(0, 2) === 'is') {
        toMatch = toMatch.slice(3);
      }

      switch(toMatch) {
        //////////////////////
        // Home Utilities
        //////////////////////
        case 'my mother home':
        case 'my mother home right now':
        case 'my mom home':
        case 'my mom is home right now':
        case 'my momther is home right now':
        case 'she in':
        case 'she is in':
        case 'she is in right now':
        case 'she\'s in':
        case 'she\'s in right now':
        case 'shes in':
        case 'shes in right now':
        case 'she in right now':
        case 'she currently in':
        case 'my mother is currently in':
        case 'she currently in right now':
        case 'she at home':
        case 'she home':
        case 'shes home':
        case 'she\'s home':
        case 'shes home right now':
        case 'she home right now':
        case 'she currently home':
        case 'she currently at home':
        case 'she at home right now':
        case 'she currently at home right now':
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
    }

    if(time !== undefined) {
      let interval = setTimeout(() => {

      }, time)
      this.setState
    }

    if(speakFrequency === 2) {
      speak(this.state.toSpeak);

    } else if(this.state.forceSpeak && speakFrequency > 0) {
      console.log('here')
      speak(this.state.toSpeak);
    }
    this.setState({ forceSpeak: false })


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

async function needVerbalResponse(input, instance) {
  if(instance === undefined) {
    instance = this;
  }

  let exists = false;
  let theReturn;
  let lastSlice;

  if(input) {
    const verbalRequest = [ 'tell me', 'tell me if', 'can you tell me', 'can you tell me if', 'could you tell me' ];
    verbalRequest.forEach(d => {
      let toSlice = d.length;
      let toMatch = input.slice(0, toSlice);
      if(input.slice(0, toSlice) === d) {
        exists = true;
        lastSlice = toSlice;
      }
    })
    if(exists) {
      theReturn = input.slice(lastSlice).trim();
      await instance.setState({ forceSpeak: true })
    } else {
      theReturn = input;
    }
  }

  return theReturn
}


















