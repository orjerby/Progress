import { SET_SPRINT_ISSUES, ROLLBACK_SPRINT_ISSUE, DELETE_SPRINT_ISSUE, UPDATE_SPRINT_ISSUE, CREATE_SPRINT_ISSUE } from '../actions/types'

export default (state = [], action) => {
    switch (action.type) {

        case SET_SPRINT_ISSUES:
            return action.payload

        case CREATE_SPRINT_ISSUE:
            return [...state, action.payload]

        case UPDATE_SPRINT_ISSUE:
            return state.map(i => {
                if (i._id === action.payload.issueId) {
                    return { ...i, ...action.payload.issue }
                }
                return i
            })

        case DELETE_SPRINT_ISSUE:
            return state.filter(i => i._id !== action.payload)

        case ROLLBACK_SPRINT_ISSUE:
            return action.payload

        default:
            return state
    }
}