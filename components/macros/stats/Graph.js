import React from 'react';
import { connect } from 'react-redux';
import { StackedAreaChart, AreaChart, Grid, YAxis, XAxis } from 'react-native-svg-charts'
import { Circle, Path } from 'react-native-svg'
import * as shape from 'd3-shape'
import moment from 'moment';
import { Picker, View, TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native';
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
            trackIndex: 0
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
        if (this.props.data.settings.trackingSettings.trackByKg && trackedItem === 'weight') label = 'kg';
        else if (trackedItem === 'weight') label = 'lbs';
        return data.map(item => item[trackedItem]).reduce((a, b) => {
            return a+ b
        }) / data.length;
    }

    renderData(data) {
        const { trackedItem, trackIndex } = this.state;
        let label;
        if (this.props.data.settings.trackingSettings.trackByKg && trackedItem !== 'calories') label = 'kg';
        else if (trackedItem !== 'calories') label = 'lbs';
        else label = 'kcal';
        let selectedStyles = trackedItem !== 'calories vs. weight' ? { backgroundColor: 'rgba(255,255,255,.3)'} : null;
        if (trackedItem === 'macros') {
            if (!data[0].protein && !data[0].fat && !data[0].carbs) return null;
            return data.map((item, index) => 
                <TouchableOpacity onPress={() => this.setState({trackIndex: index})} key={item.date} style={trackIndex === index ? [styles.singleDataContainer, selectedStyles] : styles.singleDataContainer}>
                    <Text style={styles.dataDate}>{item.date}</Text>
                    <View style={styles.dataMacros}>
                        <Text style={[styles.dataValue, {fontSize: 14, color: globalStyles.fatColor}]}>{parseInt(item.fat/9)}g/</Text>
                        <Text style={[styles.dataValue, {fontSize: 14, color: globalStyles.proteinColor}]}>{parseInt(item.protein/4)}g/</Text>
                        <Text style={[styles.dataValue, {fontSize: 14, color: globalStyles.carbColor}]}>{parseInt(item.carbs/4)}g</Text>
                    </View>
                </TouchableOpacity>
            );
        }
        const key = trackedItem === 'calories vs. weight' ? 'weight' : trackedItem;
        console.log(key);
        return data.map((item, index) => (
            <TouchableOpacity onPress={() => {
                if (trackedItem !== 'calories vs. weight') this.setState({trackIndex: index})
            }} key={item.date} style={trackIndex === index ? [styles.singleDataContainer, selectedStyles] : styles.singleDataContainer}>
                <Text style={styles.dataDate}>{item.date}</Text>
                <Text style={styles.dataValue}>{parseInt(item[key]*10)/10} {label}</Text>
            </TouchableOpacity>
        ))
    }

    renderChartArea(graphData, color, lineColor, extra=false) {
        const { trackIndex } = this.state;
        const Decorator = ({ x, y, data }) => {
            return data.map((value, index) => (
                <Circle
                    onPress={() => this.setState({trackIndex: index})}
                    key={ index }
                    cx={ x(index) }
                    cy={ y(value) }
                    r={ 4 }
                    stroke={ color }
                    fill={ trackIndex === index ? 'white': color }
                />
            ))
        }
        const Line = ({ line }) => (
            <Path
                d={ line }
                stroke={ lineColor }
                fill={ 'none' }
            />
        )
        return (
            <AreaChart
            style={ extra ? StyleSheet.absoluteFill : styles.chart }
            data={ graphData }
            svg={{ fill: color }}
            contentInset={ { top: 10, bottom: 10 } }
            // // curve={ shape.curveNatural }
            >
                <Line/>
                <Decorator/>
                {extra ? null : <Grid/>}
            </AreaChart>
        )
    }

    renderChart() {
        const { dateMin, dateMax, trackedItem } = this.state;
        const { data } = this.props;
        const contentInset = {top: 10, bottom: 10}
        let chart;
        let sliderData;
        let graphData;
        let macroData = this.filterDataByDate(data.entries).map((item, i) => {
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
        for (let i=0; i<macroData.length; i++) {
            if (!Object.keys(newData).includes([macroData[i].date])) {
                newData[macroData[i].date] = {
                    key: i,
                    date: macroData[i].date,
                    carbs: 0,
                    protein: 0,
                    fat: 0,
                    calories: 0,
                }
            }
            newData[macroData[i].date].fat = newData[macroData[i].date].fat + macroData[i].fat*9;
            newData[macroData[i].date].protein = newData[macroData[i].date].protein + macroData[i].protein*4;
            newData[macroData[i].date].carbs = newData[macroData[i].date].carbs + macroData[i].carbs*4;
            newData[macroData[i].date].calories = newData[macroData[i].date].calories + macroData[i].fat*9 + macroData[i].protein*4 + macroData[i].carbs*4;
        }
        macroData = [];
        Object.keys(newData).forEach((item) => {
            macroData.push(newData[item]);
        });
        if (trackedItem === 'weight' || trackedItem === 'calories') {
            if (trackedItem === 'weight') {
                graphData = this.filterDataByDate(data.tracking.map(item => item.weight));
                sliderData = this.filterDataByDate(data.tracking.map(item => ({ weight: item.weight, date: item.date })));
            } else {
                graphData = this.filterDataByDate(macroData.map(item => item.calories));
                sliderData = this.filterDataByDate(macroData.map(item => ({ calories: item.calories, date: item.date })));                
            }
            chart = (
            <View style={styles.chartContainer}>
                {this.renderChartArea(graphData, 'rgba(237, 245, 225, 0.3)', 'rgba(244, 244, 244, 1)')}
                <YAxis
                    style={ styles.yAxis }
                    data={ graphData }
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
            </View>);
        } else if (trackedItem === 'macros') {
            graphData = this.filterDataByDate(macroData.map(item => item.calories));
            graphDataFat = this.filterDataByDate(macroData.map(item => item.fat));
            graphDataProtein = this.filterDataByDate(macroData.map(item => item.protein));
            graphDataCarbs = this.filterDataByDate(macroData.map(item => item.carbs));
            sliderData = this.filterDataByDate(macroData.map(item => ({ fat: item.fat, protein: item.protein, carbs: item.carbs, date: item.date })));  
            chart = (
                <View style={styles.chartContainer}>
                    {this.renderChartArea(graphDataFat, 'rgba(237, 245, 97, .3)', 'rgba(237, 245, 97, 1)', true)}
                    {this.renderChartArea(graphDataProtein, 'rgba(60, 171, 101, .3)', 'rgba(60, 171, 101, 1)')}
                    {this.renderChartArea(graphDataCarbs, 'rgba(37, 136, 171, .3)', 'rgba(37, 136, 171, 1)', true)}
                </View>);
        } else if (trackedItem === 'calories vs. weight') {
            graphDataWeight = this.filterDataByDate(data.tracking.map(item => item.weight));
            graphDataCalories = this.filterDataByDate(macroData.map(item => item.calories));
            sliderData = this.filterDataByDate(data.tracking.map(item => ({ weight: item.weight, date: item.date })));
            chart = (
                <View style={styles.chartContainer}>
                    {this.renderChartArea(graphDataWeight, 'rgba(237, 245, 225, 0.3)', 'rgba(244, 244, 244, 1)')}
                    {this.renderChartArea(graphDataCalories, 'rgba(92, 203, 133, .3)', 'rgba(92, 203, 133, 1)', true)}
                    <YAxis
                        style={ styles.yAxis }
                        data={ graphDataWeight }
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
                </View>);
        }
        return (
            <View>
                {chart}
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
                        {this.renderData(sliderData)}
                    </ScrollView>
                </View>
            </View>
        )
    }
   
    render() {
        if (!this.props) return <Text>Loading...</Text>
        const { dateMin, dateMax, trackedItem } = this.state;

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
                {this.renderChart()}

                <Picker itemStyle={[styles.picker,{color: globalStyles.fontColor}]} selectedValue={trackedItem} 
                    onValueChange={(itemValue, nutrientIndex) => {
                        this.setState({trackedItem: itemValue})}
                    }>
                    <Picker.Item key="weight" label="weight" value="weight"/>
                    <Picker.Item key="calories" label="calories" value="calories"/>
                    <Picker.Item key="macros" label="macros" value="macros"/>
                    <Picker.Item key="calories vs. weight" label="calories vs. weight" value="calories vs. weight"/>
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
        height: 200,
        marginLeft: '7.5%',
        marginRight: '7.5%',
    },
    chart: {
        flex: 1,
        height: '100%',
    },
    yAxis: {
        height: '100%',
        position: 'absolute',
        top: '2.5%',
        left: '-7.5%',
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