import _ from 'lodash'
import { SET_BACKLOG_ISSUES, TRANSFTER_TO_BACKLOG, TRANSFTER_TO_SPRINT } from '../actions/types'

export default (state = [], action) => {
    switch (action.type) {
        case SET_BACKLOG_ISSUES:
            return action.payload
        case TRANSFTER_TO_SPRINT:
            return state.filter(s => s._id !== action.payload.issueId)
        case TRANSFTER_TO_BACKLOG:
            return [...state, _.omit(action.payload.data, 'todo')]
        default:
            return state
    }
}