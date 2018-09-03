import React from 'react';

import phraseLibrary from './lib/phraseLibrary';

export default class DumbBrainConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toSpeak: '',
      context: '',
      subject: '',
      method: '',
      tempContext: '',
    }
  }

  componentDidMount() {
    console.log('Dumb brain loaded')
  }

  componentDidUpdate(prevProps) {
    if(prevProps.input !== this.props.input && this.props.input !== '') {
      this.processing(this.props.input);
    }

    if(prevProps.needAcknowledge !== this.props.needAcknowledge) {
      let state;
      if(this.props.needAcknowledge === false) {
        state = 'disabled'
      } else {
        state = 'enabled';
      }

      this.props.display('helios', `needAcknowledge has been ${state}`);

      if(this.props.motorMouth > 1) {
        this.props.speak(`need acknowledge has been ${state}`);
      }
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
    const { display, speak, setAppState } = this.props;
    const { speakPitch, speakRate, speakFrequency } = this.props;
    const { seekApproval } = phraseLibrary;

    let replyShow;
    let timeObj;
    let confirm;
    input = input.split('please')
    console.log('received', input);

    switch(input) {
      case 'a bit more':
      case 'more':
      case 'again':

      case 'dont stop listening':
      case 'dont go to sleep':
      case 'i need you to stay awake':
      case 'set need acknowledge to false':
      case 'turn off need acknowledge':
      case 'turn need acknowledge off':
      case 'turn need acknowledge back off':
        await setAppState('needAcknowledge', false)
        break;

      case 'lower the pitch of your voice':
      case 'lower your voice pitch':
      case 'lower your voice\'s pitch':
      case 'reduce voice pitch':
      case 'reduce your voice\'s pitch':
      case 'reduce your voice pitch':
      case 'reduce the pitch of your voice':
        await setAppState('speakPitch', (speakPitch - 0.1))
        await this.setState({
          context: 'reduce',
          subject: 'voice pitch'
        })
        if(this.state.method === 'testSentences') {

        }
        this.output('How is this?');
        break;
      case 'i want to change your voice':
      case 'I want you to change your voice':
      case 'change your voice':
      case 'change your voice for me':
      case '':
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
