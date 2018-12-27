import React from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import moment from 'moment';
import MainTracker from './MainTracker';
import QuickAdd from '../forms/QuickAdd';
import AddUsdaItem from '../forms/AddUsdaItem';
import DailyTracker from './DailyTracker';
import Library from '../library/Library';
import NewItem from '../forms/NewItem';
import AddItem from '../forms/AddItem';
import EditTrackedItem from '../forms/EditTrackedItem';
import EditItem from '../forms/EditItem';
import Settings from '../settings/Settings';
import Stats from '../stats/Stats';
import Goals from '../settings/Goals';
import AdFree from '../settings/AdFree';
import { setNewDay } from '../../../actions/appState';
import TrackingSettings from '../settings/TrackingSettings';
import Tracking from '../stats/Tracking';
import Graph from '../stats/Graph';

class Home extends React.Component {

    getCurrentDayData() {
        let results = [];
        if (Object.keys(this.props.data).includes('entries')) {
          results = this.props.data.entries.filter((item) => {
            if (moment(this.props.date).format('MM-DD-YYYY') === moment(item.date).format('MM-DD-YYYY')) {
              return item; 
            }
          })
        }
        return results;
    }

    componentDidUpdate() {
        this.handleNewDay();
    }

    handleNewDay() {
        const { currentDate } = this.props;
        if (moment(currentDate).add(1, 'days').format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) this.props.dispatch(setNewDay());        
    }

    handleTabMacros() {
        switch(this.props.tab) {
            case 'quickAdd': return <View style={styles.main}><QuickAdd/></View>;
            case 'library': return <View style={styles.main}><Library/></View>;
            case 'newItem': return <View style={styles.main}><NewItem/></View>;
            case 'addItem': return <View style={styles.main}><AddItem/></View>;
            case 'addUsdaItem': return <View style={styles.main}><AddUsdaItem/></View>;
            case 'editTrackedItem': return <View style={styles.main}><EditTrackedItem/></View>;
            case 'editItem': return <View style={styles.main}><EditItem/></View>;
            case 'settings': return <View style={styles.main}><Settings/></View>;
            case 'stats': return <View style={styles.main}><Stats/></View>;
            case 'goals': return <View style={styles.main}><Goals/></View>;
            case 'adFree': return <View style={styles.main}><AdFree/></View>;
            case 'trackingSettings': return <View style={styles.main}><TrackingSettings/></View>;
            case 'tracking': return <View style={styles.main}><Tracking/></View>;
            case 'graphs': return <View style={styles.main}><Graph/></View>;
          }
    }

    render() {
        if (this.props.tab !== 'home') return this.handleTabMacros();
        const dailyData = this.getCurrentDayData();
        console.log(this.props.data)
        return (
        <View style={styles.main}>
            <MainTracker dailyData={dailyData}/>
            <DailyTracker dailyData={dailyData}/>
        </View>
        );
    }
}

const styles = {
    main: {
        height: '100%',
        justifyContent: 'flex-start',
    }
}

const mapStateToProps = state => {
    return {
        tab: state.appState.tab,
        date: state.appState.date,
        data: state.dataReducer.data,
        currentDate: state.appState.currentDate,
    }
}

export default connect(mapStateToProps)(Home);