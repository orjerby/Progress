import React from 'react'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'

import SprintIssue from './SprintIssue'

class Sprint extends React.Component {
    renderSprint = () => {
        const { sprint, sprintIssues } = this.props

        let foundIssues = false
        const results = sprintIssues.map(i => {
            if (sprint._id === i.sprint) {
                foundIssues = true
                return <SprintIssue key={i._id} issue={i} handleDrop={_id => console.log('deleting id: ' + _id)} handleDragged={this.props.handleDragged} />
            }
        })

        if (!foundIssues) {
            return <div>There are no issues here</div>
        }

        return results
    }

    render() {
        const { connectDropTarget, canDrop, hovered } = this.props
        let backgroundColor = 'aliceblue'
        if (canDrop) {
            backgroundColor = 'lightgreen'
        }
        if (hovered) {
            backgroundColor = 'gray'
        }

        return connectDropTarget(
            <div style={{ backgroundColor, }}>
                {this.renderSprint()}
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

const itemSource = {
    drop(props, monitor, component) {
        props.handleDrop(props.sprint)
    }
}

function collectToSprint(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        hovered: monitor.isOver(),
        item: monitor.getItem(),
        canDrop: monitor.canDrop()
    }
}

const connector = connect(mapStateToProps)(Sprint)

export default DropTarget('toSprint', itemSource, collectToSprint)(connector)