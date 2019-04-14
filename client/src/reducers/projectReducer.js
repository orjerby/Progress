import { FETCH_PROJECTS, UNSET_PROJECTS } from '../actions/types'

export default (state = [], action) => {
    switch (action.type) {
        case FETCH_PROJECTS:
            return action.payload
        case UNSET_PROJECTS:
            return []
        // case CREATE_PROJECT:
        //     return { ...state, [action.payload._id]: action.payload };
        // case UPDATE_PROJECT:
        //     return { ...state, [action.payload._id]: action.payload };
        // case DELETE_PROJECT:
        //     return _.omit(state, action.payload);
        default:
            return state
    }
}