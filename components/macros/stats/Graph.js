import React from 'react';
import { connect } from 'react-redux';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts'
import * as shape from 'd3-shape'
import moment from 'moment';
import { View, TouchableOpacity, Text } from 'react-native';
import { toggleTab } from '../../../actions/appState';
import globalStyles from '../../../globalStyles';

class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trackedItem: 'weight',
            filteredData: []
        }
    }

    componentDidMount() {
        this.filterData();
    }

    filterData() {
        const { data } = this.props;
        const { tracking } = data;
        const { trackedItem } = this.state;
        const filteredData = tracking.sort((a, b) => {
            return moment.utc(a.date).diff(moment.utc(b.date))
        }).map((item) => {
            return {
                date: item.date,
                value: item[trackedItem],
                key: trackedItem,
            }
        });
        this.setState({filteredData});
    }

    render() {
        const { filteredData } = this.state;
        if (!filteredData) return <Text>Loading...</Text>
        console.log(this.state);
        const data = filteredData.map(item => item.value);
        const dates = filteredData.map(item => Number(moment(item.date).format('x')));
        console.log(dates);

        return (
            <View style={styles.main}>
                <View style={styles.chartContainer}>
                    <LineChart
                        style={{ flex: 1 }}
                        data={ data }
                        gridMin={ 0 }
                        contentInset={{ top: 10, bottom: 10 }}
                        svg={{ stroke: globalStyles.colors.five }}
                    >
                        <Grid/>
                    </LineChart>
                    <XAxis
                        data={{dates}}
                        formatLabel={ (value, index) => index }
                        svg={{ fontSize: 10, fill: globalStyles.colors.three }}
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
        // height: '100%',
        // marginTop: '10%',
        // marginLeft: '5%',
        padding: 20,
        height: 200,
        // marginRight: '5%',
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