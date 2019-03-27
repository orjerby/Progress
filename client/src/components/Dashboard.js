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

        let p = [
            {
                _id: "5c9b5a72b9a2fb22045a39fb",
                issue: [
                    {
                        _id: '123',
                        description: "yoo1"
                    },
                    {
                        _id: '456',
                        description: "yoo2"
                    },
                    {
                        _id: '789',
                        description: "yoo2"
                    }
                ]
            }
        ]

        for(let i =0;i<p.length;i++){
            for(let j=0;j<p[i].issue.length;j++){
                if(p[i].issue[j]._id==='123'){
                    delete p[i].issue[j]
                }
            }
        }

        console.log(p)
        //console.log(z)
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

    render() {
        const { projects, activeProject, backlogs, sprints } = this.props
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

                {
                    sprints && sprints.map(s => {
                        return s.issue.map(i => { return <div key={i._id}>{s.description} {i.description}<span><FaArrowAltCircleDown onClick={() => this.props.transferToBacklog(i._id, backlogs._id)} /></span></div> }
                        )
                    })
                }



                <hr />

                <h2>Backlogs</h2>

                {backlogs && backlogs.issue.map(i => <div key={i._id}><span>{i.description}</span>   <FaArrowAltCircleUp onClick={() => this.props.transferToSprint(i._id, sprints[0]._id)} /></div>)}

                {/* {this.renderList()} */}

                <hr />
                {/* 
                {this.renderAddForm()} */}
            </div>
        )
    }
}

// get the data of whatever reducer you want
function mapStateToProps({ projectReducer, activeProjectReducer, backlogReducer, sprintReducer }) {
    return {
        projects: Object.values(projectReducer),
        activeProject: activeProjectReducer,
        backlogs: backlogReducer,
        sprints: sprintReducer
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