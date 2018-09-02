import React from 'react';

import DateAndTime from './modules/DateAndTime';

const { currentTime, } = DateAndTime;

export default function koreanDumbBrain(props) {
  const { ears, mouth, language, shortMemory, input, display, speak, setAppState } = props;

  let replyShow;
  let timeObj;
  console.log('received', input);

  switch(input) {
    case '영어':

      break;

    case '지금 몇 시지':
      timeObj = currentTime();
      replyShow = `지금은 ${timeObj.timeShow}`
      display('helios', replyShow);
      speak(replyShow, 'korean');
      break;
  }
  return( null );
}
