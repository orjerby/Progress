import { SET_USER } from "../actions/types";

export default (state = null, action) => {
    switch (action.type) {
        case SET_USER:
            return { ...action.payload.user, token: action.payload.token }
        default:
            return state
    }
}