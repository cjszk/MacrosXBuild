import moment from 'moment';
import { AsyncStorage } from 'react-native';
import { SAVE_DATA } from '../actions/data';

const initialState = {
    data: null,
    library: {},
}

export default function appStateReducer(state=initialState, action) {
    if (action.type === SAVE_DATA) {
        return Object.assign({}, state, {
            data: action.data
        });
    }
    return state;
} 

const testData = {
    adFree: false,
    tracking: [
        ],
    settings: {
        trackingSettings: {
            trackFiber: true,
            trackSugar: true,
        }
    },
    goals: {
        protein: 176,
        carbs: 176,
        fat: 48,
        calories: 1840,
    },
    library: [
        {
            name: 'Pasta',
            protein: 5,
            carbs: 42,
            fat: 7,
            fiber: 0,
            sugar: 0,
            date: moment().format(),
            servingSize: 300,
            measurement: 'grams'
        },
        {
            name: 'Whey Protein',
            protein: 30,
            carbs: 2,
            fat: 1,
            fiber: 0,
            sugar: 0,
            date: moment().format(),
            servingSize: 40,
            measurement: 'grams'
        },
        {
            name: 'almonds',
            protein: 5,
            carbs: 7,
            fat: 11,
            fiber: 3,
            sugar: 0,
            date: moment().format(),
            servingSize: 10,
            measurement: 'pieces'
        },
    ],
    entries: [
        {
            date: moment().format(),
            name: 'Pasta',
            protein: 5,
            carbs: 42,
            fat: 7,
            fiber: 0,
            sugar: 0,
            servings: 1.5,
            measurement: 'grams',
        },
        {
            date: moment().format(),
            name: 'Whey Protein',
            protein: 30,
            carbs: 1,
            fat: 1,
            fiber: 0,
            sugar: 0,
            servings: 2,
            measurement: 'grams'
        },
        {
            date: moment().format(),
            name: 'Banana',
            protein: 2,
            carbs: 42,
            fat: 2,
            fiber: 0,
            sugar: 0,
            servings: 1.0,
            measurement: 'grams',
        },
        {
            date: moment().format(),
            name: 'Almonds',
            protein: 5,
            carbs: 8,
            fat: 11,
            fiber: 0,
            sugar: 0,
            servings: .5,
            measurement: 'grams'
        },
        {
            date: moment().format(),
            name: 'Almonds',
            protein: 5,
            carbs: 8,
            fat: 11,
            fiber: 0,
            sugar: 0,
            servings: .5,
            measurement: 'grams'
        },
        {
            date: moment().format(),
            name: 'Banana',
            protein: 2,
            carbs: 42,
            fat: 2,
            fiber: 0,
            sugar: 0,
            servings: 1.0,
            measurement: 'grams'
        },
        {
            date: moment().format(),
            name: 'Apple',
            protein: 0.5,
            carbs: 25,
            fat: 0.3,
            fiber: 0,
            sugar: 0,
            servings: 1.0,
            measurement: 'medium sized'
        },
        {
            date: moment().format(),
            name: 'Apple',
            protein: 0.5,
            carbs: 25,
            fat: 0.3,
            fiber: 0,
            sugar: 0,
            servings: 1.0,
            measurement: 'medium sized'
        },
    ],
}

storeData = async (data) => {
    try {
        console.log('rewrote data with dummy data')
        await AsyncStorage.setItem('data', JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
}

// storeData(null);