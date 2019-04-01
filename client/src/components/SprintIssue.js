import React from 'react'
import { connect } from 'react-redux'
import { DragSource } from 'react-dnd'
import _ from 'lodash'

import { deleteSprintIssue, updateSprintIssue } from '../actions/issues'
import Popup from './Popup'
import IssueForm from './IssueForm'

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
                <button onClick={() => this.props.deleteSprintIssue(issue._id)}>Delete</button>

                <button onClick={() => this.setState({ showPopup: true })}>Edit</button>
                {
                    this.state.showPopup &&
                    <Popup handleClose={() => this.setState({ showPopup: false })}>
                        <IssueForm
                            initialValues={_.pick(issue, 'description')}
                            onSubmit={(updatedIssue) => { this.setState({ showPopup: false }); this.props.updateSprintIssue(updatedIssue, issue._id) }} />
                    </Popup>
                }
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