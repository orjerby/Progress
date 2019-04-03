import React from 'react'
import { connect } from 'react-redux'

import { fetchProjects, setActiveProject, fetchBacklogAndSprints } from '../../actions/projects'
import history from '../../history'
import Item from './Item'

class ProjectItem extends React.Component {

    componentDidMount = () => {
        this.props.fetchProjects()
    }

    handleChooseProject = (project) => {
        this.props.setActiveProject(project)
        this.props.fetchBacklogAndSprints(project._id)
    }

    render() {
        const { projects } = this.props

        return (
            <div>
                <Item
                    handleClick={() => history.push('/')}
                    handleOptionsClick={this.handleChooseProject}
                    picture='https://img.icons8.com/material/4ac144/256/twitter.png'
                    text='orjerby'
                    subText={this.props.activeProject && this.props.activeProject.name}
                    optionItems={projects}
                    header
                />
            </div>
        )
    }
}

function mapStateToProps({ projectReducer, activeProjectReducer }) {
    return {
        projects: projectReducer,
        activeProject: activeProjectReducer
    }
}

export default connect(mapStateToProps, { fetchProjects, setActiveProject, fetchBacklogAndSprints })(ProjectItem)
