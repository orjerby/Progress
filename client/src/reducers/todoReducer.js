import { SET_TODOS, UNSET_TODOS } from '../actions/types'

export default (state = [], action) => {
    switch (action.type) {
        case SET_TODOS:
            return [...state, ...action.payload]
        case UNSET_TODOS:
            return []
        default:
            return state
    }
}