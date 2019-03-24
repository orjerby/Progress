import _ from 'lodash'

import { CREATE_PROJECT, FETCH_PROJECTS, UPDATE_PROJECT, DELETE_PROJECT } from '../actions/types'

const DEFAULT_STATE = {}

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case FETCH_PROJECTS:
            return { ...state, ..._.mapKeys(action.payload, '_id') }
        case CREATE_PROJECT:
            return { ...state, [action.payload._id]: action.payload };
        case UPDATE_PROJECT:
            return { ...state, [action.payload._id]: action.payload };
        case DELETE_PROJECT:
            return _.omit(state, action.payload);
        default:
            return state
    }
}