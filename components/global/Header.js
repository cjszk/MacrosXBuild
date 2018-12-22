import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { incrementDate, decrementDate, selectDate } from '../../actions/appState';
import globalStyles from '../../globalStyles';
import DateTimePicker from 'react-native-modal-datetime-picker';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
    }
  }

  decrementDate() {
    this.props.dispatch(decrementDate());
  }

  incrementDate() {
    this.props.dispatch(incrementDate());
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
 
  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
 
  _handleDatePicked = (date) => {
    this.props.dispatch(selectDate(date))
    this._hideDateTimePicker();
  };
 
  render() {
    const { date, mode } = this.props;
    let renderDate = moment(date).format("ddd MMM DD, YYYY");
    if (moment(date).format("MMM DD, YYYY") == moment().format("MMM DD, YYYY")) renderDate = 'Today';
    if (moment(date).format("MMM DD, YYYY") == moment().subtract(1, 'days').format("MMM DD, YYYY")) renderDate = 'Yesterday';
    if (moment(date).format("MMM DD, YYYY") == moment().add(1, 'days').format("MMM DD, YYYY")) renderDate = 'Tomorrow';
    
    return (
      <View style={[styles.main, mode === 'macros' ? {backgroundColor: globalStyles.menuColor.macros} : {backgroundColor: globalStyles.menuColor.workouts}]}>
        <View style={styles.mainContainer}>
          <TouchableOpacity style={styles.button} onPress={() => this.decrementDate()}>
            <Icon
              name="chevron-left"
              type="fontawesome"
              size={60}
              color="#000"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._showDateTimePicker()}>
            <Text style={styles.dateText}>{renderDate}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.incrementDate()}>
            <Icon
              name="chevron-right"
              type="fontawesome"
              size={60}
              color="#000"
            />
          </TouchableOpacity>
        </View>
        <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
          />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  main: {
    display: 'flex',
    // height: '12%',
  },
  mainContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: '3.5%',
    alignContent: 'flex-end',
  },
  dateButton: {
    width: '70%',
    height: '100%',
    alignSelf: 'flex-end',
  }, 
  dateText: {
    fontSize: 32,
    textAlign: 'center',
    alignSelf: 'flex-end',
    marginTop: 20,
  },
  button: {
    alignSelf: 'flex-end',
  },  
  header: {
    color: globalStyles.color,
    fontSize: 32,
  }
});

const mapStateToProps = state => {
  return {
      quickAdd: state.appState.quickAdd,
      date: state.appState.date,
      mode: state.appState.mode,
  }
}

export default connect(mapStateToProps)(Header);