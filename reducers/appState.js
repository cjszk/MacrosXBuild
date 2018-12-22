import moment from 'moment';
import { DECREMENT_DATE, INCREMENT_DATE, TOGGLE_TAB, ADD_ITEM, EDIT_TRACKED_ITEM, EDIT_LIBRARY_ITEM, TOGGLE_MODE, ADD_USDA_ITEM, SELECT_DATE, SET_NEW_DAY } from "../actions/appState";

const initialState = {
    tab: 'home',
    currentDate: moment().format(),
    date: moment().format(),
    targetItem: {},
    mode: 'macros',

}

export default function appStateReducer(state=initialState, action) {
    if (action.type === TOGGLE_TAB) {
        return Object.assign({}, state, {
            tab: action.tab
        });
    }
    if (action.type === TOGGLE_MODE) {
        return Object.assign({}, state, {
            mode: action.mode,
            tab: 'home'
        });
    }
    if (action.type === ADD_ITEM) {
        return Object.assign({}, state, {
            targetItem: action.item,
            tab: 'addItem'
        });
    }
    if (action.type === ADD_USDA_ITEM) {
        return Object.assign({}, state, {
            targetItem: action.item,
            tab: 'addUsdaItem'
        });
    }
    if (action.type === EDIT_TRACKED_ITEM) {
        return Object.assign({}, state, {
            targetItem: action.item,
            tab: 'editTrackedItem'
        });
    }
    if (action.type === EDIT_LIBRARY_ITEM) {
        return Object.assign({}, state, {
            targetItem: action.item,
            tab: 'editItem'
        });
    }
    if (action.type === SELECT_DATE) {
        return Object.assign({}, state, {
            date: moment(action.date)
        });
    }
    if (action.type === DECREMENT_DATE) {
        return Object.assign({}, state, {
            date: moment(state.date).subtract(1, 'days')
        });
    }
    if (action.type === INCREMENT_DATE) {
        return Object.assign({}, state, {
            date: moment(state.date).add(1, 'days')
        });
    }
    if (action.type === SET_NEW_DAY) {
        return Object.assign({}, state, {
            currentDate: moment().format(),
            date: moment().format(),
        });
    }

    return state;
} 