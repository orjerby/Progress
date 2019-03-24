import { CREATE_PROJECT, FETCH_PROJECTS, UPDATE_PROJECT, DELETE_PROJECT } from '../actions/types'

const DEFAULT_STATE = []

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case FETCH_PROJECTS:
            return action.payload
        default:
            return state
    }
}