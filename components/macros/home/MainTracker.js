import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-svg-charts'
// import PieChart from 'react-native-pie-chart';
import globalStyles from '../../../globalStyles';

class MainTracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredItems: [],
      componentHeight: 450,
    }
  }

  calculateMacros(data) {
    let protein = 0, carbs = 0, fat = 0, fiber = 0, sugar = 0;
    if (data.length > 0) data.forEach((item) => {
      protein += item.protein * item.servings;
      carbs += item.carbs * item.servings;
      fat += item.fat * item.servings;
      fiber += item.fiber * item.servings;
      sugar += item.sugar * item.servings;
    });

    const calories = (protein * 4) + (carbs * 4) + (fat * 9);

    return { protein, carbs, fat, fiber, sugar, calories };
  }

  createColorBar(percent, color) {
    let backgroundColor = color;
    let width = String(percent * 100) + '%';
    if (percent >= 1) {
      backgroundColor = 'red';
      width = '100%';
    };
    return (<Text style={{height: '100%', width, position: 'absolute', left: 0, top: 0, backgroundColor,}}></Text>);
  }
  createInitialColorBar(percent, color) {
    let backgroundColor = color;
    if (percent >= 1) {
      backgroundColor = 'red';
    };
    return (<Text style={{height: '100%', width: '100%', position: 'absolute', left: 0, top: 0, backgroundColor, opacity: .5}}></Text>);
  }

  renderPie(dailyMacros) {
    try {
      // const { componentHeight } = this.state;
      // const { goals } = this.props.data;
      // let coverRadius = dailyMacros.calories / goals.calories;
      // coverRadius = coverRadius > 1 ? 1 : coverRadius;
      const data = [ dailyMacros.protein, dailyMacros.carbs, dailyMacros.fat ];

      const randomColor = () => ('#' + (Math.random() * 0xFFFFFF << 0).toString(16) + '000000').slice(0, 2)

      const pieData = data
          .filter(value => value > 0)
          .map((value, index) => ({
              value,
              svg: {
                  fill: randomColor(),
                  onPress: () => console.log('press', index),
              },
              key: `pie-${index}`,
          }))
          console.log(pieData)
      return (
        <View style={styles.pieChart}>
            <PieChart
              style={{height: 200}}
              data={ pieData }
            />
          {/* <PieChart
              chart_wh={componentHeight / 2.33}
              series={[dailyMacros.protein, dailyMacros.carbs, dailyMacros.fat]}
              sliceColor={[globalStyles.proteinColor, globalStyles.carbColor, globalStyles.fatColor]}
            /> */}
        </View>
      )
    } catch(e) {
      console.error(e);
      return (
        <View style={styles.pieChart}></View>
      )
    }
  }

  createMacroBar(key, barColor, color = null) {
    const { dailyData } = this.props;
    const { goals } = this.props.data;
    const dailyMacros = this.calculateMacros(dailyData);
    return (
      <View style={styles.macro}>
        {this.createColorBar((dailyMacros[key]/goals[key]), barColor)}
        {this.createInitialColorBar((dailyMacros[key]/goals[key]), barColor)}
        <Text style={[styles.macroHeader, {color}]}>{key[0].toUpperCase() + key.split('').slice(1).join('')}</Text>
        <Text style={[styles.macroInt, {color}]}>{Math.round(dailyMacros[key])}/{goals[key]}</Text>
    </View>
    )
  }
  createCalorieBar() {
    const { dailyData } = this.props;
    const { goals } = this.props.data;
    const dailyMacros = this.calculateMacros(dailyData);
    return (
      <View style={styles.calories}>
        {this.createColorBar((dailyMacros.calories/goals.calories), globalStyles.caloriesColor)}
        {this.createInitialColorBar((dailyMacros.calories/goals.calories), globalStyles.caloriesColor)}
        <Text style={styles.macroHeader}>Calories</Text>
        <Text style={styles.macroInt}>{Math.round(dailyMacros.calories)}/{goals.calories}</Text>
    </View>
    )
  }

  render() {
    if (!this.props) return (<View><Text>Loading...</Text></View>)
    const { dailyData } = this.props;
    const { trackingSettings } = this.props.data.settings;
    const dailyMacros = this.calculateMacros(dailyData);
    let pie = <View style={styles.pieChart}/>;
    if (dailyMacros.protein > 0 || dailyMacros.carbs > 0 || dailyMacros.fat > 0) pie = this.renderPie(dailyMacros);  
    return (
      <View style={styles.mainContainer} onLayout={(event) => {
        this.setState({componentHeight: event.nativeEvent.layout.height});
      }}>
        <View style={styles.macrosContainer}>
          {this.createMacroBar('fat', globalStyles.fatColor, '#000')}
          {this.createMacroBar('protein', globalStyles.proteinColor, '#000')}
          {this.createMacroBar('carbs', globalStyles.carbColor, '#000')}
        </View>
        {this.createCalorieBar()}
        <View style={styles.misc}>
          {trackingSettings.trackFiber ? <Text>Fiber: {dailyMacros.fiber}</Text>: <Text></Text>}
          {trackingSettings.trackSugar ? <Text>Sugar: {dailyMacros.sugar}</Text>: <Text></Text>}
        </View>
        {pie}
    </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    height: '68.65%',
  },
  macrosContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: '2.5%',
    marginBottom: '-10%',
  },
  macroHeader: {
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 14,
  },
  macroInt: {
    textAlign: 'center',
    fontSize: 14,
  },
  macro: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '30%',
    height: '45%',
  },
  calories: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '10%',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  misc: {
    marginTop: '5%',
    marginBottom: '-4%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  pieChart: {
    alignItems: 'center',
    marginTop: '5%',
  },
  // quickAddButton: {
  //   position: 'relative',
  //   bottom: 32.5,
  //   padding: 10,
  //   backgroundColor: globalStyles.colors.four,
  //   width: 105,
  //   marginLeft: 'auto',
  // },
  // buttonText: {
  //   fontSize: 18,
  //   textAlign: 'center',
  // }
});

const mapStateToProps = state => {
  return {
      quickAdd: state.appState.quickAdd,
      date: state.appState.date,
      data: state.dataReducer.data,
  }
}

export default connect(mapStateToProps)(MainTracker);