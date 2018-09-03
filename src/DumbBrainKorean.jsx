import React from 'react';

import DateAndTime from './modules/DateAndTime';

export default class DumbBrainKorean extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      context: '',
      subject: '',
      method: '',
      tempContext: '',
    }
  }

  componentDidMount() {
    console.log('Dumb Brain Korean loaded')
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.input !== this.props.input && this.props.input !== '') {
      console.log('this is running');
      this.processing(this.props.input);
    }
  }

  // output(message, toSpeak) {
  //   const { display } = this.props;
  //   if(toSpeak !== undefined) {
  //     toSpeak = message;
  //   }
  //   this.setState({ toSpeak })
  //   display('helios', message)
  // }

  async processing(input) {
    const { display, speak, setAppState, speakFrequency } = this.props;
    const { currentTime, timerGivenNone } = DateAndTime;

    let replyShow;
    let timeObj;
    let toSay;
    input = input.split('please').join('');
    console.log('received', input);

    switch(input) {
      case '영어':
      case '영어로 다시 바꿔 주세요':
      case '영어로 다시 변경하십시오':
      case '영어로 다시 변경하십시오':
      case '영어로 다시 바꿔라':
        display('helios', '예. 영어로 다시 바꿀 것이다');
        speak('예. 영어로 다시 바꿀 것이다', 'korean')
        break;

      case '지금 몇 시지':
      case '지금 몇시인가요':
      case '시간을 말해 줄 수 있니':
      case '몇시입니까':
        timeObj = currentTime();
        replyShow = `지금은 ${timeObj.timeShow}`
        display('helios', replyShow);
        speak(replyShow, 'korean');
        await this.setState({
          context: 'currentTime',
          tempContext: '지금 몇 시지'
        })
        break;

      case '한 번 더':
      case '한번 더':
      case '다시 한번':
      case '다시 말해':
        this.processing(this.state.context);
    }
  }

  render() {
    return ( null );
  }
}
