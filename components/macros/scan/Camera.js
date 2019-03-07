"use strict";
import React, { Component } from "react";
import { connect } from "react-redux";
import { AppRegistry, StyleSheet, View } from "react-native";
import { stringify } from "query-string";
import hmacsha1 from "hmacsha1";
import { RNCamera } from "react-native-camera";
import {
  API_PATH,
  ACCESS_KEY,
  APP_SECRET,
  OAUTH_VERSION,
  OAUTH_SIGNATURE_METHOD
} from "../keys";
import { addFatSecretItem } from "../../../actions/appState";

class Camera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      found: false
    };
  }
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

  async getFoodInfo(data) {
    const methodParams = {
      method: "food.find_id_for_barcode",
      barcode: data
    };
    await this.makeApiCall(methodParams)
      .then(res => res.json())
      .then(res => {
        if (res.food_id.value) {
          const food = { food_id: res.food_id.value };
          this.props.dispatch(addFatSecretItem(food));
        } else {
          alert(
            "Item with this barcode not found in Fat Secret's database! ='("
          );
        }
      });
  }

  render() {
    const { found } = this.state;
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          permissionDialogTitle={"Permission to use camera"}
          permissionDialogMessage={
            "We need your permission to use your camera phone"
          }
          onBarCodeRead={({ data }) => {
            if (!found) {
              console.log(data);
              this.getFoodInfo(data);
              this.setState({ found: true });
            }
          }}
          // for android:
          //   onGoogleVisionBarcodesDetected={({ barcodes }) => {
          //     console.log(barcodes);
          //   }}
        />
        <View style={{ borderWidth: 5, borderColor: 'red', width: 300, height: 200, position: 'absolute', alignSelf: 'center', marginTop: '50%'}}/>
      </View>
    );
  }

  takePicture = async function() {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black"
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  capture: {
    flex: 0,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: "center",
    margin: 20
  }
});

AppRegistry.registerComponent("Camera", () => Camera);

const mapStateToProps = state => {
  return {
    quickAdd: state.appState.quickAdd,
    library: state.dataReducer.data.library,
    data: state.dataReducer.data
  };
};

export default connect(mapStateToProps)(Camera);
