import _ from 'lodash'

import { CREATE_PROJECT, FETCH_PROJECTS, UPDATE_PROJECT, DELETE_PROJECT, SET_ACTIVE_PROJECT, SET_FETCH_LOADING, UNSET_FETCH_LOADING, SET_ACTION_LOADING, UNSET_ACTION_LOADING, SET_BACKLOG_ISSUES, SET_TODOS, SET_SPRINT_ISSUES, SET_BACKLOG, SET_SPRINTS, UNSET_PROJECTS, UNSET_ACTIVE_PROJECT } from './types'
import progress from '../apis/progress'

export const createProject = formValues => async dispatch => {
    dispatch({ type: SET_ACTION_LOADING })
    try {
        const response = await progress.post('/projects', formValues)
        dispatch({ type: CREATE_PROJECT, payload: response.data.project })
    } catch (e) {
        console.log(e.response)
    } finally {
        dispatch({ type: UNSET_ACTION_LOADING })
    }
}

export const fetchProjects = () => async dispatch => {
    dispatch({ type: SET_FETCH_LOADING })
    try {
        const response = await progress.get('/projects')
        dispatch({ type: FETCH_PROJECTS, payload: response.data })
    } catch (e) {
        console.log(e.response)
    } finally {
        dispatch({ type: UNSET_FETCH_LOADING })
    }
}

export const unsetProjects = () => {
    return {
        type: UNSET_PROJECTS
    }
}

export const unsetActiveProject = () => {
    return {
        type: UNSET_ACTIVE_PROJECT
    }
}

export const updateProject = (id, formValues) => async dispatch => {
    dispatch({ type: SET_ACTION_LOADING })
    try {
        const response = await progress.patch(`/projects/${id}`, formValues)
        dispatch({ type: UPDATE_PROJECT, payload: response.data })
    } catch (e) {
        console.log(e.response)
    } finally {
        dispatch({ type: UNSET_ACTION_LOADING })
    }
}

export const deleteProject = id => async dispatch => {
    dispatch({ type: SET_ACTION_LOADING })
    try {
        const response = await progress.delete(`/projects/${id}`)
        dispatch({ type: DELETE_PROJECT, payload: response.data._id })
    } catch (e) {
        console.log(e.response)
    } finally {
        dispatch({ type: UNSET_ACTION_LOADING })
    }
}

export const setActiveProject = project => {
    return {
        type: SET_ACTIVE_PROJECT,
        payload: project
    }
}

export const fetchBacklogs = async projectId => {
    return new Promise(async (res, rej) => {
        try {
            const response = await progress.get(`/backlogs/projects/${projectId}`)
            const data = response.data

            // making the data for the reducers ready
            let issues = []
            let todos = []
            data.issue.forEach(i => {
                issues.push({ ..._.omit(i, 'todo') })
                i.todo.forEach(t => {
                    todos.push({ ...t, issueId: i._id })
                });
            });

            res({ backlogIssues: issues, backlogTodos: todos, backlogId: data._id })
        }
        catch (e) {
            rej(e)
        }
    })

}

export const fetchSprints = projectId => {
    return new Promise(async (res, rej) => {
        try {
            const response = await progress.get(`/sprints/projects/${projectId}`)
            const data = response.data
            
            // making the data for the reducers ready
            let sprints = []
            let issues = []
            let todos = []
            data.forEach(s => {
                sprints.push(_.omit(s, 'issue'))
                s.issue.forEach(i => {
                    issues.push({ ..._.omit(i, 'todo'), sprintId: s._id })
                    i.todo.forEach(t => {
                        todos.push({ ...t, issue: i._id })
                    });
                });
            });

            res({ sprints, sprintIssues: issues, sprintTodos: todos })
        } catch (e) {
            rej(e)
        }
    })
}

export const fetchBacklogAndSprints = projectId => async dispatch => {
    dispatch({ type: SET_FETCH_LOADING })
    try {
        const data = await Promise.all([fetchBacklogs(projectId), fetchSprints(projectId)])
        const { backlogIssues, backlogTodos, backlogId } = data[0]
        const { sprints, sprintIssues, sprintTodos } = data[1]
        
        dispatch({ type: SET_BACKLOG_ISSUES, payload: backlogIssues })
        dispatch({ type: SET_TODOS, payload: backlogTodos })
        dispatch({ type: SET_BACKLOG, payload: backlogId })
        dispatch({ type: SET_SPRINTS, payload: sprints })
        dispatch({ type: SET_TODOS, payload: sprintTodos })
        dispatch({ type: SET_SPRINT_ISSUES, payload: sprintIssues })
    } catch (e) {
        console.log(e.response)
    } finally {
        dispatch({ type: UNSET_FETCH_LOADING })
    }
}