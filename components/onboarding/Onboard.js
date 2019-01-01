import React from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, View, TouchableOpacity, Text, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { toggleTab } from '../../actions/appState';
import moment from 'moment';

import globalStyles from '../../globalStyles';
class OnboardGoals extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: 'By Macros',
        }
    }

    render() {
        return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAwareScrollView extraScrollHeight={100} style={styles.main}>
                <Text style={styles.header}>Welcome!</Text>
                <Text style={styles.description}>To get started please tell us:</Text>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => this.props.dispatch(toggleTab('onboardingGoals'))}>
                        <Text style={styles.buttonText}>I know my macros.</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => this.props.dispatch(toggleTab('onboardingHelp'))}>
                        <Text style={styles.buttonText}>I'm not sure, please make recommendations for me.</Text>
                    </TouchableOpacity>
                </View>
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
    header: {
        textAlign: 'center',
        fontSize: 32,
        color: globalStyles.fontColor,
        marginTop: '5%',
        marginBottom: '5%',
    },
    description: {
        textAlign: 'center',
        fontSize: 18,
        color: globalStyles.fontColor,
    },
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        marginTop: '10%',
        height: 300
    },
    button: {
        alignSelf: 'center',
        width: '75%',
        backgroundColor: globalStyles.buttonColor,
        padding: 20,
    },
    buttonText: {
        textAlign: 'center',
        color: globalStyles.buttonTextColor,
        fontSize: 18,
    }
}

const mapStateToProps = state => {
    return {
        tab: state.appState.tab,
        date: state.appState.date,
        data: state.dataReducer.data
    }
}

export default connect(mapStateToProps)(OnboardGoals);