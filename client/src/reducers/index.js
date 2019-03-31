import { combineReducers } from 'redux'
import projectReducer from './projectReducer'
import activeProjectReducer from './activeProjectReducer'
import backlogIssueReducer from './backlogIssueReducer'
import sprintReducer from './sprintReducer'
import sprintIssueReducer from './sprintIssueReducer'
import todoReducer from './todoReducer'
import draggedReducer from './draggedReducer'
import fetchReducer from './fetchReducer'
import { reducer as formReducer } from 'redux-form';

// all the reducers
const reducers = {
    projectReducer,
    activeProjectReducer,
    backlogIssueReducer,
    sprintReducer,
    sprintIssueReducer,
    todoReducer,
    draggedReducer,
    fetchReducer,
    form: formReducer,
}

// combine all reducers together and export them
export default combineReducers(reducers)