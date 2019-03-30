import React from 'react'
import { connect } from 'react-redux'

import { transferIssueToSprint } from '../actions'
import Sprint from './Sprint'

class SprintList extends React.Component {
    render() {
        return (
            <div>
                <h2>Sprints</h2>
                {
                    this.props.sprints.map(s => {
                        return <div key={s._id}>
                            <h2>{s.description}</h2>
                            <Sprint sprint={s} handleDrop={(sprint) => this.props.transferIssueToSprint(this.props.issueId, sprint._id)} handleDragged={this.props.handleDragged} />
                        </div>
                    })
                }
            </div>
        )
    }
}

function mapStateToProps({ sprintReducer }) {
    return {
        sprints: sprintReducer
    }
}

export default connect(mapStateToProps, { transferIssueToSprint })(SprintList)