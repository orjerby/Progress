import { SET_BACKLOG_ISSUES, TRANSFTER_ISSUE__TO_BACKLOG, TRANSFER_ISSUE_TO_SPRINT } from '../actions/types'

export default (state = [], action) => {
    switch (action.type) {
        case SET_BACKLOG_ISSUES:
            return action.payload
        case TRANSFER_ISSUE_TO_SPRINT:
            return state.filter(s => s._id !== action.payload.issueId)
        case TRANSFTER_ISSUE__TO_BACKLOG:
            return [...state, action.payload.transferedIssue]
        default:
            return state
    }
}