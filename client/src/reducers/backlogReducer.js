//import _ from 'lodash'
import { CREATE_PROJECT, FETCH_PROJECTS, UPDATE_PROJECT, DELETE_PROJECT, SET_ACTIVE_PROJECT, FETCH_BACKLOGS, TRANSFTER_TO_BACKLOG, TRANSFTER_TO_SPRINT } from '../actions/types'

const DEFAULT_STATE = null
// object
export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case FETCH_BACKLOGS:
            return action.payload
        case TRANSFTER_TO_SPRINT:

            const a = state.issue.filter(i => i !== action.payload.id)
            return { ...state, issue: a }
        case TRANSFTER_TO_BACKLOG:
        console.log('a',state)
        console.log('b',{ ...state, issue: [...state.issue, action.payload.data] })
            return { ...state, issue: [...state.issue, action.payload.data] }
        default:
            return state
    }
}