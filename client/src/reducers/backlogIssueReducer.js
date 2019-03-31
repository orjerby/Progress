import _ from 'lodash'

import { SET_BACKLOG_ISSUES, TRANSFTER_ISSUE_TO_BACKLOG, TRANSFER_ISSUE_TO_SPRINT, UPDATE_ID_OF_TRANSFERED_ISSUE, ROLLBACK_TRANSFER_ISSUE, CREATE_ISSUE, ROLLBACK_CREATE_ISSUE, UPDATE_ID_OF_CREATED_ISSUE } from '../actions/types'

export default (state = [], action) => {
    let foundIndex
    let newState
    switch (action.type) {
        case SET_BACKLOG_ISSUES:
            return action.payload
        case TRANSFER_ISSUE_TO_SPRINT:
            return state.filter(s => s._id !== action.payload.issue._id)
        case TRANSFTER_ISSUE_TO_BACKLOG:
            return [...state, action.payload.issue]
        case UPDATE_ID_OF_TRANSFERED_ISSUE:
            foundIndex = state.findIndex(i => i._id === action.payload.issueId)
            newState = state
            newState[foundIndex] = { ...newState[foundIndex], _id: action.payload.newIssueId }
            return newState
        case ROLLBACK_TRANSFER_ISSUE:
            return action.payload.backlogIssueReducer
        case CREATE_ISSUE:
            return [...state, action.payload]
        case ROLLBACK_CREATE_ISSUE:
            return action.payload.backlogIssueReducer
        case UPDATE_ID_OF_CREATED_ISSUE:
            foundIndex = state.findIndex(i => i._id === action.payload.issueId)
            newState = state
            newState[foundIndex] = { ...newState[foundIndex], _id: action.payload.newIssueId }
            return newState
        default:
            return state
    }
}