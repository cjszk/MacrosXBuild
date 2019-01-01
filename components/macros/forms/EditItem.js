import React from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, Text, View, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon } from 'react-native-elements';
import { toggleTab } from '../../../actions/appState';
import globalStyles from '../../../globalStyles';

class NewItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.item.name,
            protein: this.props.item.protein,
            carbs: this.props.item.carbs,
            fat: this.props.item.fat,
            fiber: this.props.item.fiber,
            sugar: this.props.item.sugar,
            servingSize: this.props.item.servingSize,
            measurement: this.props.item.measurement,
        }
    }

    renderNutrient(key, borderBottomColor=globalStyles.colors.four) {
        const title = key.split('')[0].toUpperCase() + key.split('').slice(1).join('');
        const macroValue = this.state[key];
        return (
        <View style={styles.macro}>
            <Text style={[styles.macroText,borderBottomColor === globalStyles.colors.four ? {color: globalStyles.placeHolderTextColor} : {color: borderBottomColor}]}>{title}</Text>
            <TextInput
                value={String(macroValue)}
                style={[styles.macroInput, {borderBottomColor}]}
                keyboardType='numeric'
                maxLength={5}
                onChangeText={(n) => this.setState({[key]: n})}/>
        </View>
        )
    }

    deleteItem = async () => {
        const { item, data } = this.props;
        let newData = data;
        const newEntries = newData.library.filter((i) => {
            if (i !== item) return i;
        })
        newData.library = newEntries;
        try {
          await AsyncStorage.setItem('data', JSON.stringify(newData));
          this.props.dispatch(toggleTab('library'))
        } catch (error) {
          console.error(error);
        }
    }

    handleParseInt = (macro) => parseInt(macro) ? parseInt(macro) : 0;
    
    handleSubmit = async () => {
        let { name, measurement } = this.state;
        const { date, item } = this.props;
        if (!name.length) return alert('Please name this item');
        if (!measurement.length) return alert('Please give a measurement type: Example: grams, ml');
        let { protein, carbs, fat, fiber, sugar, servingSize } = this.state;
        protein = this.handleParseInt(protein); carbs = this.handleParseInt(carbs); fat = this.handleParseInt(fat);
        fiber = this.handleParseInt(fiber); sugar = this.handleParseInt(sugar); servingSize = this.handleParseInt(servingSize);
        const { data } = this.props;
        const newEntry = { name, protein, carbs, fat, fiber, sugar, servingSize, measurement, date };
        const newEntries = data.library.slice();
        let newData = data;
        newData.library = newEntries.map((i) => {
            if (i === item) return newEntry;
            return i;
        });;
        try {
          await AsyncStorage.setItem('data', JSON.stringify(newData));
          this.props.dispatch(toggleTab('library'))
        } catch (error) {
          console.error(error);
        }
    }

    render() {
        const { name, servingSize, measurement, protein, carbs, fat } = this.state;
        const { trackingSettings } = this.props.data.settings;
        const calorieCount = parseInt((protein * 4) + (carbs * 4) + (fat * 9));
        return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAwareScrollView style={styles.main} extraScrollHeight={100}>
                <View style={styles.mainContainer}>
                    <Text style={styles.header}>{name}</Text>
                    <View style={styles.nameView}>
                        <Text style={styles.nameText}>Name: </Text>
                        <TextInput
                            value={name}
                            onChangeText={(e) => this.setState({name: e})}
                            style={styles.nameInput}
                            placeholder="Name (required)"
                        />
                    </View>
                    <View style={styles.nutrientsContainer}>
                        <View style={styles.macroContainer}>
                            {this.renderNutrient('fat', globalStyles.fatFontColor)}
                            {this.renderNutrient('protein', globalStyles.proteinColor)}
                            {this.renderNutrient('carbs', globalStyles.carbsFontColor)}
                        </View>
                        <View style={styles.miscContainer}>
                            {trackingSettings.trackFiber ? this.renderNutrient('fiber') : null}
                            {trackingSettings.trackSugar ? this.renderNutrient('sugar') : null}
                        </View>
                    </View>
                    <Text style={styles.calorieCount}>Calories: {calorieCount}</Text>
                    <View style={styles.servingsContainer}>
                        <Text style={styles.servingsText}>Serving Size: </Text>
                        <TextInput
                            style={styles.servingsNumberInput}
                            value={String(servingSize)}
                            keyboardType='numeric'
                            maxLength={5}
                            onChangeText={(s) => this.setState({servingSize: s})}
                            />
                        <TextInput
                            value={measurement.toLowerCase()}
                            style={styles.servingsMeasurementInput}
                            placeholder="Ex: grams..."
                            onChangeText={(m) => this.setState({measurement: m})}
                            />
                    </View>
                </View>
                <View style={styles.buttons}>
                    <TouchableOpacity style={styles.delete}onPress={() => this.deleteItem()}>
                        <Icon name='trash' type='entypo' size={60} color={globalStyles.iconColor}/>
                    </TouchableOpacity>
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
        fontSize: 18,
        color: globalStyles.fontColor,
        alignSelf: 'center'
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
        color: globalStyles.fontColor,
        width: '30%'
    },
    nameInput: {
        borderBottomColor: globalStyles.colors.four,
        borderBottomWidth: 2,
        padding: 10,
        marginTop: 10,
        color: globalStyles.fontColor,
        width: '70%'
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
        color: globalStyles.fontColor,
        alignSelf: 'center',
    },
    macroInput: {
        borderBottomColor: globalStyles.colors.four,
        borderBottomWidth: 2,
        marginBottom: 30,
        marginTop: 10,
        width: 60,
        height: 40,
        textAlign: 'center',
        marginLeft: 'auto',
        color: globalStyles.fontColor,
        marginRight: 'auto',
    },
    calorieCount: {
        marginTop: 2.5,
        marginBottom: 2.5,
        textAlign: 'center',
        color: globalStyles.fontColor,
        width: '100%',
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
        color: globalStyles.fontColor,
        alignSelf: 'center'
    },
    servingsNumberInput: {
        alignSelf: 'center',
        borderBottomColor: globalStyles.colors.four,
        borderBottomWidth: 2,
        marginLeft: 5,
        marginRight: 5,
        width: 60,
        height: '80%',
        color: globalStyles.fontColor,
        textAlign: 'center',
    },
    servingsSizeInput: {
        alignSelf: 'center',
        borderBottomColor: globalStyles.colors.four,
        borderBottomWidth: 2,
        marginLeft: 5,
        marginRight: 5,
        width: 60,
        height: '80%',
        color: globalStyles.fontColor,
        textAlign: 'center',

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
        color: globalStyles.fontColor,
        width: 120,
    },
    submitContainer: {
        height: '15%',
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
    },
    delete: {
        width: '33%',
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
        color: globalStyles.buttonTextColor,
        fontSize: 18,
    },
}

const mapStateToProps = state => {
    return {
        quickAdd: state.appState.quickAdd,
        date: state.appState.date,
        data: state.dataReducer.data,
        item: state.appState.targetItem,
    }
}

export default connect(mapStateToProps)(NewItem);