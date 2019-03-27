import { CREATE_PROJECT, FETCH_PROJECTS, UPDATE_PROJECT, DELETE_PROJECT, SET_ACTIVE_PROJECT, FETCH_BACKLOGS, FETCH_SPRINTS, TRANSFTER_TO_SPRINT, TRANSFTER_TO_BACKLOG } from './types'
import progress from '../apis/progress'

export const createProject = formValues => async dispatch => {
    try {
        const response = await progress.post('/projects', formValues)
        dispatch({ type: CREATE_PROJECT, payload: response.data })
    } catch (e) {
        console.log(e.response)
    }
};

export const fetchProjects = () => async dispatch => {
    try {
        const response = await progress.get('/projects')
        dispatch({ type: FETCH_PROJECTS, payload: response.data })
    } catch (e) {
        console.log(e.response)
    }
};

export const updateProject = (id, formValues) => async dispatch => {
    try {
        const response = await progress.patch(`/projects/${id}`, formValues)
        dispatch({ type: UPDATE_PROJECT, payload: response.data })
    } catch (e) {
        console.log(e.response)
    }
};

export const deleteProject = id => async dispatch => {
    try {
        const response = await progress.delete(`/projects/${id}`)
        dispatch({ type: DELETE_PROJECT, payload: response.data._id })
    } catch (e) {
        console.log(e.response)
    }
};

export const setActiveProject = (project) => {
    return {
        type: SET_ACTIVE_PROJECT,
        payload: project
    }
}

export const fetchBacklogs = id => async dispatch => {
    try {
        const response = await progress.get(`/backlogs?projectid=${id}`)
        dispatch({ type: FETCH_BACKLOGS, payload: response.data })
    } catch (e) {
        console.log(e.response)
    }
}

export const fetchSprints = id => async dispatch => {
    try {
        const response = await progress.get(`/sprints?projectid=${id}`)
        dispatch({ type: FETCH_SPRINTS, payload: response.data })
    } catch (e) {
        console.log(e.response)
    }
}

export const transferToSprint = (id, sprintId) => async dispatch => {
    try {
        const response = await progress.post('/issues?transferto=sprint', { sprint: sprintId, issue: id })
        dispatch({ type: TRANSFTER_TO_SPRINT, payload: { data: response.data, id } })
    } catch (e) {
        console.log(e.response)
    }
}

export const transferToBacklog = (id, backlogId) => async dispatch => {
    try {
        const response = await progress.post('/issues?transferto=backlog', { backlog: backlogId, issue: id })
        dispatch({ type: TRANSFTER_TO_BACKLOG, payload: { data: response.data, id } })
    } catch (e) {
        console.log(e.response)
    }
}