import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Text } from 'react-native';
import moment from 'moment';

class Graph extends React.Component {

    render() {
        return (
        <View style={styles.main}>
            <Text>Graph</Text>
        </View>
        );
    }
}

const styles = {
    main: {
    }
}

const mapStateToProps = state => {
    return {
        tab: state.appState.tab,
        date: state.appState.date,
        data: state.dataReducer.data
    }
}

export default connect(mapStateToProps)(Graph);