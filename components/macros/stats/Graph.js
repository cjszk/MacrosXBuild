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

    sortByDate(data) {
        return data.sort((a, b) => moment(a.date).format('x') - moment(b.date).format('x'));
    };

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

    renderChartArea(graphData, color, lineColor, macro=false, extra=false) {
        const { trackIndex } = this.state;
        const data = [];
        const validIndexes = [];
        let found = false;
        let index = 0;
        while (!found && index < graphData.length) {
            if (graphData[index]) found = true;
            else index++;
        }
        let min;
        let validIndex = 0;
        for (let i=index; i<graphData.length; i++) {
            if (graphData[i]) {
                if (!min) {
                    data.push(graphData[i]);
                    validIndexes.push(validIndex);
                    validIndex++;
                } else {
                    let max;
                    found = false;
                    index = i;
                    while (!found) {
                        if (graphData[index]) {
                            found = true;
                            max = index;
                        }
                        else if (index > graphData.length) break;
                        else index++;
                    }
                    index = min+1;
                    while (index < max) {
                        const difference = graphData[max] - graphData[min];
                        const increment = difference / (max-min) ;
                        data.push(graphData[min] + (increment * (index-min)));
                        validIndex++;
                        index++;
                    }
                    min = null;
                    max = null;
                    data.push(graphData[i]);
                    validIndexes.push(validIndex);
                    validIndex++;
                }
            }
            else if (!min) min = i-1;
        }
        const Decorator = ({ x, y, data }) => {
            let i = -1;
            return data.map((value, index) => {
                if (validIndexes.includes(index)) {
                    i++;
                    return (
                        <Circle
                            onPress={() => this.setState({trackIndex: index})}
                            key={ i }
                            cx={ x(index) }
                            cy={ y(value) }
                            r={ 4 }
                            stroke={ color }
                            fill={ trackIndex === i ? 'white': color }
                        />
                    )
                } 
                else return null;
            })
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
            data={ data }
            svg={{ fill: color }}
            yMin={macro ? 0 : undefined}
            yMax={macro ? 1 : undefined}
            contentInset={ { top: 10, bottom: 10 } }
            // // curve={ shape.curveNatural }
            >
                <Line/>
                <Decorator/>
                {extra ? null : <Grid/>}
            </AreaChart>
        )
    }

    renderWeightChart() {
        const { data } = this.props;
        const { dateMin, dateMax } = this.state;
        const contentInset = {top: 10, bottom: 10}
        const sliderData = this.filterDataByDate(this.sortByDate(data.tracking.filter((item) => item.weight > 0)).map(item => ({ weight: item.weight, date: item.date })));
        const sliderDataDates = sliderData.map(item => item.date);
        const range = moment(dateMax).diff(dateMin, 'days');
        const graphData = [];
        for (let i=0; i<=range; i++) {
            if (sliderDataDates.includes(moment(dateMin).add(i, 'days').format('MM/DD/YYYY'))) {
                const index = sliderDataDates.indexOf(moment(dateMin).add(i, 'days').format('MM/DD/YYYY'));
                graphData.push(sliderData[index].weight);
            } else {
                graphData.push(null);
            }
        }
        const chart = (
        <View style={styles.chartContainer}>
            {this.renderChartArea(graphData, 'rgba(92, 203, 133, .3)', 'rgba(92, 203, 133, 1)')}
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

        return this.renderChart(chart, sliderData, 'weight');
    }

    renderCaloriesChart() {
        const { data } = this.props;
        const { dateMin, dateMax } = this.state;
        const contentInset = {top: 10, bottom: 10}
        const macroDates = {};
        data.entries.forEach((item) => {
            const date = moment(item.date).format('MM/DD/YYYY');
            if (!Object.keys(macroDates).includes(date)) { 
                macroDates[date] = {
                    date: moment(item.date).format('MM/DD/YYYY'),
                    protein: (item.protein*4) * item.servings,
                    carbs: (item.carbs*4) * item.servings,
                    fat: (item.fat*9) * item.servings,
                    calories: (item.protein*4) * item.servings + (item.carbs*4) * item.servings + (item.fat*9) * item.servings
                } 
            } else {
                macroDates[date].protein += (item.protein*4) * item.servings;
                macroDates[date].carbs += (item.carbs*4) * item.servings;
                macroDates[date].fat += (item.fat*9) * item.servings;
                macroDates[date].calories += (item.protein*4) * item.servings + (item.carbs*4) * item.servings + (item.fat*9) * item.servings
            }
        });
        const macroData = [];
        Object.keys(macroDates).forEach((key) => {
            macroData.push(macroDates[key])
        });
        // const graphData = this.filterDataByDate(this.sortByDate(macroData)).map(item => item.calories);
        const sliderData = this.filterDataByDate(this.sortByDate(macroData).map(item => ({ calories: item.calories, date: item.date }))); 
        const sliderDataDates = sliderData.map(item => item.date);
        const range = moment(dateMax).diff(dateMin, 'days');
        const graphData = [];
        for (let i=0; i<=range; i++) {
            if (sliderDataDates.includes(moment(dateMin).add(i, 'days').format('MM/DD/YYYY'))) {
                const index = sliderDataDates.indexOf(moment(dateMin).add(i, 'days').format('MM/DD/YYYY'));
                graphData.push(sliderData[index].calories);
            } else {
                graphData.push(null);
            }
        }   
        const chart = (
        <View style={styles.chartContainer}>
            {this.renderChartArea(graphData, 'rgba(92, 203, 133, .3)', 'rgba(92, 203, 133, 1)')}
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
        return this.renderChart(chart, sliderData, 'calories');
    }

    renderMacrosChart() {
        const { data } = this.props;
        const { dateMin, dateMax } = this.state;
        const contentInset = {top: 10, bottom: 10}
        const macroDates = {};
        data.entries.forEach((item) => {
            const date = moment(item.date).format('MM/DD/YYYY');
            if (!Object.keys(macroDates).includes(date)) { 
                macroDates[date] = {
                    date: moment(item.date).format('MM/DD/YYYY'),
                    protein: (item.protein*4) * item.servings,
                    carbs: (item.carbs*4) * item.servings,
                    fat: (item.fat*9) * item.servings,
                    calories: (item.protein*4) * item.servings + (item.carbs*4) * item.servings + (item.fat*9) * item.servings
                } 
            } else {
                macroDates[date].protein += (item.protein*4) * item.servings;
                macroDates[date].carbs += (item.carbs*4) * item.servings;
                macroDates[date].fat += (item.fat*9) * item.servings;
                macroDates[date].calories += (item.protein*4) * item.servings + (item.carbs*4) * item.servings + (item.fat*9) * item.servings
            }
        });
        const macroData = [];
        Object.keys(macroDates).forEach((key) => {
            macroData.push(macroDates[key])
        });
        // const graphDataFat = this.filterDataByDate(this.sortByDate(macroData)).map(item => item.fat/item.calories);
        // const graphDataProtein = this.filterDataByDate(this.sortByDate(macroData)).map(item => item.protein/item.calories);
        // const graphDataCarbs = this.filterDataByDate(this.sortByDate(macroData)).map(item => item.carbs/item.calories);
        const sliderData = this.filterDataByDate(this.sortByDate(macroData.filter((item) => item.calories > 0))).map(item => ({ fat: item.fat, protein: item.protein, carbs: item.carbs, date: item.date, calories: item.calories }));  
        const sliderDataDates = sliderData.map(item => item.date);
        const range = moment(dateMax).diff(dateMin, 'days');
        const graphDataFat = [];
        const graphDataProtein = [];
        const graphDataCarbs = [];
        for (let i=0; i<=range; i++) {
            if (sliderDataDates.includes(moment(dateMin).add(i, 'days').format('MM/DD/YYYY'))) {
                const index = sliderDataDates.indexOf(moment(dateMin).add(i, 'days').format('MM/DD/YYYY'));
                graphDataFat.push(sliderData[index].fat/sliderData[index].calories);
                graphDataProtein.push(sliderData[index].protein/sliderData[index].calories);
                graphDataCarbs.push(sliderData[index].carbs/sliderData[index].calories);
            } else {
                graphDataFat.push(null);
                graphDataProtein.push(null);
                graphDataCarbs.push(null);
            }
        }   
        const chart = (
            <View style={styles.chartContainer}>
                {this.renderChartArea(graphDataFat, 'rgba(237, 245, 97, .3)', 'rgba(237, 245, 97, 1)', 'macro', 'extra')}
                {this.renderChartArea(graphDataProtein, 'rgba(60, 171, 101, .3)', 'rgba(60, 171, 101, 1)', 'macro')}
                {this.renderChartArea(graphDataCarbs, 'rgba(37, 136, 171, .3)', 'rgba(37, 136, 171, 1)', 'macro', 'extra')}
                <YAxis
                    style={ styles.yAxis }
                    data={ [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] }
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
            </View>
        );
        return this.renderMacroChart(chart, sliderData);
    }

    renderCaloriesVsWeightChart() {
        const { data } = this.props;
        const contentInset = {top: 10, bottom: 10}
        const macroDates = {};
        data.entries.forEach((item) => {
            const date = moment(item.date).format('MM/DD/YYYY');
            if (!Object.keys(macroDates).includes(date)) { 
                macroDates[date] = {
                    date: moment(item.date).format('MM/DD/YYYY'),
                    protein: item.protein*4,
                    carbs: item.carbs*4,
                    fat: item.fat*9,
                    calories: item.protein*4 + item.carbs*4 + item.fat*9
                } 
            } else {
                macroDates[date].protein += item.protein*4;
                macroDates[date].carbs += item.carbs*4;
                macroDates[date].fat += item.fat*9;
                macroDates[date].calories += item.protein*4 + item.carbs*4 + item.fat*9
            }
        });
        const macroData = [];
        Object.keys(macroDates).forEach((key) => {
            macroData.push(macroDates[key])
        });
        const graphDataWeight = this.filterDataByDate(this.sortByDate(data.tracking)).map(item => item.weight);
        const graphDataCalories = this.filterDataByDate(this.sortByDate(macroData)).map(item => item.calories);
        const sliderData = this.filterDataByDate(this.sortByDate(data.tracking.filter((item) => item.weight > 0))).map(item => ({ weight: item.weight, date: item.date }));
        const chart = (
            <View style={styles.chartContainer}>
                {this.renderChartArea(graphDataWeight, 'rgba(92, 203, 133, .3)', 'rgba(92, 203, 133, 1)')}
                {this.renderChartArea(graphDataCalories, 'rgba(237, 245, 225, 0.3)', 'rgba(244, 244, 244, 1)', false, true)}
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
        return this.renderChart(chart, sliderData, 'weight');
    }

    renderMacroChart(chart, sliderData) {
        const { dateMin, dateMax, trackIndex } = this.state;
        const selectedStyles = {backgroundColor: 'rgba(255,255,255,.5)'}
        const buildSliders = sliderData.map((item, index) => (
            <TouchableOpacity onPress={() => this.setState({trackIndex: index})} key={item.date} style={trackIndex === index ? [styles.singleDataContainer, selectedStyles] : styles.singleDataContainer}>
                <Text style={styles.dataDate}>{item.date}</Text>
                <View style={styles.dataMacros}>
                    <Text style={[styles.dataValue, {fontSize: 14, color: globalStyles.fatColor}]}>{parseInt(item.fat/9)}g/</Text>
                    <Text style={[styles.dataValue, {fontSize: 14, color: globalStyles.proteinColor}]}>{parseInt(item.protein/4)}g/</Text>
                    <Text style={[styles.dataValue, {fontSize: 14, color: globalStyles.carbColor}]}>{parseInt(item.carbs/4)}g</Text>
                </View>
            </TouchableOpacity>
        ));
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
                            <Text style={styles.dateInputText}> {moment(dateMin).format('MM/DD/YYYY')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.singleDateContainer}>
                        <Text style={styles.dateLabel}>To:</Text>
                        <TouchableOpacity style={styles.dateInput} onPress={() => {
                            this.setState({dateTarget: 'max'})
                            this._showDateTimePickerMax();
                        }}>
                            <Text style={styles.dateInputText}> {moment(dateMax).format('MM/DD/YYYY')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.dataContainer}>
                    <ScrollView horizontal={true}>
                        {buildSliders}
                    </ScrollView>
                </View>
            </View>
        )
    }

    renderChart(chart, sliderData, key) {
        const { dateMin, dateMax, trackIndex, trackedItem } = this.state;
        const selectedStyles = {backgroundColor: 'rgba(255,255,255,.5)'}
        const label = this.props.data.settings.trackingSettings.trackByKg ? 'kg' : 'lbs';
        const buildSliders = sliderData.map((item, index) => (
            <TouchableOpacity onPress={() => this.setState({trackIndex: index})} key={item.date} style={trackIndex === index ? [styles.singleDataContainer, selectedStyles] : styles.singleDataContainer}>
                <Text style={styles.dataDate}>{item.date}</Text>
                <Text style={styles.dataValue}>{parseInt(item[key]*10)/10} {trackedItem === 'weight'  || trackedItem === 'calories vs. weight' ? label : 'kcal'}</Text>
            </TouchableOpacity>
        ));
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
                            <Text style={styles.dateInputText}> {moment(dateMin).format('MM/DD/YYYY')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.singleDateContainer}>
                        <Text style={styles.dateLabel}>To:</Text>
                        <TouchableOpacity style={styles.dateInput} onPress={() => {
                            this.setState({dateTarget: 'max'})
                            this._showDateTimePickerMax();
                        }}>
                            <Text style={styles.dateInputText}> {moment(dateMax).format('MM/DD/YYYY')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.dataContainer}>
                    <ScrollView horizontal={true}>
                        {buildSliders}
                    </ScrollView>
                </View>
            </View>
        )
    }

    renderChartInterface() {
        const { trackedItem } = this.state;
        const { data } = this.props;
        if (!data.tracking) return <Text>No Data to show!</Text>
        if (trackedItem === 'weight') return this.renderWeightChart();
        if (trackedItem === 'calories') return this.renderCaloriesChart();
        if (trackedItem === 'macros') return this.renderMacrosChart();
        if (trackedItem === 'calories vs. weight') return this.renderCaloriesVsWeightChart();
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
                {this.renderChartInterface()}
                <Picker itemStyle={[styles.picker,{color: globalStyles.fontColor}]} selectedValue={trackedItem} 
                    onValueChange={(itemValue, nutrientIndex) => {
                        this.setState({trackedItem: itemValue})}
                    }>
                    <Picker.Item key="weight" label="weight" value="weight"/>
                    <Picker.Item key="calories" label="calories" value="calories"/>
                    <Picker.Item key="macros" label="macros by % of calories" value="macros"/>
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