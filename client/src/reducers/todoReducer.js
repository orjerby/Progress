import { SET_TODOS } from '../actions/types'

export default (state = [], action) => {
    switch (action.type) {
        case SET_TODOS:
            return action.payload
        default:
            return state
    }
}