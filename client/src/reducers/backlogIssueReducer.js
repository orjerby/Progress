import _ from 'lodash'

import { SET_BACKLOG_ISSUES, TRANSFTER_ISSUE_TO_BACKLOG, TRANSFER_ISSUE_TO_SPRINT, UPDATE_ID_OF_BACKLOG_ISSUE, ROLLBACK_TRANSFER_ISSUE, CREATE_ISSUE, ROLLBACK_CREATE_ISSUE, UPDATE_ID_OF_CREATED_ISSUE, DELETE_BACKLOG_ISSUE, ROLLBACK_DELETE_BACKLOG_ISSUE, UPDATE_BACKLOG_ISSUE, ROLLBACK_UPDATE_BACKLOG_ISSUE } from '../actions/types'

export default (state = [], action) => {
    switch (action.type) {
        case SET_BACKLOG_ISSUES:
            return action.payload
        case TRANSFER_ISSUE_TO_SPRINT:
            return state.filter(s => s._id !== action.payload.issue._id)
        case TRANSFTER_ISSUE_TO_BACKLOG:
            return [...state, action.payload.issue]
        case UPDATE_ID_OF_BACKLOG_ISSUE:
            return state.map(i => {
                if (i._id === action.payload.issueId) {
                    return { ...i, _id: action.payload.newIssueId }
                }
                return i
            })
        case ROLLBACK_TRANSFER_ISSUE:
            return action.payload.backlogIssueReducer
        case CREATE_ISSUE:
            return [...state, action.payload]
        case ROLLBACK_CREATE_ISSUE:
            return action.payload
        case UPDATE_ID_OF_CREATED_ISSUE:
            return state.map(i => {
                if (i._id === action.payload.issueId) {
                    return { ...i, _id: action.payload.newIssueId }
                }
                return i
            })
        case DELETE_BACKLOG_ISSUE:
            return state.filter(i => i._id !== action.payload)
        case ROLLBACK_DELETE_BACKLOG_ISSUE:
            return action.payload
        case UPDATE_BACKLOG_ISSUE:
            return state.map(i => {
                if (i._id === action.payload.issueId) {
                    return { ...i, ...action.payload.issue }
                }
                return i
            })
        case ROLLBACK_UPDATE_BACKLOG_ISSUE:
            return action.payload
        default:
            return state
    }
}