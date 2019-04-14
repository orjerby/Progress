import { SET_ACTION_LOADING, UNSET_ACTION_LOADING, SET_FETCH_LOADING, UNSET_FETCH_LOADING, SET_LOGGING_LOADING, UNSET_LOGGING_LOADING } from '../actions/types'

const INITAL_STATE = {
    actionLoading: false,
    fetchLoading: false,
    loginLoading: false
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

        case SET_LOGGING_LOADING:
            return { ...state, loginLoading: true }

        case UNSET_LOGGING_LOADING:
            return { ...state, loginLoading: false }

        default:
            return state
    }
}