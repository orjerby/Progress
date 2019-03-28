import React from 'react'
import { connect } from 'react-redux'
import { ListGroup, Form, Button, Dropdown } from 'react-bootstrap'
import { FaArrowAltCircleUp, FaArrowAltCircleDown } from "react-icons/fa"

import { fetchProjects, createProject, deleteProject, setActiveProject, fetchBacklogs, fetchSprints, transferToSprint, transferToBacklog } from '../actions'

class Dashboard extends React.Component {
    state = {
        name: undefined,
        description: undefined,
        activeProject: undefined
    }

    componentDidMount = () => {
        this.props.fetchProjects()
    }

    createProject = () => {
        this.props.createProject({
            name: this.state.name,
            description: this.state.description
        })
    }

    deleteProject = (id) => {
        this.props.deleteProject(id)
    }

    renderList = () => {
        return this.props.projects.map(project => {
            return (
                <ListGroup key={project._id}>
                    <ListGroup.Item style={{ cursor: 'pointer' }} action variant="info">
                        {project.name} - {project.description}
                    </ListGroup.Item>
                    <Button variant="danger" onClick={() => this.deleteProject(project._id)}>
                        Delete project
                        </Button>
                </ListGroup>
            )
        })
    }

    renderAddForm = () => {
        return (
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Project name" onChange={(e) => this.setState({ name: e.target.value })} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" placeholder="Project description" onChange={(e) => this.setState({ description: e.target.value })} />
                </Form.Group>
                <Button variant="primary" onClick={this.createProject}>
                    Add project
                        </Button>
            </Form>
        )
    }

    setActiveProject = (project) => {
        this.props.setActiveProject(project)
        this.props.fetchBacklogs(project._id)
        this.props.fetchSprints(project._id)
    }

    renderSprints = () => {
        const { activeProject, sprints, sprintIssues } = this.props
        let result = []

        sprints.forEach(s => {
            result.push(<h3 key={s._id}>{s.description}</h3>)
            return sprintIssues.forEach(i => {
                if (s._id === i.sprint) {
                    result.push(
                        <div key={i._id}>
                            <span>{i.description}</span>   <FaArrowAltCircleDown onClick={() => this.props.transferToBacklog(i._id, activeProject.backlog)} />
                        </div>
                    )
                }
            })
        })

        return result

    }

    render() {
        const { projects, activeProject, backlogIssues, sprints } = this.props
        return (
            <div>

                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">{activeProject ? activeProject.name : 'My projects'}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {projects.map(p => <Dropdown.Item key={p._id} onClick={() => this.setActiveProject(p)}>{p.name}</Dropdown.Item>)}
                    </Dropdown.Menu>
                </Dropdown>

                <hr />


                <h2>Sprints</h2>
                {this.renderSprints()}



                <hr />

                <h2>Backlogs</h2>
                {backlogIssues && backlogIssues.map(i => <div key={i._id}><span>{i.description}</span>   <FaArrowAltCircleUp onClick={() => this.props.transferToSprint(i._id, sprints[0]._id)} /></div>)}

                {/* {this.renderList()} */}

                <hr />
                {/* 
                {this.renderAddForm()} */}
            </div>
        )
    }
}

// get the data of whatever reducer you want
function mapStateToProps({ projectReducer, activeProjectReducer, backlogIssueReducer, sprintReducer, sprintIssueReducer }) {
    return {
        projects: projectReducer,
        activeProject: activeProjectReducer,
        backlogIssues: backlogIssueReducer,
        sprints: sprintReducer,
        sprintIssues: sprintIssueReducer
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
    transferToSprint,
    transferToBacklog
}

// connect redux with react
export default connect(mapStateToProps, actions)(Dashboard)