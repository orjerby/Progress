import React from 'react'
import { DragSource } from 'react-dnd'

class BacklogIssue extends React.Component {
    render() {
        const { issue, isDragging, connectDragSource, connectDropTarget } = this.props
        const opacity = isDragging ? 0 : 1

        return connectDragSource(
            <div style={{ opacity, padding: 20, cursor: 'move' }}>
                <div>{issue._id}</div>
                <div>{issue.description}</div>
                {/* <FaArrowAltCircleUp onClick={() => this.props.transferIssueToSprint(i._id, sprints[0]._id)} /> */}
            </div>
        )
    }
}

const itemSource = {
    beginDrag(props) {
        console.log('dragging', props)
        props.handleDragged(props.issue._id)
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

export default DragSource('toSprint', itemSource, collectToSprint)(BacklogIssue)