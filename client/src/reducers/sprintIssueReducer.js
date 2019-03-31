import { SET_SPRINT_ISSUES, TRANSFTER_ISSUE_TO_BACKLOG, TRANSFER_ISSUE_TO_SPRINT, UPDATE_ID_OF_TRANSFERED_ISSUE, ROLLBACK_TRANSFER_ISSUE, DELETE_ISSUE, ROLLBACK_DELETE_SPRINT_ISSUE } from '../actions/types'

export default (state = [], action) => {
    switch (action.type) {
        case SET_SPRINT_ISSUES:
            return action.payload
        case TRANSFTER_ISSUE_TO_BACKLOG:
            return state.filter(s => s._id !== action.payload.issue._id)
        case TRANSFER_ISSUE_TO_SPRINT:
            return [...state, { ...action.payload.issue, sprint: action.payload.sprintId }]
        case UPDATE_ID_OF_TRANSFERED_ISSUE:
            const foundIndex = state.findIndex(i => i._id === action.payload.issueId)
            let newState = state
            newState[foundIndex] = { ...newState[foundIndex], _id: action.payload.newIssueId }
            return newState
        case ROLLBACK_TRANSFER_ISSUE:
            return action.payload.sprintIssueReducer
        case DELETE_ISSUE:
            return state.filter(i => i._id !== action.payload)
        case ROLLBACK_DELETE_SPRINT_ISSUE:
            return action.payload
        default:
            return state
    }
}