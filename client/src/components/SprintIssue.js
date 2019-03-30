import React from 'react'
import { DropTarget, DragSource } from 'react-dnd'
import flow from 'lodash/flow'

const itemSource = {
    beginDrag(props) {
        console.log('dragging', props)
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
        connectDropTarget: connect.dropTarget(),
        hovered: monitor.isOver(),
        item: monitor.getItem(),
        canDrop: monitor.canDrop()
    }
}

function collectToBacklog(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

class SprintIssue extends React.Component {
    render() {
        const { issue, connectDropTarget, hovered, canDrop, connectDragSource, isDragging } = this.props
        const opacity = isDragging ? 0 : 1
        let backgroundColor = 'aliceblue'
        if (canDrop) {
            backgroundColor = 'lightgreen'
        } if (hovered) {
            backgroundColor = 'gray'
        }

        return connectDropTarget(
            connectDragSource(
                <div style={{ cursor: 'move', backgroundColor, opacity, padding: 20, margin: 15 }}>
                    <div>{issue._id}</div>
                    <div>{issue.description}</div>
                    {/* <FaArrowAltCircleUp onClick={() => this.props.transferIssueToSprint(i._id, sprints[0]._id)} /> */}
                </div>
            ))
    }
}

export default flow(
    DropTarget('toSprint', {}, collectToSprint),
    DragSource('toBacklog', itemSource, collectToBacklog),
)(SprintIssue)