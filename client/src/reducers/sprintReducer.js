import { SET_SPRINTS, CREATE_SPRINT, UPDATE_SPRINT, ROLLBACK_SPRINT, DELETE_SPRINT, UNSET_SPRINTS } from '../actions/types'

export default (state = [], action) => {
    switch (action.type) {
        case SET_SPRINTS:
            return action.payload

        case UNSET_SPRINTS:
            return []

        case CREATE_SPRINT:
            return [...state, action.payload]

        case UPDATE_SPRINT:
            return state.map(i => {
                if (i._id === action.payload.sprintId) {
                    return { ...i, ...action.payload.sprint }
                }
                return i
            })

        case DELETE_SPRINT:
            return state.filter(i => i._id !== action.payload)

        case ROLLBACK_SPRINT:
            return action.payload

        default:
            return state
    }
}