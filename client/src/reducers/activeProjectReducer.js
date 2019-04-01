import { SET_ACTIVE_PROJECT, SET_BACKLOG } from '../actions/types'

export default (state = null, action) => {
    switch (action.type) {
        case SET_ACTIVE_PROJECT:
            return action.payload
        case SET_BACKLOG:
            return { ...state, backlogId: action.payload }
        default:
            return state
    }
}