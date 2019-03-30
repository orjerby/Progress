import React from 'react'
import { connect } from 'react-redux'

import BacklogIssue from './BacklogIssue'

class Backlog extends React.Component {

    renderIssues = () => {
        const { backlogIssues } = this.props

        if (backlogIssues) {
            return backlogIssues.map(i => {
                return <BacklogIssue key={i._id} issue={i} handleDrop={_id=>console.log('deleting id: ' + _id)} />
            })
        }
    }

    render() {
        return (
            <div>
                <h2>Backlogs</h2>
                {this.renderIssues()}
            </div>
        )
    }
}

function mapStateToProps({ backlogIssueReducer }) {
    return {
        backlogIssues: backlogIssueReducer
    }
}

export default connect(mapStateToProps)(Backlog)