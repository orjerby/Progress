import progress from '../apis/progress'
import { SET_USER, UNSET_USER, SET_AUTO_LOGGED_IN, SET_ACTION_LOADING, UNSET_ACTION_LOADING, UNSET_BACKLOG, UNSET_SPRINTS, UNSET_PROJECTS, UNSET_ACTIVE_PROJECT, UNSET_TODOS } from "./types";

export const loginUser = formValues => async dispatch => {
    dispatch({ type: SET_ACTION_LOADING })
    try {
        const response = await progress.post('/users/login', formValues)
        dispatch({
            type: SET_USER,
            payload: response.data
        })
    } catch (e) {
        console.log(e)
    } finally {
        dispatch({ type: UNSET_ACTION_LOADING })
    }
}

export const registerUser = formValues => async dispatch => {
    dispatch({ type: SET_ACTION_LOADING })
    try {
        const response = await progress.post('/users', formValues)
        dispatch({
            type: SET_USER,
            payload: response.data
        })
    } catch (e) {
        console.log(e.response)
    } finally {
        dispatch({ type: UNSET_ACTION_LOADING })
    }
}

export const fetchUserByToken = () => async dispatch => {
    try {
        const response = await progress.get('/users/me')
        dispatch({
            type: SET_USER,
            payload: response.data
        })
    } catch (e) {
        console.log(e)
    } finally {
        dispatch({ type: SET_AUTO_LOGGED_IN })
    }
}

export const logoutUser = token => async dispatch => {
    dispatch({ type: SET_ACTION_LOADING })
    try {
        await progress.post('/users/logout', null)
        dispatch({
            type: UNSET_USER
        })
    } catch (e) {
        console.log(e)
    } finally {
        dispatch({ type: UNSET_ACTION_LOADING })
        
        dispatch({ type: UNSET_BACKLOG })
        dispatch({ type: UNSET_SPRINTS })
        dispatch({ type: UNSET_PROJECTS })
        dispatch({ type: UNSET_ACTIVE_PROJECT })
        dispatch({ type: UNSET_TODOS })
    }
}