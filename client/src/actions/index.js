import { TEST } from './types'

// action creator that return sync action
export const test = (value) => {
    return {
        type: TEST,
        payload: value
    }
}