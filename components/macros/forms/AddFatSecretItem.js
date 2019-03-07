import React from "react";
import { stringify } from "query-string";
import hmacsha1 from "hmacsha1";
import moment from "moment";
import { connect } from "react-redux";
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Picker
} from "react-native";
import { toggleTab } from "../../../actions/appState";
import globalStyles from "../../../globalStyles";
import {
  API_PATH,
  ACCESS_KEY,
  APP_SECRET,
  OAUTH_VERSION,
  OAUTH_SIGNATURE_METHOD
} from "../keys";

class AddFatSecretItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiSearchItem: null,
      selected: 0,
      nutrients: "",
      nutrientIndex: "",
      servings: "",
      servingSize: "",
      measurement: "",
      equivalent: 100
    };
  }

  renderNutrient(macro, key, color = globalStyles.placeHolderTextColor) {
    const title =
      key.split("")[0].toUpperCase() +
      key
        .split("")
        .slice(1)
        .join("");
    let { servings } = this.state;
    if (!servings) servings = 0;
    const amount = Number(parseInt(macro * servings))
      ? String(parseInt(macro * servings))
      : 0;
    return (
      <View style={styles.macro}>
        <Text style={[styles.macroText, { color }]}>{title}</Text>
        <Text style={[styles.macroInt, { color }]}>{amount} grams</Text>
      </View>
    );
  }

  handleParseInt = macro => (parseInt(macro) ? parseInt(macro) : 0);

  handleSubmit = async (
    protein,
    carbs,
    fat,
    fiber,
    sugar,
    measurement,
    name,
    servingSize
  ) => {
    const { date, data } = this.props;
    const { servings } = this.state;
    const item = {};
    protein = this.handleParseInt(protein);
    carbs = this.handleParseInt(carbs);
    fat = this.handleParseInt(fat);
    fiber = this.handleParseInt(fiber);
    sugar = this.handleParseInt(sugar);
    servingSize = this.handleParseInt(servingSize);
    const newEntry = {
      name,
      protein,
      carbs,
      fat,
      fiber,
      sugar,
      servings,
      date: moment().format(),
      servingSize,
      measurement
    };
    const newEntries = data.entries.slice();
    newEntries.push(newEntry);
    let newData = data;
    newData.entries = newEntries;
    try {
      await AsyncStorage.setItem("data", JSON.stringify(newData));
      this.props.dispatch(toggleTab("home"));
    } catch (error) {
      console.error(error);
    }
  };

  getOauthParameters() {
    const timestamp = Math.round(new Date().getTime() / 1000);
    return {
      oauth_consumer_key: ACCESS_KEY,
      oauth_nonce: `${timestamp}${Math.floor(Math.random() * 1000)}`,
      oauth_signature_method: OAUTH_SIGNATURE_METHOD,
      oauth_timestamp: timestamp,
      oauth_version: OAUTH_VERSION
    };
  }

  getSignature(queryParams, httpMethod = "GET") {
    const signatureBaseString = [
      httpMethod,
      encodeURIComponent(API_PATH),
      encodeURIComponent(stringify(queryParams))
    ].join("&");
    const signatureKey = `${APP_SECRET}&`;
    return hmacsha1(signatureKey, signatureBaseString);
  }

  makeApiCall(methodParams, httpMethod = "GET") {
    const queryParams = {
      ...this.getOauthParameters(),
      ...methodParams,
      format: "json"
    };
    queryParams["oauth_signature"] = this.getSignature(queryParams, httpMethod);
    return fetch(`${API_PATH}?${stringify(queryParams)}`, {
      method: httpMethod
    });
  }

  async getFoodInfo(food) {
    const methodParams = {
      method: "food.get",
      food_id: food.food_id
    };
    await this.makeApiCall(methodParams)
      .then(res => res.json())
      .then(res => {
        this.setState({
          apiSearchItem: res.food
        });
      });
  }

  componentDidMount() {
    const { item } = this.props;
    this.getFoodInfo(item);
  }

  renderMeasurements() {
    const { apiSearchItem } = this.state;
    if (!Array.isArray(apiSearchItem.servings.serving))
      return (
        <Picker.Item
          key={apiSearchItem.servings.serving.serving_description}
          label={apiSearchItem.servings.serving.serving_description}
          value={0}
        />
      );
    return apiSearchItem.servings.serving.map((m, i) => (
      <Picker.Item
        key={m.serving_description}
        label={m.serving_description}
        value={i}
      />
    ));
  }

  render() {
    if (!this.state.apiSearchItem)
      return (
        <View style={styles.main}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 32,
              color: "#fff",
              paddingTop: 200
            }}
          >
            Loading...
          </Text>
        </View>
      );
    const { apiSearchItem, servings, selected } = this.state;
    const { trackingSettings } = this.props.data.settings;

    const nutritionPath = Array.isArray(apiSearchItem.servings.serving)
      ? apiSearchItem.servings.serving[selected]
      : apiSearchItem.servings.serving;
    const servingSize = Number(nutritionPath.serving_description.split(" ")[0]);
    const measurement = nutritionPath.serving_description
      .split(" ")
      .slice(1)
      .join(" ");
    const protein = nutritionPath.protein;
    const carbs = nutritionPath.carbohydrate;
    const fat = nutritionPath.fat;
    const calorieCount = parseInt(
      protein * 4 * servings + carbs * 4 * servings + fat * 9 * servings
    );
    const fiber = nutritionPath.fiber;
    const sugar = nutritionPath.sugar;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.main}>
          <View style={styles.mainContainer}>
            <Text style={styles.header}>{apiSearchItem.food_name}</Text>
            <Picker
              itemStyle={[styles.picker, { color: globalStyles.fontColor }]}
              selectedValue={selected}
              onValueChange={(itemValue, nutrientIndex) => {
                this.setState({
                  selected: itemValue
                });
              }}
            >
              {this.renderMeasurements()}
            </Picker>
            <View style={styles.servingsContainer}>
              <Text style={styles.servingsText}>Servings: </Text>
              <TextInput
                autoFocus={true}
                style={styles.servingsNumberInput}
                value={String(servings)}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={globalStyles.placeHolderTextColor}
                maxLength={5}
                onChangeText={s => this.setState({ servings: s })}
              />
              <Text style={styles.measurement}>
                {Number(parseInt(servingSize * 10) / 10) * servings
                  ? String(parseInt(servingSize * 10) / 10) * servings
                  : "0"}{" "}
                {measurement}
              </Text>
            </View>
            <View style={styles.nutrientsContainer}>
              <View style={styles.macroContainer}>
                {this.renderNutrient(fat, "fat", globalStyles.fatFontColor)}
                {this.renderNutrient(
                  protein,
                  "protein",
                  globalStyles.proteinColor
                )}
                {this.renderNutrient(
                  carbs,
                  "carbs",
                  globalStyles.carbsFontColor
                )}
              </View>
              <View style={styles.miscContainer}>
                {trackingSettings.trackFiber
                  ? this.renderNutrient(fiber, "fiber")
                  : null}
                {trackingSettings.trackSugar
                  ? this.renderNutrient(sugar, "sugar")
                  : null}
              </View>
            </View>
            <Text style={styles.calorieCount}>Calories: {calorieCount}</Text>
          </View>
          <TouchableOpacity
            style={styles.submit}
            onPress={() =>
              this.handleSubmit(
                protein,
                carbs,
                fat,
                fiber,
                sugar,
                measurement,
                apiSearchItem.food_name,
                servingSize
              )
            }
          >
            <Text style={styles.submitText}>Enter</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
const styles = StyleSheet.create({
  main: {
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, .5)"
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 10,
    padding: 10
  },
  header: {
    fontSize: 24,
    width: "100%",
    color: globalStyles.fontColor,
    alignSelf: "center",
    textAlign: "center"
  },
  picker: {
    marginBottom: "-6%",
    marginTop: "-6%",
    // height: '20%',
    zIndex: -5
  },
  nutrientsContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around"
    // padding: 10,
  },
  macroContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around"
    // padding: 10,
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
    alignSelf: "center",
    color: globalStyles.fontColor,
    marginTop: "1%"
  },
  macroInt: {
    alignSelf: "center",
    marginTop: 10,
    width: 80,
    height: 35,
    color: globalStyles.fontColor,
    textAlign: "center"
  },
  calorieCount: {
    marginBottom: 2.5,
    textAlign: "center",
    color: globalStyles.fontColor,
    width: "100%"
  },
  servingsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: 10
  },
  servingsText: {
    fontSize: 18,
    padding: 10,
    color: globalStyles.fontColor,
    alignSelf: "center",
    width: "40%",
    textAlign: "right"
  },
  servingsNumberInput: {
    alignSelf: "center",
    borderBottomColor: globalStyles.colors.four,
    borderBottomWidth: 2,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    width: "20%",
    height: 40,
    color: globalStyles.fontColor,
    textAlign: "center"
  },
  measurement: {
    alignSelf: "center",
    color: globalStyles.fontColor,
    marginLeft: 10,
    width: "40%"
  },
  submit: {
    marginLeft: "auto",
    marginRight: "auto",
    padding: 20,
    backgroundColor: globalStyles.buttonColor,
    width: "50%"
  },
  submitText: {
    textAlign: "center",
    color: globalStyles.buttonTextColor,
    fontSize: 18
  }
});

const mapStateToProps = state => {
  return {
    quickAdd: state.appState.quickAdd,
    item: state.appState.targetItem,
    date: state.appState.date,
    data: state.dataReducer.data
  };
};

export default connect(mapStateToProps)(AddFatSecretItem);
