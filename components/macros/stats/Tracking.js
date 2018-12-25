import React from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, View, TouchableOpacity, Text, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import { toggleTab } from '../../../actions/appState';

class Tracking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: this.props.date,
            weight: 0,
            chest: 0,
            arms: 0,
            waistAbove: 0,
            waist: 0,
            waistBelow: 0,
            hips: 0,
            legs: 0,
        }
    }

    componentDidMount() {
        this.setState({selectedDate: this.props.date});
        this.getCurrentDayData();
    }

    componentDidUpdate() {
        if (this.props.date !== this.state.selectedDate) {
            this.setState({selectedDate: this.props.date});
            this.getCurrentDayData();
        }
    }

    getCurrentDayData() {
        const { data, date } = this.props;
        let pounds = true;
        if (data.settings.trackingSettings.trackByKg) pounds = false;
        // Get data for the day if it exists.
        if (data) {
            if (data.tracking) {
                const item = data.tracking.find((item) => item.date === moment(date).format('MM-DD-YYYY'));
                if (item) {
                    let items = {
                        weight: item.weight,
                        chest: item.chest,
                        arms: item.arms,
                        waistAbove: item.waistAbove,
                        waist: item.waist,
                        waistBelow: item.waistBelow,
                        hips: item.hips,
                        legs: item.legs,
                    }
                    // convert to pounds & inches
                    if (pounds && item.measurement === 'kilograms') {
                        items = {
                            weight: item.weight * 2.2,
                            chest: item.chest / 2.54,
                            arms: item.arms / 2.54,
                            waistAbove: item.waistAbove / 2.54,
                            waist: item.waist / 2.54,
                            waistBelow: item.waistBelow / 2.54,
                            hips: item.hips / 2.54,
                            legs: item.legs / 2.54,
                        }
                    }
                    // convert to kilograms & centimeters
                    else if (!pounds && item.measurement === 'pounds') {
                        items = {
                            weight: item.weight / 2.2,
                            chest: item.chest * 2.54,
                            arms: item.arms * 2.54,
                            waistAbove: item.waistAbove * 2.54,
                            waist: item.waist * 2.54,
                            waistBelow: item.waistBelow * 2.54,
                            hips: item.hips * 2.54,
                            legs: item.legs * 2.54,
                        }
                    }
                    this.setState(items);
                }
                else {
                    this.setState({
                        weight: 0,
                        chest: 0,
                        arms: 0,
                        waistAbove: 0,
                        waist: 0,
                        waistBelow: 0,
                        hips: 0,
                        legs: 0,
                    });
                } 
            }

        }
    }

    handleSubmit = async () => {
        const { weight, chest, arms, waistAbove, waist, waistBelow, hips, legs } = this.state;
        const { data, date } = this.props;
        let measurement = 'pounds';
        if (data.settings.trackingSettings.trackByKg) measurement = 'kilograms';
        let newData = data;
        const newEntry = {
            date: moment(date).format('MM-DD-YYYY'),
            weight,
            chest,
            arms,
            waistAbove,
            waist,
            waistBelow,
            hips,
            legs,
            measurement,
        }
        if (!Object.keys(newData).includes('tracking')) newData.tracking = [];
        
        if (!newData.tracking.find(item => item.date === moment(date).format('MM-DD-YYYY'))) {
            newData.tracking.push(newEntry);
        } 
        else {
            newData.tracking = newData.tracking.map((item) => {
                if (item.date === moment(date).format('MM-DD-YYYY')) return newEntry;
                return item;
            }) 
        }
        try {
          await AsyncStorage.setItem('data', JSON.stringify(newData));
          this.props.dispatch(toggleTab('stats'))
        } catch (error) {
          console.error(error);
        }
    }

    renderItem(desc, key) {
        const value = this.state[key];
        return (
            <View style={styles.itemContainer}>
                <Text style={styles.label}>{desc}</Text>
                <TextInput
                    autoFocus={true}
                    value={parseInt(value) ? String(parseInt(value)) : '0'}
                    maxLength={4}
                    keyboardType='numeric'
                    style={styles.textInput}
                    onChangeText={(e) => this.setState({[key]: parseInt(e*10)/10})}
                />
            </View>
        );
    }

    renderExtra() {
        return (
            <View style={styles.fullItemsContainer}>
                {this.renderItem('Weight', 'weight')}
                {this.renderItem('Chest', 'chest')}
                {this.renderItem('Arms', 'arms')}
                {this.renderItem('Waist Above', 'waistAbove')}
                {this.renderItem('Waist', 'waist')}
                {this.renderItem('Waist Below', 'waistBelow')}
                {this.renderItem('Hips', 'hips')}
                {this.renderItem('Legs', 'legs')}
            </View>
        );
    }

    renderBasic() {
        return (
            <View style={styles.fullItemsContainer}>
                {this.renderItem('Weight', 'weight')}
                {this.renderItem('Waist', 'waist')}
            </View>
        );
    }

    render() {
        const { data, date } = this.props;
        let measurement = 'lbs / in.';
        if (data.settings.trackingSettings.trackByKg) measurement = 'kg / cm';
        return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAwareScrollView extraScrollHeight={100} style={styles.main}>
                <Text style={styles.note}>Tracking by: {measurement}</Text>
                <Text style={styles.note}>Note: All fields are optional</Text>
                {data.settings.trackingSettings.trackAllBody ? this.renderExtra() : this.renderBasic()}
                <TouchableOpacity style={styles.submit} onPress={() => this.handleSubmit()}>
                    <Text style={styles.submitText}>Save Entries</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
        );
    }
}

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, .5)',
    },
    note: {
        fontSize: 18, 
        color: globalStyles.fontColor, 
        textAlign: 'center',
        marginTop: '5%',
    },
    fullItemsContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginTop: '5%',
    },
    itemContainer: {
        marginTop: '2%',
        width: '30%',

    },
    label: {
        fontSize: 18,
        textAlign: 'center',
        color: globalStyles.fontColor,
        height: 30,
    },
    textInput: {
        borderBottomColor: globalStyles.colors.four,
        borderBottomWidth: 2,
        fontSize: 24,
        color: globalStyles.fontColor,
        textAlign: 'center',
        width: '50%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    submit: {
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 15,
        marginTop: '20%',
        width: '50%',
        backgroundColor: globalStyles.buttonColor
        
    },
    submitText: {
        textAlign: 'center',
        color: globalStyles.buttonTextColor,
        fontSize: 18
    }
}

const mapStateToProps = state => {
    return {
        tab: state.appState.tab,
        date: state.appState.date,
        data: state.dataReducer.data,
    }
}

export default connect(mapStateToProps)(Tracking);