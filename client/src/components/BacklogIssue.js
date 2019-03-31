import React from 'react'
import { connect } from 'react-redux'
import { DragSource } from 'react-dnd'

import { deleteBacklogIssue } from '../actions'

class BacklogIssue extends React.Component {
    render() {
        const { issue, isDragging, connectDragSource } = this.props
        const opacity = isDragging ? 0 : 1

        return connectDragSource(
            <div style={{ opacity, padding: 20, cursor: 'move', marginBottom: 5, backgroundColor: 'white' }}>
                <div>{issue._id}</div>
                <div>{issue.description}</div>
                <button onClick={() => this.props.deleteBacklogIssue(issue._id)}>Delete</button>
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

function collectToSprint(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

const connector = connect(null, { deleteBacklogIssue })(BacklogIssue)

export default DragSource('toSprint', itemSource, collectToSprint)(connector)