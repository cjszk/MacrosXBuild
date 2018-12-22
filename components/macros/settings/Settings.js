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
                    name: 'Goals',
                    tab: 'goals',
                    action: () => this.props.dispatch(toggleTab('goals')),
                },
                {
                    name: 'Tracking Settings',
                    tab: 'trackingSettings',
                    action: () => this.props.dispatch(toggleTab('trackingSettings')),
                },
                {
                    name: 'Go Ad-Free!',
                    tab: 'adFree',
                    action: () => this.props.dispatch(toggleTab('adFree')),
                },
            ]
        }
    }

    createButtons() {
        const { buttons } = this.state;
        return buttons.map((button) => (
            <TouchableOpacity key={button.tab} style={styles.button} onPress={() => button.action()}>
                <Text style={styles.buttonText}>{button.name}</Text>
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
        backgroundColor: globalStyles.colors.four,
        width: '75%',
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 32,
        textAlign: 'center',
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