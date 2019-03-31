import React from 'react'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'

import BacklogIssue from './BacklogIssue'
import {setDragged} from '../actions'

class Backlog extends React.Component {

    renderIssues = () => {
        const { backlogIssues } = this.props
        
        let results = backlogIssues.map(i => {
            return <BacklogIssue key={i._id} issue={i} handleDrop={_id => console.log('deleting id: ' + _id)} handleDragged={(issueId)=>this.props.setDragged(issueId)} />
        })

        if (results.length === 0) {
            return <div>There are no issues here</div>
        }

        return results
    }

    render() {
        const { connectDropTarget, hovered, canDrop } = this.props
        let backgroundColor = 'aliceblue'
        if (canDrop) {
            backgroundColor = 'lightgreen'
        }
        if (hovered) {
            backgroundColor = 'gray'
        }

        return <div>
            <h2>Backlog</h2>
            {
                connectDropTarget(
                    <div style={{ backgroundColor }}>
                        {this.renderIssues()}
                    </div>
                )
            }
        </div>
    }
}

function mapStateToProps({ backlogIssueReducer }) {
    return {
        backlogIssues: backlogIssueReducer
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

const connector = connect(mapStateToProps,{setDragged})(Backlog)

export default DropTarget('toBacklog', itemSource, collectToBacklog)(connector)