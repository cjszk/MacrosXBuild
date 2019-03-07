import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Text } from 'react-native';
import { toggleTab } from '../../../actions/appState';
import globalStyles from '../../../globalStyles';

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttons: [
                {
                    name: 'Daily Goals',
                    tab: 'goals',
                    action: () => this.props.dispatch(toggleTab('goals')),
                },
                {
                    name: 'Tracking Settings',
                    tab: 'trackingSettings',
                    action: () => this.props.dispatch(toggleTab('trackingSettings')),
                },
                {
                    name: 'Tracking',
                    tab: 'tracking',
                    action: () => this.props.dispatch(toggleTab('tracking')),
                },
                {
                    name: 'Graphs',
                    tab: 'graphs',
                    action: () => this.props.dispatch(toggleTab('graphs')),
                },
                {
                    name: 'Developer Notes',
                    tab: 'devNotes',
                    action: () => this.props.dispatch(toggleTab('devNotes')),
                },
            ]
        }
    }

    createButtons() {
        const { buttons } = this.state;
        return buttons.map((button) => (
            <TouchableOpacity key={button.tab} style={button.tab === 'adFree' ? [styles.button, {backgroundColor: globalStyles.colors.four}] : styles.button} onPress={() => button.action()}>
                <Text style={button.tab === 'adFree' ? [styles.buttonText, {color: '#fff'}] : [styles.buttonText]}>{button.name}</Text>
            </TouchableOpacity>
        ));
    }

    render() {
        return (
        <View style={styles.main}>
            {this.createButtons()}
        </View>
        );
    }
}

const styles = {
    main: {
        display: 'flex',
        flexDireciton: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60%'
    },
    button: {
        backgroundColor: globalStyles.buttonColor,
        width: '75%',
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 32,
        textAlign: 'center',
        color: globalStyles.buttonTextColor,    
    }
}

const mapStateToProps = state => {
    return {
        tab: state.appState.tab,
        date: state.appState.date,
        data: state.dataReducer.data
    }
}

export default connect(mapStateToProps)(Settings);