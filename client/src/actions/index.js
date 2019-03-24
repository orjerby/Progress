import { CREATE_PROJECT, FETCH_PROJECTS, UPDATE_PROJECT, DELETE_PROJECT } from './types'
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
        dispatch({ type: DELETE_PROJECT, payload: response.data })
    } catch (e) {
        console.log(e.response)
    }
};