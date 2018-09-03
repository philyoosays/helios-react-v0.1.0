

module.exports = {
  currentTime() {
    let dateShow = new Date();
    let dateSay = new Date();
    let timeShow = dateShow.toLocaleTimeString('en-US');
    let timeSay = dateSay.toLocaleTimeString().split(' ')

    timeSay[0] = timeSay[0].slice(0, -3)
    timeSay = timeSay.join(':').split(':')

    let toSay = [];
    toSay.push(timeSay[0]);
    if(timeSay[1].search('0') === 0 && timeSay[1] !== '00') {
      toSay.push('oh');
      toSay.push(timeSay[1][1]);
    } else if(timeSay[1].search('0') !== 0) {
      toSay.push(timeSay[1])
    }
    toSay.push(timeSay[2])
    timeSay = toSay.join(' ')
    let obj = { timeShow, timeSay };
    return obj;
  },

  getTomorrow() {
    let date = new Date();
    let day;
    if(date.getDay() === 6) {
      day = 0;
    } else {
      day++;
    }
    return new Date(date.getFullYear(), date.getMonth(), day)
  },

  getTodayDay() {
    let day = new Date();
    const week = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
    return week[day.getDay()]
  },

  timerGivenNone() {

  }
}
