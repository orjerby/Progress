import React from 'react'
import { connect } from 'react-redux'
import { DragSource } from 'react-dnd'
import _ from 'lodash'
import { FaTasks } from "react-icons/fa"

import { deleteSprintIssue, updateSprintIssue } from '../actions/issues'

class SprintIssue extends React.Component {
    state = {
        description: undefined
    }

    handleBlur = (issue) => {
        if (this.state.description !== issue.description) {
            this.props.updateSprintIssue({ description: this.state.description }, issue._id)
        }
        this.setState({ description: undefined })
    }

    render() {
        const { issue, connectDragSource, isDragging } = this.props
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
                    onSubmit={() => this.props.deleteSprintIssue(issue._id)}
                />

                <PopupHandle
                    buttonText='Edit'
                    Component={IssueForm}
                    initialValues={_.pick(issue, 'description')}
                    onSubmit={(updatedIssue) => this.props.updateSprintIssue(updatedIssue, issue._id)}
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

function collectToBacklog(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

const connector = connect(null, { deleteSprintIssue, updateSprintIssue })(SprintIssue)

export default DragSource('toBacklog', itemSource, collectToBacklog)(connector)