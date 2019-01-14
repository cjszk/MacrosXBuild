import React from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, View, TouchableOpacity, Text } from 'react-native';
import { AdMobRewarded } from 'react-native-admob';
import { toggleTab } from '../../../actions/appState';

class RenewAdFree extends React.Component {

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

    setFalseAdFree = async () => {
        const { data } = this.props;
        let newData = data;
        newData.adFree = false;
        try {
            await AsyncStorage.setItem('data', JSON.stringify(newData)).then(() => {
                this.props.dispatch(toggleTab('home'));
            });
          } catch (error) {
            console.error(error);
          }
    }

    render() {
        return (
        <View style={styles.main}>
            <Text style={[styles.text, {marginTop: '10%'}]}>Looks like your ad-free time has run out!</Text>
            <Text style={styles.text}>You may watch another video advertisement to renew your time.</Text>
            <View style={styles.buttonView}>
                <TouchableOpacity style={styles.button} onPress={this.showRewarded}>
                    <Text style={styles.buttonText}>Watch Ad</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSecondary} onPress={this.setFalseAdFree}>
                    <Text style={styles.buttonText}>Later</Text>
                </TouchableOpacity>
            </View>
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
    text: {
        marginLeft: '5%',
        marginRight: '5%',
        marginTop: '5%',
        fontSize: 18,
        color: globalStyles.fontColor
    },
    buttonView: {
        marginTop: '20%',
    },
    button: {
        alignSelf: 'center',
        backgroundColor: globalStyles.buttonColor,
        width: '75%',
        padding: 10,
        marginTop: 20,
        marginBottom: 20,
    },
    buttonSecondary: {
        alignSelf: 'center',
        backgroundColor: globalStyles.colors.four,
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

export default connect(mapStateToProps)(RenewAdFree);