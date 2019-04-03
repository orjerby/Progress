import _ from 'lodash'

import { CREATE_SPRINT, UPDATE_SPRINT, ROLLBACK_SPRINT, DELETE_SPRINT, SET_ACTION_LOADING, UNSET_ACTION_LOADING } from './types'
import progress from '../apis/progress'

export const createSprint = (sprint, projectId) => async (dispatch, getState) => {
    const { sprintReducer } = getState() // get the reducer before the creation (for rollback)
    const sprintId = Math.floor(Math.random() * 100)
    dispatch({ type: CREATE_SPRINT, payload: { ...sprint, _id: sprintId } })
    dispatch({ type: SET_ACTION_LOADING })
    try {
        const response = await progress.post('/sprints', { projectId, ...sprint })
        const sprintWithoutIssueProperty = _.omit(response.data, 'issue')
        dispatch({
            type: UPDATE_SPRINT,
            payload: { sprintId, sprint: sprintWithoutIssueProperty }
        })
    } catch (e) {
        dispatch({
            type: ROLLBACK_SPRINT,
            payload: sprintReducer
        })
    } finally {
        dispatch({ type: UNSET_ACTION_LOADING })
    }
}

export const updateSprint = (sprint, sprintId) => async (dispatch, getState) => {
    const { sprintReducer } = getState() // get the reducer before the creation (for rollback)
    dispatch({ type: UPDATE_SPRINT, payload: { sprint, sprintId } })
    dispatch({ type: SET_ACTION_LOADING })
    try {
        await progress.patch(`/sprints/${sprintId}`, sprint)
    } catch (e) {
        dispatch({
            type: ROLLBACK_SPRINT,
            payload: sprintReducer
        })
    } finally {
        dispatch({ type: UNSET_ACTION_LOADING })
    }
}

export const deleteSprint = sprintId => async (dispatch, getState) => {
    const { sprintReducer } = getState() // get the reducer before the delete (for rollback)
    dispatch({ type: DELETE_SPRINT, payload: sprintId })
    dispatch({ type: SET_ACTION_LOADING })
    try {
        await progress.delete(`/sprints/${sprintId}`)
    } catch (e) {
        dispatch({
            type: ROLLBACK_SPRINT,
            payload: sprintReducer
        })
    } finally {
        dispatch({ type: UNSET_ACTION_LOADING })
    }
}