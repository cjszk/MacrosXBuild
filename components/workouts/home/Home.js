import React from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import moment from 'moment';

class Home extends React.Component {

    getCurrentDayData() {
        let results = [];
        if (Object.keys(this.props.data).length) {
          results = this.props.data.entries.filter((item) => {
            if (moment(this.props.date).format('MM-DD-YYYY') === moment(item.date).format('MM-DD-YYYY')) {
              return item; 
            }
          })
        }
        return results;
    }

    handleTabWorkouts() {
        // if (this.props.tab === 'quickAdd') return <View style={styles.main}><QuickAdd/></View>;
        return (
        <View style={styles.main}>
            <Text>Test</Text>
        </View>
        )
    }

    render() {
        if (this.props.tab !== 'home') return this.handleTabWorkouts();
        const dailyData = this.getCurrentDayData();
        return (
        <View style={styles.main}>
            <Text>Test</Text>
        </View>
        );
    }
}

const styles = {
    main: {
        height: '78%',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column'
    }
}

const mapStateToProps = state => {
    return {
        tab: state.appState.tab,
        date: state.appState.date,
        data: state.dataReducer.data,
    }
}

export default connect(mapStateToProps)(Home);