import React from 'react'
import { connect } from 'react-redux'
import { DragSource } from 'react-dnd'
import _ from 'lodash'
import { FaTasks } from "react-icons/fa"

import { deleteBacklogIssue, updateBacklogIssue } from '../actions/issues'

class BacklogIssue extends React.Component {
    state = {
        description: undefined
    }

    handleBlur = (issue) => {
        if (this.state.description !== issue.description) {
            this.props.updateBacklogIssue({ description: this.state.description }, issue._id)
        }
        this.setState({ description: undefined })
    }

    render() {
        const { issue, isDragging, connectDragSource } = this.props
        const opacity = isDragging ? 0 : 1

        return connectDragSource(
            <div style={{ opacity, cursor: 'move', paddingLeft: 12, padding: 5, backgroundColor: 'white', borderWidth: 0.1, display: 'flex', borderStyle: 'solid', borderColor: 'aliceblue' }}
                onDoubleClick={() => { this.setState({ description: issue.description }); }}
            >

                <span style={{ marginLeft: 10 }}><FaTasks color='green' /></span>

                {
                    this.state.description ?
                        <input autoFocus onDragStart={(event) => {
                            event.stopPropagation()
                            event.preventDefault()
                        }} draggable style={{ marginLeft: 10, height: 24 }} onBlur={() => this.handleBlur(issue)} onChange={(e) => this.setState({ description: e.target.value })} value={this.state.description} />
                        :
                        <div style={{ marginLeft: 10 }}>{issue.description}</div>
                }

                {/* <PopupHandle
                    buttonText='Delete'
                    Component={DeleteIssue}
                    onSubmit={() => this.props.deleteBacklogIssue(issue._id)}
                />

                <PopupHandle
                    buttonText='Edit' // required
                    Component={IssueForm} // required
                    initialValues={_.pick(issue, 'description')} // optional (any other prop will go to PopupHandle and Component)
                    onSubmit={(updatedIssue) => this.props.updateBacklogIssue(updatedIssue, issue._id)} // required
                /> */}
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