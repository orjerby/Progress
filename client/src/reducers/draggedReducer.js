import { SET_DRAGGED, UNSET_DRAGGED } from '../actions/types'

export default (state = null, action) => {
    switch (action.type) {
        case SET_DRAGGED:
            return action.payload
        case UNSET_DRAGGED:
            return null
        default:
            return state
    }
}