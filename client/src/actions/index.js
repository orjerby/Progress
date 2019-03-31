import { CREATE_PROJECT, FETCH_PROJECTS, UPDATE_PROJECT, DELETE_PROJECT, SET_ACTIVE_PROJECT, TRANSFER_ISSUE_TO_SPRINT, TRANSFTER_ISSUE_TO_BACKLOG, SET_SPRINTS, SET_SPRINT_ISSUES, SET_BACKLOG_ISSUES, SET_TODOS, SET_BACKLOG, SET_DRAGGED, UNSET_DRAGGED, UPDATE_ID_OF_TRANSFERED_ISSUE, ROLLBACK_TRANSFER_ISSUE, SET_FETCHING, UNSET_FETCHING } from './types'
import _ from 'lodash'
import progress from '../apis/progress'

export const createProject = formValues => async dispatch => {
    try {
        const response = await progress.post('/projects', formValues)
        dispatch({ type: CREATE_PROJECT, payload: response.data })
    } catch (e) {
        console.log(e.response)
    }
}

export const fetchProjects = () => async dispatch => {
    try {
        const response = await progress.get('/projects')
        dispatch({ type: FETCH_PROJECTS, payload: response.data })
    } catch (e) {
        console.log(e.response)
    }
}

export const updateProject = (id, formValues) => async dispatch => {
    try {
        const response = await progress.patch(`/projects/${id}`, formValues)
        dispatch({ type: UPDATE_PROJECT, payload: response.data })
    } catch (e) {
        console.log(e.response)
    }
}

export const deleteProject = id => async dispatch => {
    try {
        const response = await progress.delete(`/projects/${id}`)
        dispatch({ type: DELETE_PROJECT, payload: response.data._id })
    } catch (e) {
        console.log(e.response)
    }
}

export const setActiveProject = project => {
    return {
        type: SET_ACTIVE_PROJECT,
        payload: project
    }
}

export const fetchBacklogs = projectId => async dispatch => {
    try {
        const response = await progress.get(`/backlogs?projectid=${projectId}`)
        const data = response.data

        // making the data for the reducers ready
        let issues = []
        let todos = []
        data.issue.forEach(i => {
            issues.push({ ..._.omit(i, 'todo') })
            i.todo.forEach(t => {
                todos.push({ ...t, issue: i._id })
            });
        });

        dispatch({ type: SET_BACKLOG_ISSUES, payload: issues })
        dispatch({ type: SET_TODOS, payload: todos })
        dispatch({ type: SET_BACKLOG, payload: data._id })
    } catch (e) {
        console.log(e.response)
    }
}

export const fetchSprints = projectId => async dispatch => {
    try {
        const response = await progress.get(`/sprints?projectid=${projectId}`)
        const data = response.data

        // making the data for the reducers ready
        let sprints = []
        let issues = []
        let todos = []
        data.forEach(s => {
            sprints.push(_.omit(s, 'issue'))
            s.issue.forEach(i => {
                issues.push({ ..._.omit(i, 'todo'), sprint: s._id })
                i.todo.forEach(t => {
                    todos.push({ ...t, issue: i._id })
                });
            });
        });

        dispatch({ type: SET_SPRINTS, payload: sprints })
        dispatch({ type: SET_SPRINT_ISSUES, payload: issues })
        dispatch({ type: SET_TODOS, payload: todos })
    } catch (e) {
        console.log(e.response)
    }
}

// Transfer issue from backlog to sprint
// First dispatch action to add/remove the issue
// Then send API req to transfer and get back the transfered issue with new _id
// Then dispatch action to change just the _id we transfered before
// In case of error dispatch action to rollback the transfer
export const transferIssueToSprint = (issue, sprintId) => async (dispatch, getState) => {
    const { backlogIssueReducer, sprintIssueReducer } = getState() // get the reducers before the transfer (for rollback)
    dispatch({
        type: TRANSFER_ISSUE_TO_SPRINT,
        payload: { issue, sprintId }
    })
    dispatch({ type: SET_FETCHING })
    try {
        const response = await progress.post('/issues?transferto=sprint', { sprint: sprintId, issue: issue._id })
        const newIssueId = response.data._id
        dispatch({ type: UPDATE_ID_OF_TRANSFERED_ISSUE, payload: { issueId: issue._id, newIssueId } })
    } catch (e) {
        dispatch({
            type: ROLLBACK_TRANSFER_ISSUE,
            payload: { backlogIssueReducer, sprintIssueReducer }
        })
    } finally {
        dispatch({ type: UNSET_FETCHING })
    }
}

// Transfer issue from backlog to sprint
// First dispatch action to add/remove the issue
// Then send API req to transfer and get back the transfered issue with new _id
// Then dispatch action to change just the _id we transfered before
// In case of error dispatch action to rollback the transfer
export const transferIssueToBacklog = (issue, backlogId) => async (dispatch, getState) => {
    const { backlogIssueReducer, sprintIssueReducer } = getState() // get the reducers before the transfer (for rollback)
    dispatch({
        type: TRANSFTER_ISSUE_TO_BACKLOG,
        payload: { issue, backlogId }
    })
    dispatch({ type: SET_FETCHING })
    try {
        const response = await progress.post('/issues?transferto=backlog', { backlog: backlogId, issue: issue._id })
        const newIssueId = response.data._id
        dispatch({ type: UPDATE_ID_OF_TRANSFERED_ISSUE, payload: { issueId: issue._id, newIssueId } })
    } catch (e) {
        dispatch({
            type: ROLLBACK_TRANSFER_ISSUE,
            payload: { backlogIssueReducer, sprintIssueReducer }
        })
    } finally {
        dispatch({ type: UNSET_FETCHING })
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