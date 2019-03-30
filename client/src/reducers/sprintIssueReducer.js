import { SET_SPRINT_ISSUES, TRANSFTER_ISSUE__TO_BACKLOG, TRANSFER_ISSUE_TO_SPRINT } from '../actions/types'

export default (state = [], action) => {
    switch (action.type) {
        case SET_SPRINT_ISSUES:
            return action.payload
        case TRANSFTER_ISSUE__TO_BACKLOG:
            return state.filter(s => s._id !== action.payload.issueId)
        case TRANSFER_ISSUE_TO_SPRINT:
            return [...state, { ...action.payload.transferedIssue, sprint: action.payload.sprintId }]
        default:
            return state
    }
}