import { combineReducers } from 'redux'
import testReducer from './testReducer'

// all the reducers
const reducers = {
    testReducer
}

// combine all reducers together and export them
export default combineReducers(reducers)