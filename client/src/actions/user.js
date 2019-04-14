import progress from '../apis/progress'
import { SET_USER, UNSET_USER, SET_LOGGING_LOADING, UNSET_LOGGING_LOADING } from "./types";

export const loginUser = formValues => async dispatch => {
    dispatch({ type: SET_LOGGING_LOADING })
    try {
        const response = await progress.post('/users/login', formValues)
        dispatch({
            type: SET_USER,
            payload: response.data
        })
        localStorage.setItem("token", response.data.token)
    } catch (e) {
        console.log(e)
    } finally {
        dispatch({ type: UNSET_LOGGING_LOADING })
    }
}

export const registerUser = formValues => async dispatch => {
    dispatch({ type: SET_LOGGING_LOADING })
    try {
        const response = await progress.post('/users', formValues)
        dispatch({
            type: SET_USER,
            payload: response.data
        })
        localStorage.setItem("token", response.data.token)
    } catch (e) {
        console.log(e.response)
    } finally {
        dispatch({ type: UNSET_LOGGING_LOADING })
    }
}

export const fetchUserByToken = token => async dispatch => {
    dispatch({ type: SET_LOGGING_LOADING })
    try {
        const response = await progress.get('/users/me', { headers: { 'Authorization': `Bearer ${token}` } })
        dispatch({
            type: SET_USER,
            payload: { user: response.data, token }
        })
    } catch (e) {
        console.log(e)
    } finally {
        dispatch({ type: UNSET_LOGGING_LOADING })
    }
}

export const logoutUser = token => async dispatch => {
    dispatch({ type: SET_LOGGING_LOADING })
    try {
        await progress.post('/users/logout', null, { headers: { 'Authorization': `Bearer ${token}` } })
        dispatch({
            type: UNSET_USER
        })
        localStorage.removeItem('token')
    } catch (e) {
        console.log(e)
    } finally {
        dispatch({ type: UNSET_LOGGING_LOADING })
    }
}