import React from 'react'
import { connect } from 'react-redux'
import { DragSource } from 'react-dnd'
import _ from 'lodash'

import { deleteBacklogIssue, updateBacklogIssue } from '../actions/issues'
import IssueForm from './IssueForm'
import PopupHandle from './PopupHandle'
import DeleteIssue from './DeleteIssue'

class BacklogIssue extends React.Component {

    render() {
        const { issue, isDragging, connectDragSource } = this.props
        const opacity = isDragging ? 0 : 1

        return connectDragSource(
            <div style={{ opacity, padding: 20, cursor: 'move', marginBottom: 5, backgroundColor: 'white' }}>
                <div>{issue._id}</div>
                <div>{issue.description}</div>

                <PopupHandle
                    buttonText='Delete'
                    Component={DeleteIssue}
                    onSubmit={() => this.props.deleteBacklogIssue(issue._id)}
                />

                <PopupHandle
                    buttonText='Edit'
                    Component={IssueForm}
                    initialValues={_.pick(issue, 'description')}
                    onSubmit={(updatedIssue) => this.props.updateBacklogIssue(updatedIssue, issue._id)}
                />
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

const connector = connect(null, { deleteBacklogIssue, updateBacklogIssue })(BacklogIssue)

export default DragSource('toSprint', itemSource, collectToSprint)(connector)