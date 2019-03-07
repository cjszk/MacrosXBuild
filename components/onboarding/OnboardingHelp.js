import React from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, View, TouchableOpacity, Text, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { toggleTab } from '../../actions/appState';
import { saveData } from '../../actions/data';
import moment from 'moment';
import globalStyles from '../../globalStyles';

class OnboardingHelp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMeasurement: 'lbs',
            slide: 1,
            age: null,
            weight: null,
            selectedSex: null,
            activityLevel: null,
            goal: null,
        }
    }

    renderKgLbs() {
        const { selectedMeasurement } = this.state;
        return (
        <View style={styles.buttonView}>
            <TouchableOpacity style={selectedMeasurement === 'lbs' ? [styles.button, styles.selected] : styles.button }onPress={() => this.setState({selectedMeasurement: 'lbs'})}>
                <Text style={styles.buttonText}>lbs/inches</Text>
            </TouchableOpacity>
            <TouchableOpacity style={selectedMeasurement === 'kg' ? [styles.button, styles.selected] : styles.button} onPress={() => this.setState({selectedMeasurement: 'kg'})}>
                <Text style={styles.buttonText}>kg/cm</Text>
            </TouchableOpacity>
        </View>
        )
    }

    calculateMacros() {
        const { age, weight, selectedSex, activityLevel, goal, selectedMeasurement } = this.state;
        let baseCalories = (selectedMeasurement === 'lbs' ? weight : weight * 2.2) * 15;
        if (selectedSex === 'female') baseCalories = (selectedMeasurement === 'lbs' ? weight : weight * 2.2) * 13;  
        let genderActivityFactor = selectedSex === 'male' ? 0 : -100;
        if ( activityLevel === 'sedentary') baseCalories = baseCalories - 600 - genderActivityFactor;
        if ( activityLevel === 'slightly active') baseCalories = baseCalories - 300 - genderActivityFactor;
        if ( activityLevel === 'highly active') baseCalories = baseCalories + 300 - genderActivityFactor;
        if ( activityLevel === 'very highly active') baseCalories = baseCalories + 600 - genderActivityFactor;
        return baseCalories;
    }

    renderFirst() {
        const { age, weight } = this.state;
        return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAwareScrollView extraScrollHeight={100} style={styles.main}>
                <Text style={styles.header}>Alright!</Text>
                <Text style={styles.description}>That's okay, we all start out unsure of our macros. Let's pick a starting point for you! Please tell us the following:</Text>
                {this.renderKgLbs()}
                <View style={[styles.inputContainer, {height: '50%'}]}>
                    <View>
                        <Text style={styles.inputLabel}>Your Age: </Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#ccc"
                            placeholder="age"
                            keyboardType='numeric'
                            onChangeText={(age) => this.setState({age})}
                            value={age}
                        />
                    </View>
                    <View>
                        <Text style={styles.inputLabel}>Your Weight: </Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#ccc"
                            placeholder="weight"
                            keyboardType='numeric'
                            onChangeText={(weight) => this.setState({weight})}
                            value={weight}
                        />
                    </View>
                </View>
                <TouchableOpacity style={styles.submit} onPress={() =>  {
                    if (age && weight) this.setState({slide: 2})
                    }}>
                    <Text style={styles.submitText}>Enter</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
        );
    }

    renderSecond() {
        const { selectedSex } = this.state;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAwareScrollView extraScrollHeight={100} style={styles.main}>
                <Text style={styles.header}>Male or Female?</Text>
                <View style={{height: '120%'}}>
                    <View style={styles.buttonView}>
                        <TouchableOpacity style={selectedSex === 'male' ? [styles.button, styles.selected, {marginTop: 100, marginBottom: -100}] : [styles.button, {marginTop: 100, marginBottom: -100}] }onPress={() => this.setState({selectedSex: 'male'})}>
                            <Text style={styles.buttonText}>Male</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={selectedSex === 'female' ? [styles.button, styles.selected, {marginTop: 100, marginBottom: -100}] : [styles.button, {marginTop: 100, marginBottom: -100}]} onPress={() => this.setState({selectedSex: 'female'})}>
                            <Text style={styles.buttonText}>Female</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.submit}onPress={() => {
                    if (selectedSex) this.setState({slide: 3})
                    }}>
                    <Text style={styles.submitText}>Enter</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
        )
    }

    renderThird() {
        const { activityLevel } = this.state;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAwareScrollView extraScrollHeight={100} style={styles.main}>
                    <Text style={styles.header}>Activity Levels</Text>
                    <Text style={styles.description}>Now to more accurately estimate your energy needs, are you...</Text>
                    <Text style={styles.description}>(If you suspect you have a high metabolism, select a higher value. If you suspect you have a slow metabolism, select a lower value)</Text>
                    <View style={styles.smallButtonView}>
                        <TouchableOpacity style={activityLevel === 'sedentary' ? [styles.smallButton, styles.selected] : styles.smallButton }onPress={() => this.setState({activityLevel: 'sedentary'})}>
                            <Text style={styles.smallButtonText}>Sedentary</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={activityLevel === 'slightly active' ? [styles.smallButton, styles.selected] : styles.smallButton} onPress={() => this.setState({activityLevel: 'slightly active'})}>
                            <Text style={styles.smallButtonText}>Slightly Active</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={activityLevel === 'moderately active' ? [styles.smallButton, styles.selected] : styles.smallButton} onPress={() => this.setState({activityLevel: 'moderately active'})}>
                            <Text style={styles.smallButtonText}>Moderately Active</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={activityLevel === 'highly active' ? [styles.smallButton, styles.selected] : styles.smallButton} onPress={() => this.setState({activityLevel: 'highly active'})}>
                            <Text style={styles.smallButtonText}>Highly Active</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={activityLevel === 'very highly active' ? [styles.smallButton, styles.selected] : styles.smallButton} onPress={() => this.setState({activityLevel: 'very highly active'})}>
                            <Text style={styles.smallButtonText}>Always on my feet</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={[styles.submit, {marginTop: '5%'}]} onPress={() => {
                        if (activityLevel) this.setState({slide: 4})
                    }}>
                        <Text style={styles.submitText}>Enter</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
            </TouchableWithoutFeedback>
            );
    }

    renderFourth() {
        const { goal } = this.state;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAwareScrollView extraScrollHeight={100} style={styles.main}>
                    <Text style={styles.header}>Goal</Text>
                    <Text style={styles.description}>Now what is your goal?</Text>
                    <View style={[styles.smallButtonView, {height: '80%'}]}>
                        <TouchableOpacity style={goal === 'Lose Fat' ? [styles.smallButton, styles.selected] : styles.smallButton }onPress={() => this.setState({goal: 'Lose Fat'})}>
                            <Text style={styles.smallButtonText}>Lose Fat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={goal === 'Maintain' ? [styles.smallButton, styles.selected] : styles.smallButton} onPress={() => this.setState({goal: 'Maintain'})}>
                            <Text style={styles.smallButtonText}>Maintain</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={goal === 'Gain Muscle' ? [styles.smallButton, styles.selected] : styles.smallButton} onPress={() => this.setState({goal: 'Gain Muscle'})}>
                            <Text style={styles.smallButtonText}>Gain Muscle</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.submit}onPress={() => {
                        if (goal) this.setState({slide: 5})
                    }}>
                        <Text style={styles.submitText}>Enter</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
            </TouchableWithoutFeedback>
            );
    }

    renderFifth() {
        const { weight, selectedMeasurement, goal } = this.state;
        let goalFactor = 1;
        if (goal === 'Lose Fat') goalFactor = .8;
        if (goal === 'Gain Muscle') goalFactor = 1.075;
        const totalCalories = parseInt(this.calculateMacros() * goalFactor);
        const protein = selectedMeasurement === 'lbs' ? parseInt(weight) : parseInt(weight * 2.2);
        const fat = selectedMeasurement === 'lbs' ? parseInt(weight * .4) : parseInt((weight * 2.2) * .4);
        const carbs = parseInt((totalCalories - ((protein * 4) + (fat * 9) )) / 4);

        return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAwareScrollView extraScrollHeight={100} style={styles.main}>
                <Text style={styles.header}>We recommend:</Text>
                <View style={styles.recommended}>
                    <View style={styles.recommendedMacros}>
                        <View style={styles.recommendedMacroContainer}>
                            <Text style={styles.recommendedMacroHeader}>Fat</Text>
                            <Text style={styles.recommendedMacroNumber}>{fat}g</Text>
                        </View>
                    </View>
                    <View style={styles.recommendedMacros}>
                        <View style={styles.recommendedMacroContainer}>
                            <Text style={styles.recommendedMacroHeader}>Protein</Text>
                            <Text style={styles.recommendedMacroNumber}>{protein}g</Text>
                        </View>
                    </View>
                    <View style={styles.recommendedMacros}>
                        <View style={styles.recommendedMacroContainer}>
                            <Text style={styles.recommendedMacroHeader}>Carbs</Text>
                            <Text style={styles.recommendedMacroNumber}>{carbs}g</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.recommendedCalories}>
                        <Text style={styles.recommendedMacroHeader}>Total Calories</Text>
                        <Text style={styles.recommendedMacroNumber}>{totalCalories}kcal</Text>
                </View>
                <TouchableOpacity style={styles.submit}onPress={() => this.handleSubmit(fat, protein, carbs, totalCalories)}>
                    <Text style={styles.submitText}>Let's get started!</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitAlternate}onPress={() => {
                    this.props.dispatch(toggleTab('onboardingGoals'))
                }}>
                    <Text style={styles.submitTextAlternative}>Let me input my macros manually</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
        )
    }

    handleSubmit = async (fat, protein, carbs, calories) => {
        const { selectedMeasurement } = this.state;
        let data = {
            adFree: false,
            settings: {
                trackingSettings: {
                    trackFiber: true,
                    trackSugar: true,
                    trackByKg: selectedMeasurement === 'lbs' ? false : true
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

    render() {
        const { slide } = this.state;
        if (slide === 1) return this.renderFirst();
        if (slide === 2) return this.renderSecond();
        if (slide === 3) return this.renderThird();
        if (slide === 4) return this.renderFourth();
        if (slide === 5) return this.renderFifth();
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
    description: {
        color: globalStyles.fontColor,
        textAlign: 'center',
        fontSize: 14,
        marginBottom: '3%',
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: '10%',
        marginTop: '10%',
    },
    input: {
        alignSelf: 'center',
        borderBottomColor: globalStyles.colors.four,
        borderBottomWidth: 2,
        marginLeft: 5,
        marginRight: 5,
        height: 40,
        width: 60,
        color: globalStyles.fontColor,
        textAlign: 'center',
        fontSize: 16
    },
    inputLabel: {
        color: globalStyles.fontColor,
        fontSize: 18
    },
    buttonView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: '1%',
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
    smallButtonView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
    },
    smallButton: {
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: globalStyles.color,
        height: 60,
        width: '30%',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 30,
        marginBottom: 30,
        paddingTop: '2.5%',
        paddingBottom: '2.5%',
    },
    smallButtonText: {
        alignSelf: 'center',
        fontSize: 16,
        color: globalStyles.fontColor,
        textAlign: 'center',
    },
    selected: {
        backgroundColor: globalStyles.colors.four
    },
    recommended: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    recommendedMacroContainer: {
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    recommendedMacroHeader: {
        color: globalStyles.fontColor,
        fontSize: 18,

    },
    recommendedMacroNumber: {
        color: globalStyles.fontColor,
        fontSize: 18,

    },
    recommendedCalories: {
        alignItems: 'center',
        marginTop: '10%',
    },
    submit: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '10%',
        padding: 20,
        justifyContent: 'center',
        width: '50%',
        backgroundColor: globalStyles.buttonColor
        
    },
    submitText: {
        textAlign: 'center',
        color: globalStyles.buttonTextColor,
        fontSize: 18,
    },
    submitAlternate: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '10%',
        padding: 20,
        width: '50%',
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: globalStyles.color,
    },
    submitTextAlternative: {
        textAlign: 'center',
        color: globalStyles.fontColor,
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

export default connect(mapStateToProps)(OnboardingHelp);