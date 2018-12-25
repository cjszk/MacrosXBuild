import React from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, Text, View, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Icon } from 'react-native-elements';
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
            servings: this.props.item.servings,
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
        );
    }

    deleteItem = async () => {
        const { item, data } = this.props;
        let newData = data;
        const newEntries = newData.entries.filter((i) => {
            if (i !== item) return i;
        })
        newData.entries = newEntries;
        try {
          await AsyncStorage.setItem('data', JSON.stringify(newData));
          this.props.dispatch(toggleTab('home'))
        } catch (error) {
          console.error(error);
        }
    }

    handleParseInt = (macro) => parseInt(macro) ? parseInt(macro) : 0;

    handleSubmit = async () => {
        const { item, date, data } = this.props;
        const { servings } = this.state;
        let { protein, carbs, fat, fiber, sugar, measurement, name, servingSize } = item;
        protein = this.handleParseInt(protein); carbs = this.handleParseInt(carbs); fat = this.handleParseInt(fat);
        fiber = this.handleParseInt(fiber); sugar = this.handleParseInt(sugar); servingSize = this.handleParseInt(servingSize);
        const newEntry = { name, protein, carbs, fat, fiber, sugar, servings, measurement, date, servingSize };
        let newData = data;
        const newEntries = newData.entries.map((i) => {
            if (i === item) return newEntry;
            return i;
        })
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
        const renderServingSize = servings? parseInt(servings * servingSize * 10)/10 : 0;

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
                            maxLength={4}
                            keyboardType='numeric'
                            onChangeText={(s) => this.setState({servings: s})}
                            />
                        <Text style={styles.measurement}>{Number(parseInt(renderServingSize*10)/10) ? String(parseInt(renderServingSize*10)/10) : '0'} {measurement}</Text>
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
        marginTop: 10,
        padding: 10,
    },
    header: {
        fontSize: 18,
        width: '100%',
        color: globalStyles.fontColor,
        alignSelf: 'center',
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
        justifyContent: 'space-around'
    },
    macroText: {
        alignSelf: 'center',
        color: globalStyles.fontColor,
        marginTop: '1%',
    },
    macroInt: {
        alignSelf: 'center',
        marginTop: 10,
        width: 80,
        height: 35,
        color: globalStyles.fontColor,
        textAlign: 'center',
    },
    calorieCount: {
        marginTop: 2.5,
        marginBottom: 42.5,
        textAlign: 'center',
        color: globalStyles.fontColor,
        width: '100%',
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
        color: globalStyles.fontColor,
        alignSelf: 'center'
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
        color: globalStyles.fontColor,

    },
    measurement: {
        alignSelf: 'center',
        color: globalStyles.fontColor,
        marginLeft: 10,
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
        fontSize: 18
    },
}

const mapStateToProps = state => {
    return {
        quickAdd: state.appState.quickAdd,
        item: state.appState.targetItem,
        date: state.appState.date,
        data: state.dataReducer.data,
    }
}

export default connect(mapStateToProps)(AddItem);