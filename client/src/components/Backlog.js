import React from 'react'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'

import BacklogIssue from './BacklogIssue'
import { createBacklogIssue, setDragged } from '../actions/issues'
import IssueForm from './IssueForm';
import PopupHandle from './PopupHandle';

class Backlog extends React.Component {

    renderIssues = () => {
        const { backlogIssues } = this.props

        let results = backlogIssues.map(i => {
            return <BacklogIssue key={i._id} issue={i} handleDrop={_id => console.log('deleting id: ' + _id)} handleDragged={(issue) => this.props.setDragged(issue)} />
        })

        if (results.length === 0) {
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

        return <div>
            <h2>Backlog</h2>
            {
                connectDropTarget(
                    <div style={{ backgroundColor, borderStyle, borderColor, borderRadius: 5, padding: 5, paddingBottom: 1.5 }}>
                        {this.renderIssues()}
                    </div>
                )
            }

            <PopupHandle
                buttonText='Create issue'
                Component={IssueForm}
                onSubmit={(newIssue) => this.props.createBacklogIssue(newIssue, this.props.activeProject.backlogId)}
            />
        </div>
    }
}

function mapStateToProps({ backlogIssueReducer, activeProjectReducer, fetchReducer }) {
    return {
        backlogIssues: backlogIssueReducer,
        activeProject: activeProjectReducer,
        fetching: fetchReducer
    }
}

const itemSource = {
    drop(props, monitor, component) {
        props.handleDrop()
    }
}

function collectToBacklog(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        item: monitor.getItem(),
        canDrop: monitor.canDrop()
    }
}

const connector = connect(mapStateToProps, { setDragged, createBacklogIssue })(Backlog)

export default DropTarget('toBacklog', itemSource, collectToBacklog)(connector)