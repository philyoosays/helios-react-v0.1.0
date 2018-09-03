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
    const { seekApproval, testPhrases } = phraseLibrary;

    let replyShow;
    let timeObj;
    let confirm;
    input = input.split('please').join('')
    console.log('received', input);

    switch(input) {
      case 'a bit more':
      case 'more':
      case 'mor':
      case 'again':
        this.processing(this.state.tempContext)
        break;
      case 'use more words':
      case 'used more words':
      case 'use longer sentences':
      case 'used longer sentences':
        await this.setState({ method: 'testSentences' })
        this.processing(this.state.tempContext)
        break;
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
      case 'lower voice pitch':
      case 'reduce voice pitch':
      case 'reduce your voice\'s pitch':
      case 'reduce your voice pitch':
      case 'reduce the pitch of your voice':
      case 'drop your voice\'s pitch':
      case 'drop your voice pitch':
      case 'drop your voice\'s pitch':
      case 'drop the pitch of your voice':
        await setAppState('speakPitch', (speakPitch - 0.1))
        await this.setState({
          context: 'reduce voice pitch',
          subject: 'voice pitch',
          tempContext: input
        })
        if(this.state.method === 'testSentences') {
          let rand = Math.floor(Math.random() * testPhrases.length);
          replyShow = testPhrases[rand].show;
          this.output(replyShow);
          speak(testPhrases[rand].say)
        } else {
          let rand = Math.floor(Math.random() * seekApproval.length);
          replyShow = seekApproval[rand];
          this.output('How is this?');
          speak('How is this?')
        }
        break;
      case 'raise the pitch of your voice':
      case 'raise your voice pitch':
      case 'raise your voice\'s pitch':
      case 'raise voice pitch':
      case 'increase voice pitch':
      case 'increase your voice\'s pitch':
      case 'increase your voice pitch':
      case 'increase the pitch of your voice':
      case 'up voice pitch':
      case 'up your voice\'s pitch':
      case 'up your voice pitch':
      case 'up the pitch of your voice':
        await setAppState('speakPitch', (speakPitch + 0.1))
        await this.setState({
          context: 'raise voice pitch',
          subject: 'voice pitch',
          tempContext: input
        })
        if(this.state.method === 'testSentences') {
          let rand = Math.floor(Math.random() * testPhrases.length);
          replyShow = testPhrases[rand].show;
          this.output(replyShow);
          speak(testPhrases[rand].say)
        } else {
          let rand = Math.floor(Math.random() * seekApproval.length);
          replyShow = seekApproval[rand];
          this.output(replyShow);
          speak(replyShow)
        }
        break;
      case 'raise the rate of speech':
      case 'raise your rate of speech':
      case 'raise your speech rate':
      case 'raise speech rate':
      case 'increase the rate of speech':
      case 'increase your rate of speech':
      case 'increase your speech rate':
      case 'increase speech rate':
      case 'up the rate of speech':
      case 'up your rate of speech':
      case 'up your speech rate':
      case 'up speech rate':
        await setAppState('speakPitch', (speakPitch + 0.1))
        await this.setState({
          context: 'raise voice pitch',
          subject: 'voice pitch',
          tempContext: input
        })
        if(this.state.method === 'testSentences') {
          let rand = Math.floor(Math.random() * testPhrases.length);
          replyShow = testPhrases[rand].show;
          this.output(replyShow);
          speak(testPhrases[rand].say)
        } else {
          let rand = Math.floor(Math.random() * seekApproval.length);
          replyShow = seekApproval[rand];
          this.output(replyShow);
          speak(replyShow)
        }
        break;
      case 'lower the rate of speech':
      case 'lower your rate of speech':
      case 'lower your speech rate':
      case 'lower speech rate':
      case 'decrease the rate of speech':
      case 'decrease your rate of speech':
      case 'decrease your speech rate':
      case 'decrease speech rate':
      case 'drop the rate of speech':
      case 'drop your rate of speech':
      case 'drop your speech rate':
      case 'drop speech rate':
        await setAppState('speakPitch', (speakPitch + 0.1))
        await this.setState({
          context: 'raise voice pitch',
          subject: 'voice pitch',
          tempContext: input
        })
        if(this.state.method === 'testSentences') {
          let rand = Math.floor(Math.random() * testPhrases.length);
          replyShow = testPhrases[rand].show;
          this.output(replyShow);
          speak(testPhrases[rand].say)
        } else {
          let rand = Math.floor(Math.random() * seekApproval.length);
          replyShow = seekApproval[rand];
          this.output(replyShow);
          speak(replyShow)
        }
        break;
      case 'i want to change your voice':
      case 'I want you to change your voice':
      case 'change your voice':
      case 'change your voice for me':
      case '':
        break;
      case 'switch out of configuration mode':
      case 'switch out of config mode':
      case 'switch out of configuration':
      case 'switch out of config':
      case 'switch away from configuration mode':
      case 'switch away from config mode':
      case 'switch away from configuration':
      case 'switch away from config':
      case 'turn off configuration mode':
      case 'turn off config mode':
      case 'turn off configuration':
      case 'turn off config':
      case 'shut down configuration mode':
      case 'shut down config mode':
      case 'shut down configuration':
      case 'shut down config':
        this.output('Exiting configuration mode');
        setAppState('brain', 'dumb')
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
