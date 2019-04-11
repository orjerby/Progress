import progress from '../apis/progress'
import { SET_ACTION_LOADING, UNSET_ACTION_LOADING, SET_USER, SET_FETCH_LOADING, UNSET_FETCH_LOADING } from "./types";

export const loginUser = formValues => async dispatch => {
    dispatch({ type: SET_ACTION_LOADING })
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
        localStorage.setItem("token", response.data.token)
    } catch (e) {
        console.log(e.response)
    } finally {
        dispatch({ type: UNSET_ACTION_LOADING })
    }
}

export const fetchUserByToken = token => async dispatch => {
    dispatch({ type: SET_FETCH_LOADING })
    try {
        const response = await progress.get('/users/me', { headers: { 'Authorization': `Bearer ${token}` } })
        dispatch({
            type: SET_USER,
            payload: { user: response.data, token }
        })
    } catch (e) {
        console.log(e)
    } finally {
        dispatch({ type: UNSET_FETCH_LOADING })
    }
}