import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Text } from 'react-native';
import { AdMobRewarded } from 'react-native-admob';
import { toggleTab } from '../../../actions/appState';

class AdFree extends React.Component {

    componentDidMount() {
        AdMobRewarded.addEventListener('rewarded',
        (reward) => {
            if (reward.amount > 0) this.props.dispatch(toggleTab('adSeen')) 
        });
    }

    componentWillUnmount() {
        AdMobRewarded.removeAllListeners();
    }


    showRewarded() {
        // first - load ads and only then - show
        AdMobRewarded.setAdUnitID("ca-app-pub-9750102857494675/2772642425");
        AdMobRewarded.requestAd()
            .then(() => AdMobRewarded.showAd())
            .then((res) => console.log(res))
            .catch(err => console.error(err));
    }

    render() {
        return (
        <View style={styles.main}>
            <Text style={styles.header}>Go Ad Free!</Text>
            <View style={styles.descriptionContainer}>
                <Text style={styles.description}>Go ad free for <Text style={styles.bold}>two days</Text> by watching a single advertisement video!</Text>
                <Text style={styles.description}>Alternatively, there will be monthly subscriptions set up in a future version.</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={this.showRewarded}>
                <Text style={styles.buttonText}>Watch Ad</Text>
            </TouchableOpacity>
        </View>
        );
    }
}

const styles = {
    main: {
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, .5)',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        textAlign: 'center',
        fontSize: 32,
        color: globalStyles.fontColor,
        marginTop: '5%',
        marginBottom: '5%',
    },
    description: {
        color: globalStyles.fontColor,
        marginLeft: '5%',
        marginRight: '5%',
        marginTop: '5%',
    },
    bold: {
        fontWeight: 'bold',
        color: globalStyles.colors.five
    },
    button: {
        alignSelf: 'center',
        backgroundColor: globalStyles.buttonColor,
        width: '75%',
        padding: 10,
        marginTop: 20,
        marginBottom: 20,
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

export default connect(mapStateToProps)(AdFree);