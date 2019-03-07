import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import MacrosHome from './macros/home/Home';
import WorkoutsHome from './workouts/home/Home';
import Onboard from './onboarding/Onboard';
import OnboardGoals from './onboarding/OnboardGoals';
import OnboardingHelp from './onboarding/OnboardingHelp';
import Camera from './macros/scan/Camera';

class HomeSwitch extends React.Component {


    render() {
        const { mode, data, tab } = this.props;
        if (tab === 'onboardingGoals') return <View><OnboardGoals/></View>
        if (tab === 'onboardingHelp') return <View><OnboardingHelp/></View>
        if (tab === 'scan') return <Camera/>;
        if (!data || !data.settings) return <View><Onboard/></View>;
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