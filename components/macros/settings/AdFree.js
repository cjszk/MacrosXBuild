import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Text } from 'react-native';

class AdFree extends React.Component {

    render() {
        return (
        <View style={styles.main}>
            <Text>Test</Text>
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
}

const mapStateToProps = state => {
    return {
        tab: state.appState.tab,
        date: state.appState.date,
        data: state.dataReducer.data
    }
}

export default connect(mapStateToProps)(AdFree);