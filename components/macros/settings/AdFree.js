import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Text } from 'react-native';

class AdFree extends React.Component {

    render() {
        return (
        <View style={styles.main}>
            <Text style={styles.header}>Go Ad Free!</Text>
            <View style={styles.descriptionContainer}>
                <Text style={styles.description}></Text>
            </View>
            <TouchableOpacity>
                <Text>Purchase now with Apple Pay!</Text>
            </TouchableOpacity>
        </View>
        );
    }
}

const styles = {
    main: {
        display: 'flex',
        flexDireciton: 'column',
        justifyContent: 'center',
    },
    header: {

    },
}

const mapStateToProps = state => {
    return {
        tab: state.appState.tab,
        date: state.appState.date,
        data: state.dataReducer.data
    }
}

export default connect(mapStateToProps)(AdFree);