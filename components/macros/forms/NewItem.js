import React from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, Text, View, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { toggleTab } from '../../../actions/appState';
import globalStyles from '../../../globalStyles';

class NewItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            protein: '',
            carbs: '',
            fat: '',
            fiber: '',
            sugar: '',
            servingSize: '',
            measurement: '',
        }
    }

    renderNutrient(macro, key, optional=null, borderBottomColor=globalStyles.colors.four) {
        let optionalStyle;
        if (optional) optionalStyle = {color: globalStyles.placeHolderTextColor};
        else optionalStyle = {color: borderBottomColor};
        const title = key.split('')[0].toUpperCase() + key.split('').slice(1).join('');
        const macroValue = this.state[key];
        return (
        <View style={styles.macro}>
            <Text style={[styles.macroText, optionalStyle]}>{title} {optional}</Text>
            <TextInput
                value={String(macroValue)}
                style={[styles.macroInput, {borderBottomColor}]}
                keyboardType='numeric'
                maxLength={3}
                placeholderTextColor={globalStyles.placeHolderTextColor}
                placeholder='0'
                onChangeText={(n) => {
                    this.setState({[key]: n})
                }}/>
        </View>
        )
    }

    handleParseInt = (macro) => parseInt(macro) ? parseInt(macro) : 0;

    handleSubmit = async () => {
        let { name, measurement } = this.state;
        let { date } = this.props;
        if (!name.length) return alert('Please name this item');
        if (!measurement.length) return alert('Please give a measurement type: Example: grams, ml');
        let { protein, carbs, fat, fiber, sugar, servingSize } = this.state;
        protein = this.handleParseInt(protein); carbs = this.handleParseInt(carbs); fat = this.handleParseInt(fat);
        fiber = this.handleParseInt(fiber); sugar = this.handleParseInt(sugar); servingSize = this.handleParseInt(servingSize);
        const { data } = this.props;
        const newEntry = { name, protein, carbs, fat, fiber, sugar, servingSize, measurement, date };
        // Copy of data.entries - add new entry
        const newEntries = data.library.slice();
        newEntries.push(newEntry);
        // Copy of data - replace with new entries
        let newData = data;
        newData.library = newEntries;
        try {
          await AsyncStorage.setItem('data', JSON.stringify(newData));
          this.props.dispatch(toggleTab('library'))
        } catch (error) {
          console.error(error);
        }
    }

    render() {
        const { name, protein, carbs, fat, fiber, sugar, servingSize, measurement } = this.state;
        const { trackingSettings } = this.props.data.settings;
        const calorieCount = parseInt((protein * 4) + (carbs * 4) + (fat * 9));
        return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAwareScrollView style={styles.main} extraScrollHeight={100}>
                <View style={styles.mainContainer}>
                    <Text style={styles.header}>New Food Item</Text>
                    <View style={styles.nameView}>
                        <Text style={styles.nameText}>Name: </Text>
                        <TextInput
                            value={name}
                            onChangeText={(e) => this.setState({name: e})}
                            style={styles.nameInput}
                            placeholderTextColor={globalStyles.placeHolderTextColor}
                            placeholder="Name (required)"
                        />
                    </View>
                    <View style={styles.nutrientsContainer}>
                        <View style={styles.macroContainer}>
                            {this.renderNutrient(fat, 'fat', null, globalStyles.fatFontColor)}
                            {this.renderNutrient(protein, 'protein', null, globalStyles.proteinColor)}
                            {this.renderNutrient(carbs, 'carbs', null, globalStyles.carbsFontColor)}
                        </View>
                        <View style={styles.miscContainer}>
                            {trackingSettings.trackFiber ? this.renderNutrient(fiber, 'fiber', '(optional)') : null}
                            {trackingSettings.trackSugar ? this.renderNutrient(sugar, 'sugar', '(optional)') : null}
                        </View>
                    </View>
                    <Text style={styles.calorieCount}>Calories: {calorieCount}</Text>
                    <View style={styles.servingsContainer}>
                        <Text style={styles.servingsText}>Serving Size: </Text>
                        <TextInput
                            style={styles.servingsNumberInput}
                            value={String(servingSize)}
                            keyboardType='numeric'
                            placeholderTextColor={globalStyles.placeHolderTextColor}
                            placeholder='1'
                            maxLength={4}
                            onChangeText={(s) => {
                                this.setState({servingSize: s})
                            }}
                            />
                        <TextInput
                            value={measurement.toLowerCase()}
                            style={styles.servingsMeasurementInput}
                            placeholderTextColor={globalStyles.placeHolderTextColor}
                            placeholder="Ex: grams..."
                            onChangeText={(m) => this.setState({measurement: m})}
                            />
                    </View>
                </View>
                <View style={styles.submitContainer}>
                    <TouchableOpacity style={styles.submit}onPress={() => this.handleSubmit()}>
                        <Text style={styles.submitText}>Enter</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
        )
    }
}
const styles = {
    main: {
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, .5)',
    },
    mainContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 10,
    },
    header: {
        fontSize: 32,
        alignSelf: 'center',
        color: globalStyles.fontColor,
    },
    nameView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    nameText: {
        fontSize: 18,
        padding: 10,
        width: '30%',
        color: globalStyles.fontColor,
    },
    nameInput: {
        borderBottomColor: globalStyles.colors.four,
        borderBottomWidth: 2,
        padding: 10,
        marginTop: 10,
        width: '70%',
        color: globalStyles.fontColor,

    },
    nutrientsContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        height: '49.25%',
    },
    macroContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    miscContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    macro: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    macroText: {
        textAlign: 'center',
        alignSelf: 'center',
        color: globalStyles.fontColor,
    },
    macroInput: {
        borderBottomWidth: 2,
        marginBottom: 30,
        marginTop: 10,
        width: 60,
        height: 40,
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        color: globalStyles.fontColor,
    },
    calorieCount: {
        marginTop: 2.5,
        marginBottom: 2.5,
        textAlign: 'center',
        width: '100%',
        color: globalStyles.fontColor,
    },
    servingsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        height: '20%'
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
        marginLeft: 5,
        marginRight: 5,
        width: 60,
        height: '80%',
        textAlign: 'center',
        color: globalStyles.fontColor,
    },
    servingsSizeInput: {
        alignSelf: 'center',
        borderBottomColor: globalStyles.colors.four,
        borderBottomWidth: 2,
        marginLeft: 5,
        marginRight: 5,
        width: 60,
        height: '80%',
        textAlign: 'center',
        color: globalStyles.fontColor,

    },
    servingsMeasurementInput: {
        alignSelf: 'center',
        borderBottomColor: globalStyles.colors.four,
        borderBottomWidth: 2,
        paddingRight: 10,
        paddingLeft: 10,
        marginLeft: 5,
        marginRight: 5,
        height: '80%',
        width: 120,
        color: globalStyles.fontColor,
    },
    submitContainer: {
        height: '15%',
    },
    submit: {
        marginLeft: 'auto',
        marginRight: 'auto',
        // padding: 20,
        justifyContent: 'space-around',
        height: 60,
        width: '50%',
        backgroundColor: globalStyles.buttonColor

    },
    submitText: {
        textAlign: 'center',
        color: globalStyles.buttonTextColor,
        fontSize: 18
    }
}

const mapStateToProps = state => {
    return {
        quickAdd: state.appState.quickAdd,
        date: state.appState.date,
        data: state.dataReducer.data,
    }
}

export default connect(mapStateToProps)(NewItem);