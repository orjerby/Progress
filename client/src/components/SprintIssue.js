import React from 'react'
import { connect } from 'react-redux'
import { DragSource } from 'react-dnd'

import { deleteSprintIssue } from '../actions'

class SprintIssue extends React.Component {
    render() {
        const { issue, connectDragSource, isDragging } = this.props
        const opacity = isDragging ? 0 : 1

        return connectDragSource(
            <div style={{ opacity, cursor: 'move', padding: 20, marginBottom: 5, backgroundColor: 'white' }}>
                <div>{issue._id}</div>
                <div>{issue.description}</div>
                <button onClick={() => this.props.deleteSprintIssue(issue._id)}>Delete</button>
                {/* <FaArrowAltCircleUp onClick={() => this.props.transferIssueToSprint(i._id, sprints[0]._id)} /> */}
            </div>
        )
    }
}

const itemSource = {
    beginDrag(props) {
        console.log('dragging', props)

        props.handleDragged(props.issue)
        return props.issue
    },
    endDrag(props, monitor, component) {
        if (!monitor.didDrop()) {
            return
        }

        return props.handleDrop(props.issue._id)
    }
}

function collectToBacklog(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

const connector = connect(null, { deleteSprintIssue })(SprintIssue)

export default DragSource('toBacklog', itemSource, collectToBacklog)(connector)