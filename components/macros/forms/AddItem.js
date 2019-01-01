import React from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, StyleSheet, Text, View, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { toggleTab } from '../../../actions/appState';
import globalStyles from '../../../globalStyles';

class AddItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            protein: '',
            carbs: '',
            fat: '',
            fiber: '',
            sugar: '',
            servings: '',
            measurement: '',
        }
    }

    renderNutrient(macro, key, color=globalStyles.placeHolderTextColor) {
        const title = key.split('')[0].toUpperCase() + key.split('').slice(1).join('');
        const { servings } = this.state;
        const amount = Number(parseInt(macro * servings)) ? String(parseInt(macro * servings)) : 0;
        return (
        <View style={styles.macro}>
            <Text style={[styles.macroText, {color}]}>{title}</Text>
            <Text style={[styles.macroInt, {color}]}>{amount} grams</Text>
        </View>
        )
    }

    handleParseInt = (macro) => parseInt(macro) ? parseInt(macro) : 0;

    handleSubmit = async () => {
        const { item, date, data } = this.props;
        const { servings } = this.state;
        let { protein, carbs, fat, fiber, sugar, measurement, name, servingSize } = item;
        protein = this.handleParseInt(protein); carbs = this.handleParseInt(carbs); fat = this.handleParseInt(fat);
        fiber = this.handleParseInt(fiber); sugar = this.handleParseInt(sugar); servingSize = this.handleParseInt(servingSize);
        const newEntry = { name, protein, carbs, fat, fiber, sugar, servings, measurement, date, servingSize };
        // Copy of data.entries - add new entry
        const newEntries = data.entries.slice();
        newEntries.push(newEntry);
        // Copy of data - replace with new entries
        let newData = data;
        newData.entries = newEntries;
        try {
          await AsyncStorage.setItem('data', JSON.stringify(newData));
          this.props.dispatch(toggleTab('home'))
        } catch (error) {
          console.error(error);
        }
    }

    render() {
        const { servings } = this.state;
        const { item } = this.props;
        const { trackingSettings } = this.props.data.settings;
        const { protein, carbs, fat, fiber, sugar, measurement, name, servingSize } = item;
        const calorieCount = parseInt((protein * 4 * servings) + (carbs * 4 * servings) + (fat * 9 * servings));

        return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAwareScrollView style={styles.main} extraScrollHeight={100}>
                <View style={styles.mainContainer}>
                    <Text style={styles.header}>{name}</Text>
                    <View style={styles.servingsContainer}>
                        <Text style={styles.servingsText}>Servings: </Text>
                        <TextInput
                            autoFocus={true}
                            style={styles.servingsNumberInput}
                            value={String(servings)}
                            keyboardType='numeric'
                            placeholder='0'
                            maxLength={5}
                            onChangeText={(s) => this.setState({servings: s})}
                            />
                        <Text style={styles.measurement}>{Number(parseInt(servingSize * servings*10)/10) ? String(parseInt(servingSize * servings*10)/10) : '0'} {measurement}</Text>
                    </View>
                    <View style={styles.nutrientsContainer}>
                        <View style={styles.macroContainer}>
                            {this.renderNutrient(fat, 'fat', globalStyles.fatFontColor)}
                            {this.renderNutrient(protein, 'protein', globalStyles.proteinColor)}
                            {this.renderNutrient(carbs, 'carbs', globalStyles.carbsFontColor)}
                        </View>
                        <View style={styles.miscContainer}>
                            {trackingSettings.trackFiber ? this.renderNutrient(fiber, 'fiber') : null}
                            {trackingSettings.trackSugar ? this.renderNutrient(sugar, 'sugar') : null}
                        </View>
                    </View>
                    <Text style={styles.calorieCount}>Calories: {calorieCount}</Text>
                </View>
                <TouchableOpacity style={styles.submit}onPress={() => this.handleSubmit()}>
                    <Text style={styles.submitText}>Enter</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
        )
    }
}
const styles = StyleSheet.create({
    main: {
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, .5)',
    },
    mainContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 10,
        padding: 10,
    },
    header: {
        fontSize: 32,
        width: '100%',
        alignSelf: 'center',
        textAlign: 'center',
        color: globalStyles.fontColor,
    }, 
    nutrientsContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        padding: 10,
    },
    macroContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    miscContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    macro: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    macroText: {
        alignSelf: 'center',
        marginTop: '1%',
        color: globalStyles.fontColor,
    },
    macroInt: {
        alignSelf: 'center',
        marginTop: 10,
        width: 80,
        height: 35,
        textAlign: 'center',
        color: globalStyles.fontColor,
    },
    calorieCount: {
        marginTop: 2.5,
        marginBottom: 42.5,
        textAlign: 'center',
        width: '100%',
        color: globalStyles.fontColor,

    },
    servingsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
    },
    servingsText: {
        fontSize: 18,
        padding: 10,
        alignSelf: 'center',
        color: globalStyles.fontColor,

    },
    servingsNumberInput: {
        alignSelf: 'center',
        borderBottomColor: globalStyles.colors.four,
        borderBottomWidth: 2,
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
        width: 60,
        height: 40,
        textAlign: 'center',
        color: globalStyles.fontColor

    },
    measurement: {
        alignSelf: 'center',
        marginLeft: 10,
        color: globalStyles.fontColor,

    },
    submit: {
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 20,
        backgroundColor: globalStyles.buttonColor,
        width: '50%'
    },
    submitText: {
        textAlign: 'center',
        fontSize: 18,
        color: globalStyles.buttonTextColor,

    }
})

const mapStateToProps = state => {
    return {
        quickAdd: state.appState.quickAdd,
        item: state.appState.targetItem,
        date: state.appState.date,
        data: state.dataReducer.data,
    }
}

export default connect(mapStateToProps)(AddItem);