import React from 'react';
import { connect } from 'react-redux';
import { StackedAreaChart, Grid, YAxis, XAxis } from 'react-native-svg-charts'
import * as shape from 'd3-shape'
import moment from 'moment';
import { Picker, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { toggleTab } from '../../../actions/appState';
import globalStyles from '../../../globalStyles';
import DateTimePicker from 'react-native-modal-datetime-picker';

class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateTarget: null,
            dateMin: moment().subtract(30, 'days').format(),
            dateMax: moment().format(),
            isDateTimePickerVisibleMin: false,
            isDateTimePickerVisibleMax: false,
            trackedItem: 'weight',
        }
    }

    filterDataByDate(data) {
        const { dateMin, dateMax } = this.state;
        return data.filter(item => {
            if (moment(item.date).diff(dateMin, 'days') >= 0 && moment(item.date).diff(dateMax, 'days') <= 0) return item;
        });
    }

    _showDateTimePickerMin = () => this.setState({ isDateTimePickerVisibleMin: true });

    _showDateTimePickerMax = () => this.setState({ isDateTimePickerVisibleMax: true });
 
    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisibleMin: false, isDateTimePickerVisibleMax: false });

    _handleDatePicked = (date) => {
        const { dateTarget, dateMin, dateMax } = this.state;
        if (dateTarget === 'min') {
            if (moment(date).format('x') >= moment(dateMax).format('x')) this.setState({dateMin: moment(date).format(), dateMax: moment(date).add(1, 'days').format(), dateTarget: null});
            else this.setState({dateMin: moment(date).format(), dateTarget: null})
        }
        if (dateTarget === 'max') {
            if (moment(date).format('x') <= moment(dateMin).format('x')) this.setState({dateMin: moment(date).subtract(1, 'days').format(), dateMax: moment(date).format(), dateTarget: null});
            else this.setState({dateMax: moment(date).format(), dateTarget: null});
        }
        this._hideDateTimePicker();
    };

    calculateAverageChange(data) {
        const { trackedItem } = this.state;
        let label;
        console.log(data)

        if (this.props.data.settings.trackingSettings.trackByKg && trackedItem === 'weight') label = 'kg';
        else if (trackedItem === 'weight') label = 'lbs';
        return data.map(item => item[trackedItem]).reduce((a, b) => {
            return a+ b
        }) / data.length;
    }

    renderData(data) {
        const { trackedItem } = this.state;
        let label;
        if (this.props.data.settings.trackingSettings.trackByKg && trackedItem === 'weight') label = 'kg';
        else if (trackedItem === 'weight') label = 'lbs';
        else if (trackedItem === 'calories') label = 'kcal';
        if (trackedItem === 'macros') {
            if (!data[0].protein && !data[0].fat && !data[0].carbs) return null;
            return data.map((item) => 
                <View key={item.date} style={styles.singleDataContainer}>
                    <Text style={styles.dataDate}>{item.date}</Text>
                    <View style={styles.dataMacros}>
                        <Text style={[styles.dataValue, {fontSize: 14, color: globalStyles.fatColor}]}>{parseInt(item.fat/9)}g/</Text>
                        <Text style={[styles.dataValue, {fontSize: 14, color: globalStyles.proteinColor}]}>{parseInt(item.protein/4)}g/</Text>
                        <Text style={[styles.dataValue, {fontSize: 14, color: globalStyles.carbColor}]}>{parseInt(item.carbs/4)}g</Text>
                    </View>
                </View>
            );
        }
        return data.map((item) => (
            <View key={item.date} style={styles.singleDataContainer}>
                <Text style={styles.dataDate}>{item.date}</Text>
                <Text style={styles.dataValue}>{parseInt(item[trackedItem]*10)/10} {label}</Text>
            </View>
        ))
    }
   
    render() {
        if (!this.props) return <Text>Loading...</Text>
        const { dateMin, dateMax, trackedItem } = this.state;
        const { data } = this.props;

        let graphData = this.filterDataByDate(data.tracking).map((item) => {
            Object.keys(item).forEach(key => {
                if (item[key] === 0) item[key] = null;
            });
            return item;
        });
        if (trackedItem === 'calories' || trackedItem === 'macros') {
            graphData = this.filterDataByDate(data.entries).map((item, i) => {
                return {
                    fat: item.fat,
                    protein: item.protein,
                    carbs: item.carbs,
                    calories: item.calories,
                    date: moment(item.date).format('MM-DD-YYYY'),
                    key: i
                };
            }).sort((a, b) => moment(a.date).format('x') - moment(b.date).format('x'));
            let newData = {};
            for (let i=0; i<graphData.length; i++) {
                if (!Object.keys(newData).includes([graphData[i].date])) {
                    newData[graphData[i].date] = {
                        key: i,
                        date: graphData[i].date,
                        carbs: 0,
                        protein: 0,
                        fat: 0,
                        calories: 0,
                    }
                }
                newData[graphData[i].date].fat = newData[graphData[i].date].fat + graphData[i].fat*9;
                newData[graphData[i].date].protein = newData[graphData[i].date].protein + graphData[i].protein*4;
                newData[graphData[i].date].carbs = newData[graphData[i].date].carbs + graphData[i].carbs*4;
                newData[graphData[i].date].calories = newData[graphData[i].date].calories + graphData[i].fat*9 + graphData[i].protein*4 + graphData[i].carbs*4;
            }
            graphData = [];
            Object.keys(newData).forEach((item) => {
                graphData.push(newData[item]);
            })
        }

        let colors = [ 'rgba(125,255,125,.3)' ];
        const svgs = [
                    { onPress: () => console.log(trackedItem) },
                    { onPress: () => console.log(trackedItem) },
                    { onPress: () => console.log(trackedItem) },
                ];
        const contentInset = { top: 20, bottom: 20 }
        let trackedItemData = [trackedItem];
        if (trackedItem === 'macros') {
            trackedItemData = ['fat', 'protein', 'carbs'];
            colors = [ 'rgba(237,245,97,.3)', 'rgba(60,171,101,.3)', 'rgba(37,136,171,.3)' ]
        }
        if (trackedItem === 'calories') {
            trackedItemData = ['calories']
        }
        if (!graphData.length) graphData = [{
            weight: null,
            fat: null,
            protein: null,
            carbs: null,
            calories: null,
            date: null,
        }];
        return (
            <View style={styles.main}>
                <DateTimePicker
                    // Min
                    date={new Date(dateMin)}
                    isVisible={this.state.isDateTimePickerVisibleMin}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />
                <DateTimePicker
                    // Max
                    date={new Date(dateMax)}
                    isVisible={this.state.isDateTimePickerVisibleMax}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />
                <View style={styles.chartContainer}>
                    <StackedAreaChart
                        style={ styles.chart }
                        contentInset={ contentInset }
                        data={ graphData }
                        keys={ trackedItemData }
                        colors={ colors }
                        curve={ shape.curveNatural }
                        >
                        <Grid/>
                    </StackedAreaChart>
                    <YAxis
                        style={ styles.yAxis }
                        data={ StackedAreaChart.extractDataPoints(graphData, trackedItemData) }
                        contentInset={ contentInset }
                        svg={ {
                            fontSize: 10,
                            fill: 'white',
                            stroke: 'white',
                            strokeWidth: 0.1,
                            alignmentBaseline: 'baseline',
                            baselineShift: '3',
                        } }
                    />
                    <XAxis
                        style={styles.xAxis}
                        data={ graphData }
                        formatLabel={ (value, index) => {
                            if (index % (parseInt(data.length * 0.33)) === 0 || index === data.length - 1) return moment(data[index].date).format('MM/DD');
                            else return null;
                        } }
                        contentInset={{ left: 10, right: 10 }}
                        svg={{ fontSize: 10, fill: 'white' }}
                    />
                </View>
                <View style={styles.datesContainer}>
                    <View style={styles.singleDateContainer}>
                        <Text style={styles.dateLabel}>From:</Text>
                        <TouchableOpacity style={styles.dateInput} onPress={() => {
                            this.setState({dateTarget: 'min'})
                            this._showDateTimePickerMin();
                        }}>
                            <Text style={styles.dateInputText}> {moment(dateMin).format('MM-DD-YYYY')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.singleDateContainer}>
                        <Text style={styles.dateLabel}>To:</Text>
                        <TouchableOpacity style={styles.dateInput} onPress={() => {
                            this.setState({dateTarget: 'max'})
                            this._showDateTimePickerMax();
                        }}>
                            <Text style={styles.dateInputText}> {moment(dateMax).format('MM-DD-YYYY')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.dataContainer}>
                    <ScrollView horizontal={true}>
                        {this.renderData(graphData)}
                    </ScrollView>
                </View>
                <Picker itemStyle={[styles.picker,{color: globalStyles.fontColor}]} selectedValue={trackedItem} 
                    onValueChange={(itemValue, nutrientIndex) => {
                        this.setState({trackedItem: itemValue})}
                    }>
                    <Picker.Item key="weight" label="weight" value="weight"/>
                    <Picker.Item key="calories" label="calories" value="calories"/>
                    <Picker.Item key="macros" label="macros" value="macros"/>
                </Picker>
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
        height: '40%',
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
        marginHorizontal: 0
    },
    datesContainer: {
        marginTop: '2%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    singleDateContainer: {
        flexDirection: 'row',
    },
    dateLabel: {
        color: globalStyles.fontColor,
        fontSize: 18,
        padding: 5
    },
    dateInput: {
        borderBottomColor: globalStyles.colors.four,
        borderBottomWidth: 2,
        padding: 5
    },
    dateInputText: {
        color: globalStyles.fontColor,
        fontSize: 18,
    },
    dataContainer: {
        backgroundColor: 'rgba(0, 0, 0, .5)',
        marginTop: '2%',
        height: '12.5%',
        flexDirection: 'row',
    },
    singleDataContainer: {
        marginLeft: 10,
        marginRight: 10,
        alignSelf: 'center',
    },
    dataDate: {
        color: globalStyles.fontColor,
        fontSize: 14,
        textAlign: 'center',
    },
    dataMacros: {
        flexDirection: 'row'
    },
    dataValue: {
        color: globalStyles.colors.five,
        fontSize: 18,
        textAlign: 'center',
    },
    picker: {
        marginTop: '-5%',
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