import _ from 'lodash'

import { CREATE_PROJECT, FETCH_PROJECTS, UPDATE_PROJECT, DELETE_PROJECT, SET_ACTIVE_PROJECT } from '../actions/types'

const DEFAULT_STATE = null
// object
export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case SET_ACTIVE_PROJECT:
            return action.payload
        default:
            return state
    }
}