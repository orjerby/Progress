import { combineReducers } from 'redux'
import projectReducer from './projectReducer'

// all the reducers
const reducers = {
    projectReducer
}

// combine all reducers together and export them
export default combineReducers(reducers)