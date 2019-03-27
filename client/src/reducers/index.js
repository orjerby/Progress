import { combineReducers } from 'redux'
import projectReducer from './projectReducer'
import activeProjectReducer from './activeProjectReducer'
import backlogReducer from './backlogReducer'
import sprintReducer from './sprintReducer'

// all the reducers
const reducers = {
    projectReducer,
    activeProjectReducer,
    backlogReducer,
    sprintReducer
}

// combine all reducers together and export them
export default combineReducers(reducers)