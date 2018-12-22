import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Text } from 'react-native';
import { toggleTab } from '../../../actions/appState';

class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttons: [
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

export default connect(mapStateToProps)(Stats);