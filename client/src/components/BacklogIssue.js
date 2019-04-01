import React from 'react'
import { connect } from 'react-redux'
import { DragSource } from 'react-dnd'
import _ from 'lodash'

import { deleteBacklogIssue, updateBacklogIssue } from '../actions/issues'
import Popup from './Popup'
import IssueForm from './IssueForm'

class BacklogIssue extends React.Component {
    state = {
        showPopup: false
    }

    render() {
        const { issue, isDragging, connectDragSource } = this.props
        const opacity = isDragging ? 0 : 1

        return connectDragSource(
            <div style={{ opacity, padding: 20, cursor: 'move', marginBottom: 5, backgroundColor: 'white' }}>
                <div>{issue._id}</div>
                <div>{issue.description}</div>
                <button onClick={() => this.props.deleteBacklogIssue(issue._id)}>Delete</button>

                <button onClick={() => this.setState({ showPopup: true })}>Edit</button>
                {
                    this.state.showPopup &&
                    <Popup handleClose={() => this.setState({ showPopup: false })}>
                        <IssueForm 
                        initialValues={_.pick(issue, 'description')}
                        onSubmit={(updatedIssue) => { this.setState({ showPopup: false }); this.props.updateBacklogIssue(updatedIssue, issue._id) }} />
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

function collectToSprint(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

const connector = connect(null, { deleteBacklogIssue, updateBacklogIssue })(BacklogIssue)

export default DragSource('toSprint', itemSource, collectToSprint)(connector)