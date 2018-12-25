import React from 'react';
import { AppRegistry, StyleSheet, Text, View, AsyncStorage, ImageBackground } from 'react-native';
import { Provider } from 'react-redux';
import Header from './components/global/Header/';
import Footer from './components/global/Footer/';
import HomeSwitch from './components/Homeswitch';
import store from './store';
import { saveData } from './actions/data';
import wood_resized from './images/wood_resized.jpg';

export default class App extends React.Component {

  componentDidMount() {
    this.retrieveData();
  }

  retrieveData = async () => {
    try {
        const data = await AsyncStorage.getItem('data');
        store.dispatch(saveData(JSON.parse(data)));
        return JSON.parse(data);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  
  render() {

    return (
      <Provider store={store}>
        <ImageBackground source={wood_resized} style={styles.imageBackground}>
          <View style={styles.mainContainer}> 
            <Header/>
            <HomeSwitch/>
          </View>
        <Footer/>
        </ImageBackground>
      </Provider>
    );
  }
}
const styles = StyleSheet.create({
    imageBackground: {
      flex: 1,
      width: null,
      height: null,
      resizeMode: 'cover',
  },
  mainContainer: {
    height: '89%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});