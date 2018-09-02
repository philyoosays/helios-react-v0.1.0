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
      console.log('this is running');
      this.processing(this.props.input);
    }
  }

  processing(input) {
    let replyShow;
    let timeObj;
    input = input.split('please')
    console.log('received', input);

    switch(input) {
      case:
        break;
      default:
        replyShow = 'I\'m sorry but I didn\'t you. Could you please try again?';
        this.props.display('helios', replyShow)
        break;
    }
  }
}
