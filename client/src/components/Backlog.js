import React from 'react'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'
import moment from 'moment'

import BacklogIssue from './BacklogIssue'
import { createBacklogIssue, setDragged } from '../actions/issues'
import IssueForm from './IssueForm';
import PopupHandle from './PopupHandle';
import Accordion from './Accordion';

class Backlog extends React.Component {

    renderIssues = () => {
        const { backlogIssues } = this.props
        const { canDrop } = this.props

        // let backgroundColor = 'aliceblue'
        let borderStyle = 'solid'
        let borderColor = 'aliceblue'
        if (canDrop) {
            // backgroundColor = '#d8dfe5'
            borderStyle = 'dashed'
            borderColor = 'green'
        }

        let results = backlogIssues.map(i => {
            return <BacklogIssue key={i._id} issue={i} handleDrop={_id => console.log('deleting id: ' + _id)} handleDragged={(issue) => this.props.setDragged(issue)} />
        })

        if (results.length === 0) {
            results = <div style={{ textAlign: 'center', borderColor: 'lightgray', borderStyle: 'dashed', borderWidth: 2, opacity: 0.5, fontSize: 14 }}>Your backlog is empty.</div>
        }

        return (
            <Accordion
                title={'Backlog'}
                subText={backlogIssues.length + ' issues'}
            >
                <div style={{ borderStyle, borderColor, borderWidth: 1 }}>{results}</div>
            </Accordion>
        )
    }

    render() {
        const { connectDropTarget } = this.props

        return <div>
            {
                connectDropTarget(
                    <div>
                        {this.renderIssues()}
                    </div>
                )
            }

            <PopupHandle
                buttonText='Create issue'
                plus
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