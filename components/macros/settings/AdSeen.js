import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Text, AsyncStorage } from 'react-native';
import { toggleTab } from '../../../actions/appState';
import moment from 'moment';

class AdSeen extends React.Component {

    componentDidMount() {
        this.setAdFree();
    }

    setAdFree = async () => {
        const { data } = this.props;
        let newData = data;
        newData.adFree = moment().add(2, 'days').format();
        try {
            await AsyncStorage.setItem('data', JSON.stringify(newData));
          } catch (error) {
            console.error(error);
          }
    }

    render() {
        return (
        <View style={styles.main}>
            <Text style={styles.header}>Thank You!</Text>
            <View style={styles.descriptionContainer}>
                <Text style={styles.description}>Enjoy being free of advertisements until <Text style={styles.bold}>{moment().add(2, 'days').format('MM/DD/YYYY, h:mm a')}</Text>!</Text>
            </View>
            <TouchableOpacity style={styles.button}
                onPress={() => this.props.dispatch(toggleTab('home'))}
            >
                <Text style={styles.buttonText}>Home</Text>
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
        marginTop: '15%',
        marginBottom: '10%',
    },
    description: {
        color: globalStyles.fontColor,
        marginLeft: '10%',
        marginRight: '10%',
        marginTop: '5%',
        marginBottom: '20%',
        textAlign: 'center',
        fontSize: 18,
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

export default connect(mapStateToProps)(AdSeen);