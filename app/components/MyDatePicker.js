import React, { Component } from 'react';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

export default class MyDatePicker extends Component {
  constructor(props){
    super(props);
  }


  render(){
    return (
      <DatePicker
        style={{width: 200}}
        date={this.props.time}
        mode="datetime"
        placeholder="select date and time"
        format="YYYY/MM/DD, HH:mm"    //LLLL or llll
        minDate={moment().format('YYYY-MM-DD')}
        maxDate={moment().add(1, 'years').format('YYYY-MM-DD')}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36
          }
        }}
        //call prop function to change the state in AddSessionScreen    
        onDateChange={(date) => this.props.changeTime(date)}
      />
    )
  }
}