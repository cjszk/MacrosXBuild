import React from 'react';
import { connect } from 'react-redux';
import { StackedAreaChart, Grid, YAxis, XAxis } from 'react-native-svg-charts'
import * as shape from 'd3-shape'
import moment from 'moment';
import { View, TouchableOpacity, Text } from 'react-native';
import { toggleTab } from '../../../actions/appState';
import globalStyles from '../../../globalStyles';

class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trackedItems: [],
            dateMin: moment().subtract(-30, 'days').format(),
            dateMax: moment().format(),
        }
    }

    filterDataByDate(data) {
        data.map(item => {
            
        });
    }

    render() {
        if (!this.props) return <Text>Loading...</Text>
        const data = this.props.data.tracking.map((item) => {
            Object.keys(item).forEach(key => {
                if (item[key] === 0) item[key] = null;
            })
            return item;
        });
        console.log(data);
        const colors = [ globalStyles.colors.five, globalStyles.colors.four, globalStyles.colors.three, globalStyles.colors.two ]
        const keys   = [ 'weight' ]
        const svgs = [
                    { onPress: () => console.log(keys[0]) },
                    { onPress: () => console.log(keys[1]) },
                ]
        const contentInset = { top: 20, bottom: 20 }
        return (
            <View style={styles.main}>
                <View style={styles.chartContainer}>
                    <StackedAreaChart
                        style={ styles.chart }
                        contentInset={ contentInset }
                        data={ data }
                        keys={ keys }
                        colors={ colors }
                        >
                        <Grid/>
                    </StackedAreaChart>
                    <YAxis
                        style={ styles.yAxis }
                        data={ StackedAreaChart.extractDataPoints(data, keys) }
                        contentInset={ contentInset }
                        svg={ {
                            fontSize: 8,
                            fill: 'white',
                            stroke: 'white',
                            strokeWidth: 0.1,
                            alignmentBaseline: 'baseline',
                            baselineShift: '3',
                        } }
                    />
                    <XAxis
                        style={styles.xAxis}
                        data={ data }
                        formatLabel={ (value, index) => {
                            if (index % (parseInt(data.length * 0.33)) === 0) return moment(data[index].date).format('MM/DD');
                            else return null;
                        } }
                        contentInset={{ left: 10, right: 10 }}
                        svg={{ fontSize: 10, fill: 'white' }}
                    />
                </View>
            </View>
        )
    }
}

const styles = {
    main: {
        backgroundColor: 'rgba(0, 0, 0, .5)',
        height: '100%',
    },
    chartContainer: {
        height: '60%',
        marginLeft: '5%',
        marginRight: '5%',
    },
    chart: {
        flex: 1,
        height: '100%',
    },
    yAxis: {
        height: '100%',
        position: 'absolute',
        left: '-5%',
    },
    xAxis: {
        marginHorizontal: -10,
        overflow: 'visible'
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