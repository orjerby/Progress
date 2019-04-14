import _ from 'lodash'

import {
    ROLLBACK_SPRINT_ISSUE,
    CREATE_BACKLOG_ISSUE,
    ROLLBACK_BACKLOG_ISSUE,
    DELETE_SPRINT_ISSUE,
    DELETE_BACKLOG_ISSUE,
    UPDATE_SPRINT_ISSUE,
    UPDATE_BACKLOG_ISSUE,
    CREATE_SPRINT_ISSUE,
    SET_DRAGGED,
    UNSET_DRAGGED,
    SET_ACTION_LOADING,
    UNSET_ACTION_LOADING
} from './types'
import progress from '../apis/progress'

// Transfer issue from backlog to sprint
// First dispatch action to add/remove the issue
// Then send API req to transfer and get back the transfered issue with new _id
// Then dispatch action to update the transfered issue
// In case of error dispatch action to rollback the transfer
export const transferIssueToSprint = (issue, sprintId, projectId) => async (dispatch, getState) => {
    const { backlogIssueReducer, sprintIssueReducer } = getState() // get the reducers before the change (for rollback)

    dispatch({
        type: DELETE_BACKLOG_ISSUE,
        payload: issue._id
    })

    const issueWithSprintIdProperty = { ...issue, sprintId }

    dispatch({
        type: CREATE_SPRINT_ISSUE,
        payload: issueWithSprintIdProperty
    })

    dispatch({ type: SET_ACTION_LOADING })

    try {
        const response = await progress.post(`/issues/${issue._id}/transfer/sprints/${sprintId}/projects/${projectId}`)
        const issueWithoutTodoProperty = _.omit(response.data, 'todo')
        const issueWithSprintIdProperty = { ...issueWithoutTodoProperty, sprintId }

        dispatch({
            type: UPDATE_SPRINT_ISSUE,
            payload: { issueId: issue._id, issue: issueWithSprintIdProperty }
        })

    } catch (e) {
        dispatch({
            type: ROLLBACK_SPRINT_ISSUE,
            payload: sprintIssueReducer
        })

        dispatch({
            type: ROLLBACK_BACKLOG_ISSUE,
            payload: backlogIssueReducer
        })
    } finally {
        dispatch({ type: UNSET_ACTION_LOADING })
    }
}

// Transfer issue from backlog to sprint
// First dispatch action to add/remove the issue
// Then send API req to transfer and get back the transfered issue with new _id
// Then dispatch action to change just the _id we transfered before
// In case of error dispatch action to rollback the transfer
export const transferIssueToBacklog = (issue, backlogId, projectId) => async (dispatch, getState) => {
    const { backlogIssueReducer, sprintIssueReducer } = getState() // get the reducers before the transfer (for rollback)
    const issueWithoutSprintIdProperty = _.omit(issue, 'sprintId')

    dispatch({
        type: DELETE_SPRINT_ISSUE,
        payload: issue._id
    })

    dispatch({
        type: CREATE_BACKLOG_ISSUE,
        payload: issueWithoutSprintIdProperty
    })

    dispatch({ type: SET_ACTION_LOADING })

    try {
        const response = await progress.post(`/issues/${issue._id}/transfer/backlogs/projects/${projectId}`)
        const issueWithoutTodoProperty = _.omit(response.data, 'todo')

        dispatch({
            type: UPDATE_BACKLOG_ISSUE,
            payload: { issueId: issue._id, issue: issueWithoutTodoProperty }
        })
    } catch (e) {
        dispatch({
            type: ROLLBACK_SPRINT_ISSUE,
            payload: sprintIssueReducer
        })

        dispatch({
            type: ROLLBACK_BACKLOG_ISSUE,
            payload: backlogIssueReducer
        })
    } finally {
        dispatch({ type: UNSET_ACTION_LOADING })
    }
}

export const createBacklogIssue = (issue, projectId) => async (dispatch, getState) => {
    const { backlogIssueReducer } = getState() // get the reducer before the creation (for rollback)
    const issueId = Math.floor(Math.random() * 100)
    dispatch({ type: CREATE_BACKLOG_ISSUE, payload: { ...issue, _id: issueId } })
    dispatch({ type: SET_ACTION_LOADING })
    try {
        const response = await progress.post(`/issues/backlogs/projects/${projectId}`, issue)
        const issueWithoutTodoProperty = _.omit(response.data, 'todo')
        dispatch({
            type: UPDATE_BACKLOG_ISSUE,
            payload: { issueId, issue: issueWithoutTodoProperty }
        })
    } catch (e) {
        dispatch({
            type: ROLLBACK_BACKLOG_ISSUE,
            payload: backlogIssueReducer
        })
    } finally {
        dispatch({ type: UNSET_ACTION_LOADING })
    }
}

export const deleteSprintIssue = issueId => async (dispatch, getState) => {
    const { sprintIssueReducer } = getState() // get the reducer before the delete (for rollback)
    dispatch({ type: DELETE_SPRINT_ISSUE, payload: issueId })
    dispatch({ type: SET_ACTION_LOADING })
    try {
        await progress.delete(`/issues/${issueId}?parent=sprint`)
    } catch (e) {
        dispatch({
            type: ROLLBACK_SPRINT_ISSUE,
            payload: sprintIssueReducer
        })
    } finally {
        dispatch({ type: UNSET_ACTION_LOADING })
    }
}

export const deleteBacklogIssue = issueId => async (dispatch, getState) => {
    const { backlogIssueReducer } = getState() // get the reducer before the delete (for rollback)
    dispatch({ type: DELETE_BACKLOG_ISSUE, payload: issueId })
    dispatch({ type: SET_ACTION_LOADING })
    try {
        await progress.delete(`/issues/${issueId}?parent=backlog`)
    } catch (e) {
        dispatch({
            type: ROLLBACK_BACKLOG_ISSUE,
            payload: backlogIssueReducer
        })
    } finally {
        dispatch({ type: UNSET_ACTION_LOADING })
    }
}

export const updateBacklogIssue = (issue, issueId, projectId) => async (dispatch, getState) => {
    const { backlogIssueReducer } = getState() // get the reducer before the creation (for rollback)
    dispatch({ type: UPDATE_BACKLOG_ISSUE, payload: { issue, issueId } })
    dispatch({ type: SET_ACTION_LOADING })
    try {
        await progress.patch(`/issues/${issueId}/backlogs/projects/${projectId}`, issue)
    } catch (e) {
        dispatch({
            type: ROLLBACK_BACKLOG_ISSUE,
            payload: backlogIssueReducer
        })
    } finally {
        dispatch({ type: UNSET_ACTION_LOADING })
    }
}

export const updateSprintIssue = (issue, issueId, projectId) => async (dispatch, getState) => {
    const { sprintIssueReducer } = getState() // get the reducer before the creation (for rollback)
    dispatch({ type: UPDATE_SPRINT_ISSUE, payload: { issue, issueId } })
    dispatch({ type: SET_ACTION_LOADING })
    try {
        await progress.patch(`/issues/${issueId}/sprints/projects/${projectId}`, issue)
    } catch (e) {
        dispatch({
            type: ROLLBACK_SPRINT_ISSUE,
            payload: sprintIssueReducer
        })
    } finally {
        dispatch({ type: UNSET_ACTION_LOADING })
    }
}

export const setDragged = (issueId) => {
    return {
        type: SET_DRAGGED,
        payload: issueId
    }
}

export const setUndragged = () => {
    return {
        type: UNSET_DRAGGED
    }
}