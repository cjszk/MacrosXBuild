import React from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, View, TouchableOpacity, Text, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { toggleTab } from '../actions/appState';
import { saveData } from '../actions/data';
import moment from 'moment';

class Goals extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: 'By Macros',
            protein: 0,
            carbs: 0,
            fat: 0,
            calories: 0,
            proteinP: 0,
            carbsP: 0,
            fatP: 0,
        }
    }

    renderButtons() {
        if (this.state.selected === 'By Macros') {
            return (
                <View style={styles.buttonView}>
                    <TouchableOpacity style={[styles.button, styles.selected]}>
                        <Text style={styles.buttonText}>By Macros</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => this.setState({selected: 'By Calories'})}>
                        <Text style={styles.buttonText}>By % of Calories</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return (
            <View style={styles.buttonView}>
                <TouchableOpacity style={styles.button} onPress={() => this.setState({selected: 'By Macros'})}>
                    <Text style={styles.buttonText}>By Macros</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.selected]}>
                    <Text style={styles.buttonText}>By % of Calories</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderNutrientByInt(key) {
        const title = key.split('')[0].toUpperCase() + key.split('').slice(1).join('');
        const macroValue = this.state[key];
        return (
        <View style={styles.macro}>
            <Text style={styles.macroText}>{title}</Text>
            <TextInput
                value={String(macroValue)}
                style={styles.macroInput}
                keyboardType='numeric'
                maxLength={3}
                onChangeText={(n) => {
                    if (!n.length) this.setState({[key]: 0})
                    else this.setState({[key]: parseInt(n)})
                }}/>
        </View>
        )
    };

    renderNutrientByPercent(key, amount) {
        const title = key.split('')[0].toUpperCase() + key.split('').slice(1, key.length - 1).join('');
        const macroValue = this.state[key];
        return (
        <View style={styles.macro}>
            <Text style={styles.macroText}>{title}</Text>
            <TextInput
                value={String(macroValue)}
                style={styles.macroInput}
                keyboardType='numeric'
                maxLength={3}
                onChangeText={(n) => {
                    if (!n.length) this.setState({[key]: 0})
                    else if (n > 100) this.setState({[key]: 100})
                    else this.setState({[key]: parseInt(n)})
                }}/>
            <Text style={styles.macroAmount}>{amount}g</Text>
        </View>
        )
    };

    renderByMacros() {
        const { protein, carbs, fat } = this.state;
        const calculatedCalories = (protein * 4) + (carbs * 4) + (fat * 9);
        return (
            <View style={styles.menu}>
                <View style={styles.macroRow}>
                    {this.renderNutrientByInt('fat')}
                    {this.renderNutrientByInt('protein')}
                    {this.renderNutrientByInt('carbs')}
                </View>
                <View style={styles.caloriesRow}>
                    <Text style={styles.caloriesByMacroText}>Calories: {calculatedCalories}</Text>
                </View>
            </View>
        );
    }

    renderByCalories() {
        const { proteinP, carbsP, fatP, calories } = this.state;
        const protein = Math.round((calories * (proteinP / 100)) / 4);
        const carbs = Math.round((calories * (carbsP / 100)) / 4);
        const fat = Math.round((calories * (fatP / 100)) / 9);
        return (
            <View style={styles.menu}>
                <View style={styles.caloriesRow}>
                    <View style={styles.calories}>
                        <Text style={styles.caloriesText}>Calories</Text>
                        <TextInput
                            value={String(calories)}
                            style={styles.caloriesInput}
                            keyboardType='numeric'
                            maxLength={4}
                            onChangeText={(n) => {
                                if (!n.length) this.setState({calories: 0})
                                else this.setState({calories: parseInt(n)})
                            }}/>
                    </View>
                </View>
                <View style={styles.macroRow}>
                    {this.renderNutrientByPercent('proteinP', protein)}
                    {this.renderNutrientByPercent('carbsP', carbs)}
                    {this.renderNutrientByPercent('fatP', fat)}
                </View>
                <View style={styles.showPercentView}>
                    <Text style={styles.showPercentText}>{proteinP + carbsP + fatP}%</Text>
                </View>
            </View>
        );
    }

    handleSubmit = async () => {
        const { selected } = this.state;
        let data = {
            settings: {
                trackingSettings: {
                    trackFiber: false,
                    trackSugar: false,
                }
            },
            tracking: [],
            entries: [],
            library: [
                {
                    date: moment().format(),
                    name: 'Apple',
                    protein: 0.5,
                    carbs: 25,
                    fat: 0.3,
                    fiber: 4.4,
                    sugar: 19,
                    servings: 1.0,
                    servingSize: 1,
                    measurement: 'medium'
                },
                {
                    date: moment().format(),
                    name: 'Almonds',
                    protein: 3,
                    carbs: 3,
                    fat: 6,
                    fiber: 1,
                    sugar: 0,
                    servings: 1.0,
                    servingSize: 10,
                    measurement: 'pieces'
                },
                {
                    date: moment().format(),
                    name: 'ON Gold Standard Whey Protein',
                    protein: 24,
                    carbs: 4,
                    fat: 1,
                    fiber: 0,
                    sugar: 2,
                    servings: 1.0,
                    servingSize: 31,
                    measurement: 'grams'
                },
            ],
            goals: [],
        }
        if (selected === 'By Macros') {
            const { protein, carbs, fat } = this.state;
            let calories = (protein * 4) + (carbs * 4) + (fat * 9);
            const newGoals = { protein, carbs, fat, calories };
            let newData = data;
            newData.goals = newGoals;
            try {
              await AsyncStorage.setItem('data', JSON.stringify(newData)).then(() => this.props.dispatch(saveData(newData)));
              this.props.dispatch(toggleTab('home'))
            } catch (error) {
              console.error(error);
            }
        } else {
            const { proteinP, carbsP, fatP, calories } = this.state;
            if (proteinP + carbsP + fatP !== 100) return alert('When using percentages of calories, please make sure that Protein, Carbs and Fats add up to 100%. If you are looking to add macros by grams, select By Macros')
            const protein = Math.round((calories * (proteinP / 100)) / 4);
            const carbs = Math.round((calories * (carbsP / 100)) / 4);
            const fat = Math.round((calories * (fatP / 100)) / 9);
            const newGoals = { protein, carbs, fat, calories };
            let newData = data;
            newData.goals = newGoals;
            try {
              await AsyncStorage.setItem('data', JSON.stringify(newData)).then(() => this.props.dispatch(saveData(newData)));
              this.props.dispatch(toggleTab('home'))
            } catch (error) {
              console.error(error);
            }
        }
    }

    render() {
        let renderMenu = this.renderByMacros();
        if (this.state.selected === 'By Calories') renderMenu = this.renderByCalories();
        return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAwareScrollView extraScrollHeight={100} style={styles.main}>
                <Text style={styles.header}>Set Goals</Text>
                {this.renderButtons()}
                {renderMenu}
                <TouchableOpacity style={styles.submit} onPress={() => this.handleSubmit()}>
                    <Text style={styles.submitText}>Let's get Started!</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
        );
    }
}

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, .5)',
    },
    header: {
        textAlign: 'center',
        fontSize: 32,
        color: globalStyles.fontColor,
        marginTop: '5%',
        marginBottom: '5%',
    },
    buttonView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: globalStyles.color,
        width: '35%',
        padding: '5%'
    },
    buttonText: {
        fontSize: 18,
        color: globalStyles.fontColor,
        textAlign: 'center',
    },
    selected: {
        backgroundColor: globalStyles.colors.four
    },
    menu: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        height: '50%',
        marginTop: 35,
    },
    macroRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    caloriesRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    macro: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    macroText: {
        alignSelf: 'center',
        color: globalStyles.fontColor,
        marginTop: '5%',
    },
    macroInput: {
        borderBottomColor: globalStyles.colors.four,
        borderBottomWidth: 2,
        marginBottom: 30,
        marginTop: 10,
        width: 60,
        height: 40,
        color: globalStyles.fontColor,
        textAlign: 'center',
    },
    macroAmount: {
        color: globalStyles.fontColor,
        textAlign: 'center',
    },
    caloriesByMacroText: {
        color: globalStyles.fontColor,
        marginTop: 10,
        fontSize: 24,
    },
    calories: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    caloriesText: {
        color: globalStyles.fontColor,
        alignSelf: 'center',
    },
    caloriesInput: {
        color: globalStyles.fontColor,
        alignSelf: 'center',
        borderBottomColor: globalStyles.colors.four,
        borderBottomWidth: 2,
        marginTop: 10,
        width: 120,
        height: 40,
        textAlign: 'center',
    },
    showPercentText: {
        color: globalStyles.fontColor,
        textAlign: 'center'
    },
    submit: {
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 20,
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
        tab: state.appState.tab,
        date: state.appState.date,
        data: state.dataReducer.data
    }
}

export default connect(mapStateToProps)(Goals);