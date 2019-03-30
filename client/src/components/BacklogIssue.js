import React from 'react'
import { DragSource, DropTarget } from 'react-dnd'
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
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

function collectToBacklog(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        hovered: monitor.isOver(),
        item: monitor.getItem(),
        canDrop: monitor.canDrop()
    }
}

class BacklogIssue extends React.Component {
    render() {
        const { issue, isDragging, canDrop, hovered, connectDragSource, connectDropTarget } = this.props
        const opacity = isDragging ? 0 : 1
        let backgroundColor = 'aliceblue'
        if (canDrop) {
            backgroundColor = 'lightgreen'
        } if (hovered) {
            backgroundColor = 'gray'
        }
        
        return connectDragSource(
            connectDropTarget(
                <div style={{ cursor: 'move', opacity, backgroundColor, padding: 20, margin: 15 }}>
                    <div>{issue._id}</div>
                    <div>{issue.description}</div>
                    {/* <FaArrowAltCircleUp onClick={() => this.props.transferIssueToSprint(i._id, sprints[0]._id)} /> */}
                </div>
            ))
    }
}

export default flow(
    DragSource('toSprint', itemSource, collectToSprint),
    DropTarget('toBacklog', {}, collectToBacklog)
)(BacklogIssue)