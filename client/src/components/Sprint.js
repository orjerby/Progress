import React from 'react'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'

import SprintIssue from './SprintIssue'
import { setDragged } from '../actions/issues'

class Sprint extends React.Component {
    renderSprint = () => {
        const { sprint, sprintIssues } = this.props

        let foundIssues = false
        const results = sprintIssues.map(i => {
            if (sprint._id === i.sprintId) {
                foundIssues = true
                return <SprintIssue key={i._id} issue={i} handleDrop={_id => console.log('deleting id: ' + _id)} handleDragged={(issue) => this.props.setDragged(issue)} />
            }
            return undefined
        })

        if (!foundIssues) {
            return <div>There are no issues here</div>
        }

        return results
    }

    render() {
        const { connectDropTarget, canDrop } = this.props
        let backgroundColor = 'aliceblue'
        let borderStyle = 'solid'
        let borderColor = 'aliceblue'
        if (canDrop) {
            backgroundColor = '#d8dfe5'
            borderStyle = 'dotted'
            borderColor = 'green'
        }

        return connectDropTarget(
            <div style={{ backgroundColor, borderStyle, borderColor, borderRadius: 5, padding: 5, paddingBottom: 1.5 }}>
                {this.renderSprint()}
            </div>
        )
    }
}

function mapStateToProps({ sprintReducer, sprintIssueReducer }) {
    return {
        sprints: sprintReducer,
        sprintIssues: sprintIssueReducer
    }
}

const itemSource = {
    drop(props, monitor, component) {
        props.handleDrop(props.sprint._id)
    }
}

function collectToSprint(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        item: monitor.getItem(),
        canDrop: monitor.canDrop()
    }
}

const connector = connect(mapStateToProps, { setDragged })(Sprint)

export default DropTarget('toSprint', itemSource, collectToSprint)(connector)