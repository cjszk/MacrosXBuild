import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import MacrosHome from './macros/home/Home';
import WorkoutsHome from './workouts/home/Home';
import Onboard from './Onboard';

class HomeSwitch extends React.Component {


    render() {
        const { mode, data } = this.props;
        if (!data) return <View><Onboard/></View>;
        let home = <MacrosHome/>;
        if (mode === 'workouts') home = <WorkoutsHome/>
        return (
            <View>
                {home}
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        tab: state.appState.tab,
        date: state.appState.date,
        data: state.dataReducer.data,
        mode: state.appState.mode,
    }
}

export default connect(mapStateToProps)(HomeSwitch);