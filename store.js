import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import appStateReducer from './reducers/appState';
import dataReducer from './reducers/data';

const store = createStore(
    combineReducers({
        appState: appStateReducer,
        dataReducer,
    }),
    applyMiddleware(thunk)
);

export default store;