import { CREATE_PROJECT, FETCH_PROJECTS, UPDATE_PROJECT, DELETE_PROJECT, SET_ACTIVE_PROJECT, FETCH_BACKLOGS, FETCH_SPRINTS, TRANSFTER_TO_SPRINT, TRANSFTER_TO_BACKLOG } from '../actions/types'

const DEFAULT_STATE = []
// array
export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case FETCH_SPRINTS:
            return action.payload
        case TRANSFTER_TO_BACKLOG:

            let z
            state.forEach(s => {
                z = s.issue.filter(i => i._id !== action.payload.id)
            })

            console.log('a', state)
            let p
            state.forEach(s => {
                p = s.issue.filter(i => i._id !== action.payload.id)
            })
            console.log('b', p)
            return [...state]
        case TRANSFTER_TO_SPRINT:
            return [...state, { issue: action.payload.data }]
        default:
            return state
    }
}