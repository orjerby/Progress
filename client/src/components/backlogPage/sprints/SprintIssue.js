import React from 'react'
import { connect } from 'react-redux'
import { DragSource } from 'react-dnd'
import { FaTasks } from "react-icons/fa"

import { deleteSprintIssue, updateSprintIssue } from '../../../actions/issues'
import Issue from '../../Issue';

class SprintIssue extends React.Component {

    handleChangeName = (name) => {
        const { updateSprintIssue, issue, projectId } = this.props

        updateSprintIssue({ name }, issue._id, projectId)
    }

    render() {
        const { issue, connectDragSource, isDragging } = this.props
        const { handleChangeName } = this

        const opacity = isDragging ? 0 : 1

        return connectDragSource(
            <div style={{opacity}}>
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

function collectToBacklog(connect, monitor) {
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

const connector = connect(mapStateToProps, { deleteSprintIssue, updateSprintIssue })(SprintIssue)

export default DragSource('toBacklog', itemSource, collectToBacklog)(connector)