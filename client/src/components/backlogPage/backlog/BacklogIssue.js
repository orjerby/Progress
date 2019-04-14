import React from 'react'
import { connect } from 'react-redux'
import { DragSource } from 'react-dnd'
import { FaTasks } from "react-icons/fa"

import { deleteBacklogIssue, updateBacklogIssue } from '../../../actions/issues'
import Issue from '../../Issue';

class BacklogIssue extends React.Component {

    handleChangeName = (name) => {
        const { updateBacklogIssue, issue, projectId } = this.props

        updateBacklogIssue({ name }, issue._id, projectId)
    }

    render() {
        const { issue, isDragging, connectDragSource } = this.props
        const { handleChangeName } = this

        const opacity = isDragging ? 0 : 1

        return connectDragSource(
            <div style={{ opacity }}>
                <Issue
                    initialName={issue.name}
                    handleChangeName={handleChangeName}
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

function mapStateToProps({activeProjectReducer}){
    return {
        projectId: activeProjectReducer._id
    }
}

const connector = connect(mapStateToProps, { deleteBacklogIssue, updateBacklogIssue })(BacklogIssue)

export default DragSource('toSprint', itemSource, collectToSprint)(connector)