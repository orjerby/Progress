import React from 'react'
import { connect } from 'react-redux'

import SprintIssue from './SprintIssue'

class Sprint extends React.Component {

    renderSprints = () => {
        const { activeProject, sprints, sprintIssues } = this.props
        let result = []

        sprints.forEach(s => {
            result.push(<h3 key={s._id}>{s.description}</h3>)
            return sprintIssues.forEach(i => {
                if (s._id === i.sprint) {
                    result.push(
                        <SprintIssue key={i._id} issue={i} handleDrop={_id=>console.log('deleting id: ' + _id)} />
                    )
                }
            })
        })

        return result
    }

    render() {
        return (
            <div>
                <h2>Sprints</h2>
                {this.renderSprints()}
            </div>
        )
    }
}

function mapStateToProps({ sprintReducer, sprintIssueReducer }) {
    return {
        sprints: sprintReducer,
        sprintIssues: sprintIssueReducer
    }
}

export default connect(mapStateToProps)(Sprint)