import { SET_ACTION_LOADING, UNSET_ACTION_LOADING, SET_FETCH_LOADING, UNSET_FETCH_LOADING, SET_AUTO_LOGGED_IN } from '../actions/types'

const INITAL_STATE = {
    actionLoading: false,
    fetchLoading: false,
    autoLoggedIn: false
}

export default (state = INITAL_STATE, action) => {
    switch (action.type) {

        case SET_FETCH_LOADING:
            return { ...state, fetchLoading: true }

        case UNSET_FETCH_LOADING:
            return { ...state, fetchLoading: false }

        case SET_ACTION_LOADING:
            return { ...state, actionLoading: true }

        case UNSET_ACTION_LOADING:
            return { ...state, actionLoading: false }

        case SET_AUTO_LOGGED_IN:
            return { ...state, autoLoggedIn: true }

        default:
            return state
    }
}