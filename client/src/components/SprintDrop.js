import React from 'react'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'

import SprintIssue from './SprintIssue'
import { setDragged } from '../actions/issues'
import Empty from './Empty';

class SprintDrop extends React.Component {

    handleDragged = (issue) => {
        const {setDragged} = this.props
        setDragged(issue)
    }

    renderIssues = () => {
        const { sprint, issues } = this.props
        const { canDrop } = this.props
        const { handleDragged } = this

        let borderStyle = 'solid'
        let borderColor = 'lightgray'
        if (canDrop) {
            borderStyle = 'dashed'
            borderColor = 'green'
        }

        let foundIssues = false
        let issuesElement = issues.map(i => {
            if (sprint._id === i.sprintId) {
                foundIssues = true
                return <SprintIssue
                    key={i._id}
                    issue={i}
                    handleDragged={handleDragged} />
            }
            return undefined
        })

        if (!foundIssues) {
            return <Empty
                text='Your sprint is empty.'
                borderColor={borderColor}
            />
        }

        return <div style={{ borderColor, borderStyle, borderWidth: 1 }}>{issuesElement}</div>
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

function mapStateToProps({ sprintIssueReducer }) {
    return {
        issues: sprintIssueReducer
    }
}

const itemSource = {
    drop(props) {
        props.handleDrop(props.sprint._id) // props from parent
    }
}

function collectToSprint(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        canDrop: monitor.canDrop()
    }
}

const connector = connect(mapStateToProps, { setDragged })(SprintDrop)

export default DropTarget('toSprint', itemSource, collectToSprint)(connector)