import React from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, StyleSheet, Text, View, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback, Picker } from 'react-native';
import { toggleTab } from '../../../actions/appState';
import globalStyles from '../../../globalStyles';

class AddItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nutrients: this.props.item.nutrients,
            nutrientIndex: this.props.item.nutrients[0].measures.length-1,
            servings: '',
            servingSize: this.props.item.nutrients[0].measures[0].qty,
            measurement: this.props.item.nutrients[0].measures[0].label,
            equivalent: 100,
            proteinPerGram: 0,
            carbsPerGram: 0,
            fatPerGram: 0,
            fiberPerGram: 0,
            sugarPerGram: 0,
        }
    }

    renderNutrient(macro, key, color=globalStyles.placeHolderTextColor) {
        const title = key.split('')[0].toUpperCase() + key.split('').slice(1).join('');
        let { servings } = this.state;
        if (!servings) servings = 0;
        const amount = Number(parseInt(macro * servings)) ? String(parseInt(macro * servings)) : 0;
        return (
        <View style={styles.macro}>
            <Text style={[styles.macroText, {color}]}>{title}</Text>
            <Text style={[styles.macroInt, {color}]}>{amount} grams</Text>
        </View>
        )
    }

    handleParseInt = (macro) => parseInt(macro) ? parseInt(macro) : 0;

    handleSubmit = async (protein, carbs, fat, fiber, sugar) => {
        const { item, date, data } = this.props;
        const { servings, measurement } = this.state;
        let { servingSize } = this.state;
        const name = item.desc.name;
        protein = this.handleParseInt(protein); carbs = this.handleParseInt(carbs); fat = this.handleParseInt(fat);
        fiber = this.handleParseInt(fiber); sugar = this.handleParseInt(sugar); servingSize = this.handleParseInt(servingSize);
        const newEntry = { name, protein, carbs, fat, fiber, sugar, servings, measurement, date, servingSize };
        const newLibraryEntry = { name, protein, carbs, fat, fiber, sugar, date, servingSize, measurement }
        // Copy of data.entries - add new entry
        const newEntries = data.entries.slice();
        const newLibraryEntries = data.library.slice();
        newEntries.push(newEntry);
        newLibraryEntries.push(newLibraryEntry);
        // Copy of data - replace with new entries
        let newData = data;
        newData.entries = newEntries;
        newData.library = newLibraryEntries;
        try {
          await AsyncStorage.setItem('data', JSON.stringify(newData));
          this.props.dispatch(toggleTab('home'))
        } catch (error) {
          console.error(error);
        }
    }

    componentDidMount() {
        const { item } = this.props;
        item.nutrients.forEach((nutrient) => {
            if (nutrient.measures.length === 0) return null;
            if (nutrient.name === "Protein") this.setState({proteinPerGram: (nutrient.measures[0].value / nutrient.measures[0].eqv)});
            if (nutrient.name === "Carbohydrate, by difference") this.setState({carbsPerGram: (nutrient.measures[0].value / nutrient.measures[0].eqv)});
            if (nutrient.name === "Total lipid (fat)") this.setState({fatPerGram: (nutrient.measures[0].value / nutrient.measures[0].eqv)});
            if (nutrient.name === "Fiber, total dietary)") this.setState({fiberPerGram: (nutrient.measures[0].value / nutrient.measures[0].eqv)});
            if (nutrient.name === "Sugars, total") this.setState({sugarPerGram: (nutrient.measures[0].value / nutrient.measures[0].eqv)});
        });

    }

    renderMeasurements() {
        const { nutrients } = this.state;
        return nutrients[0].measures.map((m) => 
                <Picker.Item key={`${m.qty} ${m.label}`} label={`${m.qty} ${m.label}`} value={`${m.qty} ${m.label.split(' ').join('-')} ${m.eqv}`}/>
        );
    }

    render() {
        const { servings, servingSize, measurement, 
            selected, proteinPerGram, carbsPerGram, fatPerGram, fiberPerGram, sugarPerGram, equivalent } = this.state;
        const { item } = this.props;
        const { trackingSettings } = this.props.data.settings;
        const protein = proteinPerGram * equivalent;
        const fat = fatPerGram * equivalent;
        const carbs = carbsPerGram * equivalent;
        const fiber = fiberPerGram ? fiberPerGram * equivalent : 0;
        const sugar = sugarPerGram ? sugarPerGram * equivalent : 0;
        const renderServingSize = servings? parseInt(servings * servingSize * 10)/10 : 0;
        const calorieCount = parseInt((protein * 4 * servings) + (carbs * 4 * servings) + (fat * 9 * servings));

        return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.main}>
                <View style={styles.mainContainer}>
                    <Text style={styles.header}>{item.desc.name}</Text>
                    <Picker itemStyle={[styles.picker,{color: globalStyles.fontColor}]} selectedValue={selected} 
                    onValueChange={(itemValue, nutrientIndex) => {
                        this.setState({selected: itemValue, servingSize: itemValue.split(' ')[0], measurement: itemValue.split(' ')[1], equivalent: itemValue.split(' ')[2], nutrientIndex})}
                    }
                        >
                        {this.renderMeasurements()}
                        <Picker.Item key="100 grams" label="100 grams" value="100 grams 100"/>
                    </Picker>
                    <View style={styles.servingsContainer}>
                        <Text style={styles.servingsText}>Servings: </Text>
                        <TextInput
                            autoFocus={true}
                            style={styles.servingsNumberInput}
                            value={String(servings)}
                            keyboardType='numeric'
                            placeholder='0'
                            placeholderTextColor={globalStyles.placeHolderTextColor}
                            maxLength={5}
                            onChangeText={(s) => this.setState({servings: s})}
                        />
                        <Text style={styles.measurement}>{Number(parseInt(renderServingSize*10)/10) ? String(parseInt(renderServingSize*10)/10) : '0'} {measurement.split('-').join(' ')}</Text>
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
                <TouchableOpacity style={styles.submit}onPress={() => this.handleSubmit(protein, carbs, fat, fiber, sugar)}>
                    <Text style={styles.submitText}>Enter</Text>
                </TouchableOpacity>
            </View>
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
        fontSize: 18,
        width: '100%',
        color: globalStyles.fontColor,
        alignSelf: 'center',
    },
    picker: {
        marginBottom: '-6%',
        marginTop: '-6%',
        // height: '20%',
        zIndex: -5,
    }, 
    nutrientsContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        // padding: 10,
    },
    macroContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        // padding: 10,
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
        color: globalStyles.fontColor,
        textAlign: 'center',

    },
    measurement: {
        alignSelf: 'center',
        color: globalStyles.fontColor,
        marginLeft: 10,
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