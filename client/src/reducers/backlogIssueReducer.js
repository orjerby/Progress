import _ from 'lodash'

import { SET_BACKLOG_ISSUES, TRANSFTER_ISSUE_TO_BACKLOG, TRANSFER_ISSUE_TO_SPRINT, UPDATE_ID_OF_TRANSFERED_ISSUE, ROLLBACK_TRANSFER_ISSUE } from '../actions/types'

export default (state = [], action) => {
    switch (action.type) {
        case SET_BACKLOG_ISSUES:
            return action.payload
        case TRANSFER_ISSUE_TO_SPRINT:
            return state.filter(s => s._id !== action.payload.issue._id)
        case TRANSFTER_ISSUE_TO_BACKLOG:
            return [...state, _.omit(action.payload.issue, 'sprint')]
        case UPDATE_ID_OF_TRANSFERED_ISSUE:
            const foundIndex = state.findIndex(i => i._id === action.payload.issueId)
            let newState = state
            newState[foundIndex] = { ...newState[foundIndex], _id: action.payload.newIssueId }
            return newState
        case ROLLBACK_TRANSFER_ISSUE:
            return action.payload.backlogIssueReducer
        default:
            return state
    }
}