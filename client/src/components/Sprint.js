import React from 'react'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'

import SprintIssue from './SprintIssue'
import { setDragged } from '../actions/issues'

class Sprint extends React.Component {
    renderSprint = () => {
        const { sprint, sprintIssues } = this.props
        const { connectDropTarget, canDrop } = this.props
        // let backgroundColor = 'aliceblue'
        let borderStyle = 'solid'
        let borderColor = 'aliceblue'
        if (canDrop) {
            // backgroundColor = '#d8dfe5'
            borderStyle = 'dashed'
            borderColor = 'green'
        }

        let foundIssues = false
        let results = sprintIssues.map(i => {
            if (sprint._id === i.sprintId) {
                foundIssues = true
                return <SprintIssue key={i._id} issue={i} handleDrop={_id => console.log('deleting id: ' + _id)} handleDragged={(issue) => this.props.setDragged(issue)} />
            }
            return undefined
        })

        if (!foundIssues) {
            results = <div style={{ textAlign: 'center', borderColor: 'lightgray', borderStyle: 'dashed', borderWidth: 2, opacity: 0.5, fontSize: 14 }}>Your sprint is empty.</div>
        }

        return <div style={{ borderColor, borderStyle, borderWidth: 1 }}>{results}</div>
    }

    render() {
        const { connectDropTarget } = this.props

        return connectDropTarget(
            <div>
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