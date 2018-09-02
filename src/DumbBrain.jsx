import React from 'react';

import DateAndTime from './modules/DateAndTime';

const { currentTime, } = DateAndTime;

export default function DumbBrain(props) {
  const { ears, mouth, language, shortMemory, input, display, speak, setAppState } = props;

  let replyShow;
  let timeObj;
  console.log('received', input);

  switch(input) {
    case 'tell me the time':
    case 'tell me what time it is':
      timeObj = currentTime();
      replyShow = `The current time is ${timeObj.timeSay}`;
      display('helios', replyShow);
      speak(replyShow);
    case 'what time is it':
    case 'do you know the time':
    case 'do you know what time it is':
    case 'have you got the time':
    case 'do you have the time':
    case 'can you tell me the time':
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
          secretHandshake: 'authorized'
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


