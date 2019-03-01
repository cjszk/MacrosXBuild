import React from "react";
import { connect } from "react-redux";
import { View, TouchableOpacity, Text } from "react-native";

class AdFree extends React.Component {
  render() {
    return (
      <View style={styles.main}>
        <Text style={styles.header}>Version 1.02</Text>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            Thank you for using MacrosX. I've invested much time into creating
            this simple clutter-free macronutrient tracking application for
            flexible dieters. While this application is still in its early
            development stages, there is much more planned and coming! If you
            like MacrosX please do leave a 5-star review in the app store and
            tell your friends!
          </Text>
        </View>
        <Text style={styles.text}>Plans for future versions:</Text>
        <Text style={styles.text}>
          1. Barcode Scanner and Enhanced Food Database.
        </Text>
        <Text style={styles.text}>2. Improved Graphs and Tracking</Text>
        <Text style={styles.text}>3. Intermittent Fasting Timer/Lock</Text>
        <View style={styles.feedbackView}>
          <Text style={styles.feedback}>Feedback? Ideas? Bugs to report?</Text>
          <Text style={styles.feedback}>Email: MacrosXDev@gmail.com</Text>
        </View>
      </View>
    );
  }
}

const styles = {
  main: {
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, .5)",
    display: "flex",
    flexDirection: "column"
  },
  header: {
    textAlign: "center",
    fontSize: 32,
    color: globalStyles.fontColor,
    marginTop: "5%",
    marginBottom: "10%"
  },
  description: {
    color: globalStyles.fontColor,
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: "5%",
    marginBottom: "20%",
    fontSize: 18
  },
  text: {
    marginLeft: "5%",
    marginRight: "5%",
    color: globalStyles.fontColor
  },
  feedbackView: {
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: "5%"
  },
  feedback: {
    textAlign: "center",
    color: globalStyles.fontColor
  },
  button: {
    alignSelf: "center",
    backgroundColor: globalStyles.buttonColor,
    width: "75%",
    padding: 10,
    marginTop: 20,
    marginBottom: 20
  },
  buttonText: {
    fontSize: 32,
    textAlign: "center",
    color: globalStyles.buttonTextColor
  }
};

const mapStateToProps = state => {
  return {
    tab: state.appState.tab,
    date: state.appState.date,
    data: state.dataReducer.data
  };
};

export default connect(mapStateToProps)(AdFree);
