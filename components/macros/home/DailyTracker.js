import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import DailyTrackerItem from './DailyTrackerItem';
import moment from 'moment';
import globalStyles from '../../../globalStyles';
import { toggleTab } from '../../../actions/appState';

class DailyTracker extends React.Component {

    renderEmpty() {
        return (
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={() => this.props.dispatch(toggleTab('library'))}>
                    <Text style={styles.buttonText}>Add Food</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => this.props.dispatch(toggleTab('quickAdd'))}>
                    <Text style={styles.buttonText}>Quick Add</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const { dailyData } = this.props;
        let renderItems = dailyData.sort((a, b) => moment(a.date).format('x') - moment(b.date).format('x')).map((item, index) => <DailyTrackerItem item={item} key={index}/>);
        if (dailyData.length === 0) renderItems = this.renderEmpty();
        return (
            <View>
                <ScrollView style={styles.main} ref={ref => this.scrollView = ref}
                onContentSizeChange={(contentWidth, contentHeight)=>{        
                    this.scrollView.scrollToEnd({animated: true});
                }}>
                    {renderItems}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    main: {
        // position: 'absolute',
        height: '26.5%',
        // bottom: '20%',
        // left: 0,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    }, 
    button: {
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 20,
        fontSize: 18,
        backgroundColor: globalStyles.colors.five,
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 18,
        color: globalStyles.colors.three,

    },
});

const mapStateToProps = state => {
    return {
        quickAdd: state.appState.quickAdd,
    }
}

export default connect(mapStateToProps)(DailyTracker);