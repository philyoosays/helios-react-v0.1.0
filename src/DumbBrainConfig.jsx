import React from 'react';

export default class DumbBrainConfig extends React.Component {
  constructor(props) {
    super(props);
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

  async processing(input) {
    const { display, speak, setAppState } = this.props;

    let replyShow;
    let timeObj;
    let confirm;
    input = input.split('please')
    console.log('received', input);

    switch(input) {
      case 'dont stop listening':
      case 'dont go to sleep':
      case 'i need you to stay awake':
      case 'set need acknowledge to false':
      case 'turn off need acknowledge':
      case 'turn need acknowledge off':
      case 'turn need acknowledge back off':
        await setAppState('needAcknowledge', false)
        break;

      default:
        replyShow = 'I\'m sorry but I didn\'t you. Could you please try again?';
        display('helios', replyShow)
        break;
    }
  }
}
