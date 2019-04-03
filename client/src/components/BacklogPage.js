import React from 'react'
import { connect } from 'react-redux'

import Backlog from './Backlog'
import SprintList from './SprintList'
import { fetchProjects, createProject, deleteProject, setActiveProject } from '../actions/projects'
import { transferIssueToSprint, transferIssueToBacklog } from '../actions/issues'

class BacklogPage extends React.Component {

    render() {

        if (this.props.api.fetchLoading) {
            return <></>
        }

        return (
            <div>


                {
                    this.props.activeProject ? (
                        <div>

                            <h3 style={{ marginBottom: 20 }}>Backlog</h3>

                            <SprintList />


                            <Backlog handleDrop={() => this.props.transferIssueToBacklog(this.props.draggedIssue, this.props.activeProject.backlogId)} />
                        </div>
                    ) :
                        <h1>Select project!</h1>
                }

                {
                    this.props.api.actionLoading &&
                    <div style={{ width: 100, height: 100, backgroundColor: 'red' }}></div>
                }
            </div>
        )
    }
}

// get the data of whatever reducer you want
function mapStateToProps({ projectReducer, activeProjectReducer, backlogIssueReducer, sprintReducer, sprintIssueReducer, todoReducer, draggedReducer, apiReducer }) {
    return {
        projects: projectReducer,
        activeProject: activeProjectReducer,
        backlogIssues: backlogIssueReducer,
        sprints: sprintReducer,
        sprintIssues: sprintIssueReducer,
        todos: todoReducer,
        draggedIssue: draggedReducer,
        api: apiReducer
    }
}

// get whatever action you want
const actions = {
    fetchProjects,
    createProject,
    deleteProject,
    setActiveProject,
    transferIssueToSprint,
    transferIssueToBacklog
}

// connect redux with react
export default connect(mapStateToProps, actions)(BacklogPage)