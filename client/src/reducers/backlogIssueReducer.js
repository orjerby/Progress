import { SET_BACKLOG_ISSUES, ROLLBACK_BACKLOG_ISSUE, CREATE_BACKLOG_ISSUE, DELETE_BACKLOG_ISSUE, UPDATE_BACKLOG_ISSUE } from '../actions/types'

export default (state = [], action) => {
    switch (action.type) {

        case SET_BACKLOG_ISSUES:
            return action.payload

        case CREATE_BACKLOG_ISSUE:
            return [...state, action.payload]

        case UPDATE_BACKLOG_ISSUE:
            return state.map(i => {
                if (i._id === action.payload.issueId) {
                    return { ...i, ...action.payload.issue }
                }
                return i
            })

        case DELETE_BACKLOG_ISSUE:
            return state.filter(i => i._id !== action.payload)

        case ROLLBACK_BACKLOG_ISSUE:
            return action.payload

        default:
            return state
    }
}