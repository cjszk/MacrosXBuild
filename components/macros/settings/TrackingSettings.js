import React from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, View, TouchableOpacity, Text } from 'react-native';
import globalStyles from '../../../globalStyles';

class TrackingSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshed: false,
        }
    }

    changeTrackingSettings = async (key, status) => {
        const { data } = this.props;
        try {
            let newData = data;
            newData.settings.trackingSettings[key] = status;
            let newTracking = data.tracking.map(item => {
                if (status && item.measurement === 'pounds') {
                    return {
                        arms: (item.arms * 2.54),
                        chest: (item.chest * 2.54),
                        hips: (item.hips * 2.54),
                        legs: (item.legs * 2.54),
                        waist: (item.waist * 2.54),
                        waistAbove: (item.waistAbove * 2.54),
                        waistBelow: (item.waistBelow * 2.54),
                        weight: (item.weight / 2.2),
                        date: item.date,
                        measurement: 'kilograms'
                    }
                }
                else if (!status && item.measurement === 'kilograms') {
                    return {
                        arms: (item.arms / 2.54),
                        chest: (item.chest / 2.54),
                        hips: (item.hips / 2.54),
                        legs: (item.legs / 2.54),
                        waist: (item.waist / 2.54),
                        waistAbove: (item.waistAbove / 2.54),
                        waistBelow: (item.waistBelow / 2.54),
                        weight: (item.weight * 2.2),
                        date: item.date,
                        measurement: 'pounds'
                    }
                }
                return item;
            });
            newData.tracking = newTracking;
            await AsyncStorage.setItem('data', JSON.stringify(newData));
        } catch (error) {
          console.error(error);
        }
    }

    renderOption(desc, key) {
        const { trackingSettings } = this.props.data.settings;
        let status = false;
        if (trackingSettings[key]) status = true;
        return (
        <View style={[styles.optionContainer, status ? {backgroundColor: globalStyles.colors.five} : {backgroundColor: 'rgba(0,0,0,.3)'}]}>
            <TouchableOpacity style={styles.optionButton} onPress={() => {
                this.changeTrackingSettings(key, !status)
                this.setState({refreshed: true})
            }}>
                <Text style={styles.optionDesc}>{desc}</Text>
                <Text style={styles.optionStatus}>{status ? 'on' : 'off'}</Text>
            </TouchableOpacity>
        </View>
        )
    }

    renderKg() {
        const { trackingSettings } = this.props.data.settings;
        let kilograms = false;
        if (trackingSettings.trackByKg) kilograms = true;
        return (
            <View style={[styles.optionContainer, kilograms ? {backgroundColor: globalStyles.colors.four} : {backgroundColor: globalStyles.colors.four}]}>
                <TouchableOpacity style={styles.optionButton} onPress={() => {
                    this.changeTrackingSettings('trackByKg', !kilograms)
                    this.setState({refreshed: true})
                }}>
                    <Text style={styles.optionDesc}>Track By: </Text>
                    <Text style={styles.optionStatus}>{kilograms ? 'kg / cm' : 'lbs / in'}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        return (
        <View style={styles.main}>
            {this.renderKg()}
            {this.renderOption('Track Fiber', 'trackFiber')}
            {this.renderOption('Track Sugar', 'trackSugar')}
            {this.renderOption('Track All Body Measurements', 'trackAllBody')}
        </View>
        );
    }
}

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, .5)',
    },
    optionContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '75%',
        height: '10%',
        marginTop: '2.5%',
        marginBottom: '2.5%',
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: globalStyles.color,
    },
    optionButton: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
        paddingRight: '5%',
        paddingLeft: '5%',
    },
    optionDesc: {
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 18,
        color: globalStyles.fontColor,
        width: '60%'
    },
    optionStatus: {
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 18,
        color: globalStyles.fontColor,
        width: '30%',
    }
}

const mapStateToProps = state => {
    return {
        tab: state.appState.tab,
        date: state.appState.date,
        data: state.dataReducer.data
    }
}

export default connect(mapStateToProps)(TrackingSettings);