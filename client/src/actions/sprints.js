import _ from 'lodash'

import { SET_SPRINTS, SET_SPRINT_ISSUES, SET_TODOS } from './types'
import progress from '../apis/progress'

export const fetchSprints = projectId => async dispatch => {
    try {
        const response = await progress.get(`/sprints?projectId=${projectId}`)
        const data = response.data
        // making the data for the reducers ready
        let sprints = []
        let issues = []
        let todos = []
        data.forEach(s => {
            sprints.push(_.omit(s, 'issue'))
            s.issue.forEach(i => {
                issues.push({ ..._.omit(i, 'todo'), sprintId: s._id })
                i.todo.forEach(t => {
                    todos.push({ ...t, issueId: i._id })
                });
            });
        });

        dispatch({ type: SET_SPRINTS, payload: sprints })
        dispatch({ type: SET_SPRINT_ISSUES, payload: issues })
        dispatch({ type: SET_TODOS, payload: todos })
    } catch (e) {
        console.log(e.response)
    }
}