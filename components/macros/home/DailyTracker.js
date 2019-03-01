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
        const { dailyData, data } = this.props;
        if (data.adFree) console.log(moment(data.adFree).format('x'), moment().format('x'))
        let renderItems = dailyData.sort((a, b) => moment(a.date).format('x') - moment(b.date).format('x')).map((item, index) => <DailyTrackerItem item={item} key={index}/>);
        if (dailyData.length === 0) renderItems = this.renderEmpty();
        return (
            <View style={styles.main}>

                <ScrollView style={styles.scroll} ref={ref => this.scrollView = ref}
                onContentSizeChange={(contentWidth, contentHeight)=>{        
                    this.scrollView.scrollToEnd({animated: true});
                }}>
                    {renderItems}
                    {dailyData.length <= 1 ? <DailyTrackerItem key={'p1'} item={null}/> : null}
                    {dailyData.length ? <DailyTrackerItem key={'p2'} item={null}/> : null}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    main: {
        position: 'absolute',
        // height: '26.5%',
        bottom: '1%',
        width: '100%',
        height: '37.5%',
        // left: 0,
    },
    scroll: {
    
    },
    advertisement: {
        borderWidth: 0.5,
        borderColor: globalStyles.colors.four,
        backgroundColor: 'rgba(0, 0, 0, .5)',
        padding: '1%',
        height: 70,
        width: '100%',
        alignItems: 'center',
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
        backgroundColor: globalStyles.buttonColor,
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 18,
        color: globalStyles.buttonTextColor,

    },
});

const mapStateToProps = state => {
    return {
        quickAdd: state.appState.quickAdd,
        data: state.dataReducer.data,
    }
}

export default connect(mapStateToProps)(DailyTracker);