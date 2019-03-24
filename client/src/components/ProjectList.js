import React from 'react'
import { connect } from 'react-redux'
import { ListGroup, Form, Button } from 'react-bootstrap'

import { fetchProjects, createProject, deleteProject } from '../actions'

class ProjectList extends React.Component {
    state = {
        name: undefined,
        description: undefined
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

    render() {
        return (
            <div>
                {this.renderList()}

                <hr />

                {this.renderAddForm()}
            </div>
        )
    }
}

// get the data of whatever reducer you want
function mapStateToProps({ projectReducer }) {
    return {
        projects: Object.values(projectReducer)
    }
}

// get whatever action you want
const actions = {
    fetchProjects,
    createProject,
    deleteProject
}

// connect redux with react
export default connect(mapStateToProps, actions)(ProjectList)