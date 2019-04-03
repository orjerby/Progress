import _ from 'lodash'

import { CREATE_PROJECT, FETCH_PROJECTS, UPDATE_PROJECT, DELETE_PROJECT, SET_ACTIVE_PROJECT, SET_FETCH_LOADING, UNSET_FETCH_LOADING, SET_ACTION_LOADING, UNSET_ACTION_LOADING, SET_BACKLOG_ISSUES, SET_TODOS, SET_SPRINT_ISSUES, SET_BACKLOG, SET_SPRINTS } from './types'
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

export const fetchBacklogAndSprints = projectId => async dispatch => {
    dispatch({ type: SET_FETCH_LOADING })
    try {
        const response = await progress.get(`/projects/${projectId}`)
        const {backlog:backlogData, sprints: sprintsData} = response.data

        let backlogIssues = []
        let backlogTodos = []
        backlogData.issue.forEach(i => {
            backlogIssues.push({ ..._.omit(i, 'todo') })
            i.todo.forEach(t => {
                backlogTodos.push({ ...t, issueId: i._id })
            });
        });

        let sprints = []
        let sprintIssues = []
        let sprintTodos = []
        sprintsData.forEach(s => {
            sprints.push(_.omit(s, 'issue'))
            s.issue.forEach(i => {
                sprintIssues.push({ ..._.omit(i, 'todo'), sprintId: s._id })
                i.todo.forEach(t => {
                    sprintTodos.push({ ...t, issueId: i._id })
                });
            });
        });

        dispatch({ type: SET_BACKLOG_ISSUES, payload: backlogIssues })
        dispatch({ type: SET_TODOS, payload: backlogTodos })
        dispatch({ type: SET_BACKLOG, payload: backlogData._id })

        dispatch({ type: SET_SPRINTS, payload: sprints })
        dispatch({ type: SET_SPRINT_ISSUES, payload: sprintIssues })
        dispatch({ type: SET_TODOS, payload: sprintTodos })
    } catch (e) {
        console.log(e.response)
    } finally {
        dispatch({ type: UNSET_FETCH_LOADING })
    }
}