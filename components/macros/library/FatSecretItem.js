import React from "react";
import { connect } from "react-redux";
import { Text, View, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import globalStyles from "../../../globalStyles";
import { addFatSecretItem } from "../../../actions/appState";

class FatSecretItem extends React.Component {
  render() {
    const { item } = this.props;

    return (
      <View key={item.date} style={styles.main}>
        <View style={styles.name}>
          {item.brand_name ? <Text style={{color: '#aaa', textDecorationLine: 'underline'}}>{item.brand_name}</Text> : null}
          <Text style={styles.nameText}>
            {item.food_name.length > 30
              ? item.food_name
                  .split("")
                  .slice(0, 30)
                  .join("") + "..."
              : item.food_name}
          </Text>
        </View>
        {/* <View style={styles.macros}>
                    <Text style={[styles.macronutrient, {
                        color: globalStyles.fatFontColor,
                    }]}>{parseInt((item.fat)*10)/10}g</Text>
                    <Text style={[styles.macronutrient, {
                        color: globalStyles.proteinColor,
                    }]}>{parseInt((item.protein)*10)/10}g</Text>
                    <Text style={[styles.macronutrient, {
                        color: globalStyles.carbsFontColor,
                    }]}>{parseInt((item.carbs)*10)/10}g</Text>
                </View> */}
        <View style={styles.buttonsView}>
          <TouchableOpacity
            style={styles.icons}
            onPress={() => this.props.dispatch(addFatSecretItem(item))}
          >
            <Icon
              name="add"
              type="antdesign"
              size={35}
              color={globalStyles.colors.listIcon}
            />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.icons} onPress={() => this.props.dispatch(editLibraryItem(item))}>
                        <Icon
                            name="edit"
                            type="antdesign"
                            size={35}
                            color={globalStyles.colors.listIcon}
                        />
                    </TouchableOpacity> */}
        </View>
      </View>
    );
  }
}

const styles = {
  main: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    height: 70,
    borderWidth: 0.5,
    borderColor: globalStyles.colors.four,
    backgroundColor: "rgba(0, 0, 0, .5)"
  },
  name: {
    width: "40%"
  },
  nameText: {
    fontSize: 14,
    color: globalStyles.fontColor
  },
  servingSizeText: {
    fontSize: 12,
    color: globalStyles.fontColor
  },
  macros: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    width: "35%"
  },
  macronutrient: {
    paddingTop: "20%",
    width: 40,
    height: "100%"
  },
  buttonsView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "25%"
  }
};

const mapStateToProps = state => {
  return {
    quickAdd: state.appState.quickAdd,
    library: state.dataReducer.data.library
  };
};

export default connect(mapStateToProps)(FatSecretItem);
