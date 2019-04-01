import React from 'react'
import { connect } from 'react-redux'
import { DragSource } from 'react-dnd'
import _ from 'lodash'

import { deleteSprintIssue, updateSprintIssue } from '../actions/issues'
import PopupHandle from './PopupHandle'
import IssueForm from './IssueForm'
import DeleteIssue from './DeleteIssue'

class SprintIssue extends React.Component {
    state = {
        showPopup: false
    }

    render() {
        const { issue, connectDragSource, isDragging } = this.props
        const opacity = isDragging ? 0 : 1

        return connectDragSource(
            <div style={{ opacity, cursor: 'move', padding: 20, marginBottom: 5, backgroundColor: 'white' }}>
                <div>{issue._id}</div>
                <div>{issue.description}</div>

                <PopupHandle
                    buttonText='Delete'
                    Component={DeleteIssue}
                    onSubmit={() => this.props.deleteSprintIssue(issue._id)}
                />

                <PopupHandle
                    buttonText='Edit'
                    Component={IssueForm}
                    initialValues={_.pick(issue, 'description')}
                    onSubmit={(updatedIssue) => this.props.updateSprintIssue(updatedIssue, issue._id)}
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

function collectToBacklog(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

const connector = connect(null, { deleteSprintIssue, updateSprintIssue })(SprintIssue)

export default DragSource('toBacklog', itemSource, collectToBacklog)(connector)