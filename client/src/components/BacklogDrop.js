import React from 'react'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'
import PropTypes from 'prop-types'

import BacklogIssue from './BacklogIssue'
import { setDragged } from '../actions/issues'
import Empty from './Empty';

class BacklogDrop extends React.Component {

    renderIssues = () => {
        const { backlogIssues } = this.props
        const { canDrop, setDragged } = this.props

        let borderStyle = 'solid'
        let borderColor = 'lightgray'
        if (canDrop) {
            borderStyle = 'dashed'
            borderColor = 'green'
        }

        let issuesElement = backlogIssues.map(i => {
            return <BacklogIssue key={i._id} issue={i} handleDragged={(issue) => setDragged(issue)} />
        })

        if (issuesElement.length === 0) {
            return <Empty
                text='Your backlog is empty.'
                borderColor={borderColor}
            />
        }

        return (
            <div style={{ borderStyle, borderColor, borderWidth: 1 }}>
                {issuesElement}
            </div>
        )
    }

    render() {
        const { connectDropTarget } = this.props

        return connectDropTarget(
            <div>
                {this.renderIssues()}
            </div>
        )
    }
}

function mapStateToProps({ backlogIssueReducer }) {
    return {
        backlogIssues: backlogIssueReducer
    }
}

const itemSource = {
    drop(props) {
        props.handleDrop()
    }
}

function collectToBacklog(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        canDrop: monitor.canDrop()
    }
}

const connector = connect(mapStateToProps, { setDragged })(BacklogDrop)

export default DropTarget('toBacklog', itemSource, collectToBacklog)(connector)

BacklogDrop.propTypes = {
    handleDrop: PropTypes.func.isRequired
}