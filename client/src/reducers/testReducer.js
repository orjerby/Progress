import { TEST } from '../actions/types'

const DEFAULT_STATE = {
    result: undefined
}

// reducer with data
// gets all the actions and filter them
// then changes the reducer data accordingly
export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case TEST:
            return { ...state, result: action.payload }
        default:
            return state
    }
}