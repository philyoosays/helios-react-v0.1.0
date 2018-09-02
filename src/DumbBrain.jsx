import React from 'react';

import DateAndTime from './modules/DateAndTime';

const { currentTime } = DateAndTime;

export default class DumbBrain extends React.Component {
  constructor(props) {
    super(props);
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

  processing(input) {
    const { display, speak, setAppState } = this.props;

    let replyShow;
    let timeObj;
    input = input.split('please')
    console.log('received', input);

    switch(input) {
      case 'switch to configuration mode':
      case 'switch to config mode':
      case 'switch to configuration':
      case 'switch to config':
      case 'bring up configuration mode':
      case 'bring up config mode':
      case 'bring up configuration':
      case 'bring up config':
        display('helios', 'Entering configuration mode');
        setAppState('brain', 'config')
        break;
      case 'tell me the time':
      case 'tell me what time it is':
      case 'can you tell me the time':
      case 'can you tell me what time it is':
        timeObj = currentTime();
        replyShow = `The current time is ${timeObj.timeShow}`;
        display('helios', replyShow);
        speak(replyShow);
      case 'what time is it':
      case 'do you know the time':
      case 'do you know what time it is':
      case 'have you got the time':
      case 'do you have the time':
      case 'show me the time':
      case 'show me what time it is':
        timeObj = currentTime();
        replyShow = `The current time is ${timeObj.timeShow}`;
        display('helios', replyShow);
        break;
      case 'is my mother home':
      case 'is my mom home':
      case 'is she in':
      case 'is she currently in':
      case 'is she at home':
      case 'is she home':
      case 'is she currently home':
      case 'is she currently at home':
        fetch('http://67.250.209.166:6001/api/ping', {
          headers: {
            secretHandshake: process.env.REACT_APP_SECRET
          }
        })
        .then(response => response.json())
          .then(data => {
            if(data === 'Yes') {
              display('helios', 'She is currently at home.')
              speak('She is indeed, currently at home');
            } else {
              display('helios', 'She is currently not at home.')
              speak('She currently not in at the moment.');
            }
          })
      default:
        replyShow = 'I\'m sorry but I didn\'t you. Could you please try again?';
        display('helios', replyShow)
        break;
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


