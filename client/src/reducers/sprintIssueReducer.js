import _ from 'lodash'
import { SET_SPRINT_ISSUES, TRANSFTER_TO_SPRINT, TRANSFTER_TO_BACKLOG } from '../actions/types'

export default (state = [], action) => {
    switch (action.type) {
        case SET_SPRINT_ISSUES:
            return action.payload
        case TRANSFTER_TO_BACKLOG:
            return state.filter(s => s._id !== action.payload.issueId)
        case TRANSFTER_TO_SPRINT:
            return [
                ...state, _.omit({ ...action.payload.data, sprint: action.payload.sprintId }, 'todo')
            ]
        default:
            return state
    }
}