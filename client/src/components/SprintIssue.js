import React from 'react'
import { connect } from 'react-redux'
import { DragSource } from 'react-dnd'
import _ from 'lodash'
import { FaTasks } from "react-icons/fa"

import { deleteSprintIssue, updateSprintIssue } from '../actions/issues'
import Issue from './Issue';

class SprintIssue extends React.Component {

    handleChangeDescription = (description) => {
        const { updateSprintIssue, issue } = this.props

        updateSprintIssue({ description }, issue._id)
    }

    render() {
        const { issue, connectDragSource, isDragging } = this.props
        const { handleChangeDescription } = this

        const opacity = isDragging ? 0 : 1

        return connectDragSource(
            <div style={{opacity}}>
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

function collectToBacklog(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

const connector = connect(null, { deleteSprintIssue, updateSprintIssue })(SprintIssue)

export default DragSource('toBacklog', itemSource, collectToBacklog)(connector)