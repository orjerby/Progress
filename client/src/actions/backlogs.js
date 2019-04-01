import _ from 'lodash'

import {SET_BACKLOG_ISSUES,SET_TODOS,SET_BACKLOG} from './types'
import progress from '../apis/progress'

export const fetchBacklog = projectId => async dispatch => {
    try {
        const response = await progress.get(`/backlogs?projectId=${projectId}`)
        const data = response.data

        // making the data for the reducers ready
        let issues = []
        let todos = []
        data.issue.forEach(i => {
            issues.push({ ..._.omit(i, 'todo') })
            i.todo.forEach(t => {
                todos.push({ ...t, issueId: i._id })
            });
        });

        dispatch({ type: SET_BACKLOG_ISSUES, payload: issues })
        dispatch({ type: SET_TODOS, payload: todos })
        dispatch({ type: SET_BACKLOG, payload: data._id })
    } catch (e) {
        console.log(e.response)
    }
}