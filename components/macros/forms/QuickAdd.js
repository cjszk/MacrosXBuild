import React from "react";
import { connect } from "react-redux";
import {
  AsyncStorage,
  Text,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Picker
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { toggleTab } from "../../../actions/appState";
import globalStyles from "../../../globalStyles";

class QuickAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      protein: "",
      carbs: "",
      fat: "",
      fiber: 0,
      sugar: 0,
      servings: 1,
      servingSize: 1,
      measurement: "Quick Add"
    };
  }

  renderNutrient(key, borderBottomColor = null) {
    const title =
      key.split("")[0].toUpperCase() +
      key
        .split("")
        .slice(1)
        .join("");
    const macroValue = this.state[key];
    return (
      <View style={styles.macro}>
        <Text style={[styles.macroText, { color: borderBottomColor }]}>
          {title}
        </Text>
        <TextInput
          maxLength={5}
          value={String(macroValue)}
          style={[styles.macroInput, { borderBottomColor }]}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor={globalStyles.placeHolderTextColor}
          onChangeText={n => this.setState({ [key]: n })}
        />
      </View>
    );
  }

  handleParseInt = macro => (parseInt(macro) ? parseInt(macro) : 0);

  handleSubmit = async () => {
    const defaultName = "QA item";
    let { name, measurement } = this.state;
    let { date, data } = this.props;
    if (!measurement.length) measurement = "servings";
    let {
      protein,
      carbs,
      fat,
      fiber,
      sugar,
      servings,
      servingSize
    } = this.state;
    if (!servings)
      return alert("Please enter the amount of servings to be consumed.");
    protein = this.handleParseInt(protein);
    carbs = this.handleParseInt(carbs);
    fat = this.handleParseInt(fat);
    fiber = this.handleParseInt(fiber);
    sugar = this.handleParseInt(sugar);
    servings = this.handleParseInt(servings);
    servingSize = this.handleParseInt(servingSize);
    if (name.length === 0) name = defaultName;
    const newEntry = {
      name,
      protein,
      carbs,
      fat,
      fiber,
      sugar,
      servings,
      measurement,
      date,
      servingSize
    };
    const newLibraryEntry = {
      name,
      protein,
      carbs,
      fat,
      fiber,
      sugar,
      date,
      servingSize,
      measurement
    };
    let newData = data;
    const newEntries = data.entries.slice();
    newEntries.push(newEntry);
    newData.entries = newEntries;
    if (name !== defaultName) {
      const newLibraryEntries = data.library.slice();
      newLibraryEntries.push(newLibraryEntry);
      newData.library = newLibraryEntries;
    }
    try {
      await AsyncStorage.setItem("data", JSON.stringify(newData));
      this.props.dispatch(toggleTab("home"));
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { name, protein, carbs, fat, servings } = this.state;
    const calorieCount = parseInt(protein * 4 + carbs * 4 + fat * 9);
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView style={styles.main} extraScrollHeight={100}>
          <View style={styles.mainContainer}>
            <Text style={styles.header}>Quick Add</Text>
            <View style={styles.nameView}>
              <Text style={styles.nameText}>Name: </Text>
              <TextInput
                value={String(name)}
                onChangeText={e => this.setState({ name: e })}
                style={styles.nameInput}
                placeholderTextColor={globalStyles.placeHolderTextColor}
                placeholder="(optional)"
              />
            </View>
            <View style={styles.servingsContainer}>
              <Text style={styles.servingsText}>Servings: </Text>
              <TextInput
                value={String(servings)}
                onChangeText={n => this.setState({ servings: n })}
                style={styles.servingsInput}
                placeholderTextColor={globalStyles.placeHolderTextColor}
                placeholder="1"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.nutrientsContainer}>
              <View style={styles.macroContainer}>
                {this.renderNutrient("fat", globalStyles.fatFontColor)}
                {this.renderNutrient("protein", globalStyles.proteinColor)}
                {this.renderNutrient("carbs", globalStyles.carbsFontColor)}
              </View>
              <Text style={styles.calorieCount}>
                Total Calories: {calorieCount}
              </Text>
            </View>
            <View style={styles.submitContainer}>
              <TouchableOpacity
                style={styles.submit}
                onPress={() => this.handleSubmit()}
              >
                <Text style={styles.submitText}>Enter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    );
  }
}
const styles = {
  main: {
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, .5)"
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginLeft: "10%",
    marginRight: "10%"
  },
  header: {
    fontSize: 32,
    alignSelf: "center",
    marginTop: "20%",
    color: globalStyles.fontColor
  },
  nameView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end"
  },
  nameText: {
    fontSize: 18,
    padding: 10,
    width: "30%",
    color: globalStyles.fontColor
  },
  nameInput: {
    borderBottomColor: globalStyles.colors.four,
    borderBottomWidth: 2,
    padding: 10,
    marginTop: 10,
    width: "70%",
    color: globalStyles.fontColor
  },
  servingsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    height: "20%"
  },
  servingsText: {
    fontSize: 18,
    padding: 10,
    color: globalStyles.fontColor,
    alignSelf: "center"
  },
  servingsInput: {
    alignSelf: "center",
    borderBottomColor: globalStyles.colors.four,
    borderBottomWidth: 2,
    marginLeft: 5,
    marginRight: 5,
    width: 60,
    height: "80%",
    color: globalStyles.fontColor,
    textAlign: "center"
  },
  nutrientsContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    marginTop: "5%",
    width: "100%",
    height: "27.75%"
  },
  macroContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around"
  },
  miscContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around"
  },
  macro: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around"
  },
  macroText: {
    textAlign: "center",
    alignSelf: "center"
  },
  macroInput: {
    // borderBottomColor: globalStyles.colors.four,
    borderBottomWidth: 2,
    marginBottom: 30,
    marginTop: 10,
    width: 60,
    height: 40,
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    color: globalStyles.fontColor
  },
  calorieCount: {
    color: globalStyles.fontColor,
    textAlign: "center"
  },
  submitContainer: {
    height: "15%",
    marginTop: "10%"
  },
  submit: {
    justifyContent: "space-around",
    marginLeft: "auto",
    marginRight: "auto",
    height: "150%",
    width: "66.67%",
    backgroundColor: globalStyles.buttonColor
  },
  submitText: {
    textAlign: "center",
    color: globalStyles.buttonTextColor,
    fontSize: 18
  }
};

const mapStateToProps = state => {
  return {
    quickAdd: state.appState.quickAdd,
    date: state.appState.date,
    data: state.dataReducer.data
  };
};

export default connect(mapStateToProps)(QuickAdd);
