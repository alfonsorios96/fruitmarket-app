import {combineReducers} from 'redux';
import storeReducer from './reducers/stores';

const rootReducer = combineReducers(
    {stores: storeReducer}
);

export default rootReducer;
