import React from 'react'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'

import BacklogIssue from './BacklogIssue'
import Modall from './Modall'
import { setDragged, createIssue } from '../actions'
import IssueForm from './IssueForm';

class Backlog extends React.Component {
    state = {
        show: false
    }

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
        const { connectDropTarget, hovered, canDrop } = this.props
        let backgroundColor = 'aliceblue'
        let borderStyle = 'solid'
        let borderColor = 'aliceblue'
        if (canDrop) {
            backgroundColor = '#d8dfe5'
            borderStyle = 'dotted'
            borderColor = 'green'
        }
        // if (hovered) {
        //     backgroundColor = 'gray'
        // }

        return <div>
            <h2>Backlog</h2>
            {
                connectDropTarget(
                    <div style={{ backgroundColor, borderStyle, borderColor, borderRadius: 5, padding: 5, paddingBottom: 1.5 }}>
                        {this.renderIssues()}
                    </div>
                )
            }
            <button onClick={() => this.setState({ show: true })}>Create issue</button>
            {
                this.state.show &&
                <Modall handleClose={() => this.setState({ show: false })}>
                    <IssueForm onSubmit={(newIssue) => { this.setState({ show: false }); this.props.createIssue(newIssue, this.props.activeProject.backlog) }} />
                </Modall>
            }
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
        hovered: monitor.isOver(),
        item: monitor.getItem(),
        canDrop: monitor.canDrop()
    }
}

const connector = connect(mapStateToProps, { setDragged, createIssue })(Backlog)

export default DropTarget('toBacklog', itemSource, collectToBacklog)(connector)