import React from 'react'
import { connect } from 'react-redux'
import { DragSource } from 'react-dnd'
import _ from 'lodash'
import { FaTasks } from "react-icons/fa"

import { deleteBacklogIssue, updateBacklogIssue } from '../actions/issues'
import Issue from './Issue';

class BacklogIssue extends React.Component {

    handleChangeDescription = (description) => {
        const { updateBacklogIssue, issue } = this.props

        updateBacklogIssue({ description }, issue._id)
    }

    render() {
        const { issue, isDragging, connectDragSource } = this.props
        const { handleChangeDescription } = this

        const opacity = isDragging ? 0 : 1

        return connectDragSource(
            <div style={{ opacity }}>
                <Issue
                    initialDescription={issue.description}
                    handleChangeDescription={handleChangeDescription}
                    Icon={FaTasks}
                />
            </div>
        )
    }
}

const itemSource = {
    beginDrag(props) {
        props.handleDragged(props.issue)
        return props.issue
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