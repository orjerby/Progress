import React from 'react'
import { connect } from 'react-redux'
import { Dropdown } from 'react-bootstrap'
import { FaArrowAltCircleUp, FaArrowAltCircleDown } from "react-icons/fa"

import Backlog from './Backlog'
import SprintList from './SprintList'
import { fetchProjects, createProject, deleteProject, setActiveProject, fetchBacklogs, fetchSprints, transferIssueToSprint, transferIssueToBacklog } from '../actions'

class Dashboard extends React.Component {
    componentDidMount = () => {
        this.props.fetchProjects()
    }

    setActiveProject = (project) => {
        this.props.setActiveProject(project)
        this.props.fetchBacklogs(project._id)
        this.props.fetchSprints(project._id)
    }


    renderDropdown = () => {
        const { projects, activeProject } = this.props

        return <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">{activeProject ? activeProject.name : 'My projects'}</Dropdown.Toggle>
            <Dropdown.Menu>
                {projects.map(p => <Dropdown.Item key={p._id} onClick={() => this.setActiveProject(p)}>{p.name}</Dropdown.Item>)}
            </Dropdown.Menu>
        </Dropdown>
    }

    render() {
        return (
            <div>
                {this.renderDropdown()}

                <hr />
                {
                    this.props.activeProject && (
                        <div>
                            <SprintList />

                            <hr />

                            <Backlog handleDrop={() => this.props.transferIssueToBacklog(this.props.draggedIssue, this.props.activeProject.backlog)} />
                        </div>
                    )
                }
            </div>
        )
    }
}

// get the data of whatever reducer you want
function mapStateToProps({ projectReducer, activeProjectReducer, backlogIssueReducer, sprintReducer, sprintIssueReducer, todoReducer, draggedReducer }) {
    return {
        projects: projectReducer,
        activeProject: activeProjectReducer,
        backlogIssues: backlogIssueReducer,
        sprints: sprintReducer,
        sprintIssues: sprintIssueReducer,
        todos: todoReducer,
        draggedIssue: draggedReducer
    }
}

// get whatever action you want
const actions = {
    fetchProjects,
    createProject,
    deleteProject,
    setActiveProject,
    fetchBacklogs,
    fetchSprints,
    transferIssueToSprint,
    transferIssueToBacklog
}

// connect redux with react
export default connect(mapStateToProps, actions)(Dashboard)