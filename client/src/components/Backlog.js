import React from 'react'
import { connect } from 'react-redux'
import { FaPlus } from "react-icons/fa"

import { createBacklogIssue, transferIssueToBacklog } from '../actions/issues'
import { createSprint } from '../actions/sprints'
import IssueForm from './IssueForm';
import PopupHandle from './PopupHandle';
import Description from './Description';
import BacklogDrop from './BacklogDrop';

class Backlog extends React.Component {

    handleTransferIssue = () => {
        const { draggedIssue, activeProject, transferIssueToBacklog } = this.props
        transferIssueToBacklog(draggedIssue, activeProject.backlogId)
    }

    handleCreateIssue = (newIssue) => {
        const { activeProject, createBacklogIssue } = this.props
        createBacklogIssue(newIssue, activeProject.backlogId)
    }

    handleCreateSprint = (newSprint) => {
        const { activeProject, createSprint } = this.props
        createSprint(newSprint, activeProject._id)
    }

    render() {
        const { backlogIssues } = this.props
        const { handleTransferIssue, handleCreateIssue, handleCreateSprint } = this

        return <div style={{ marginLeft: 20 }}>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ marginBottom: 5 }}>
                    <Description
                        text={'Backlog'}
                        subText={backlogIssues.length + ' issues'}
                    />
                </div>

                <PopupHandle
                    buttonText='Create sprint'
                    right
                    buttonBackgroundColor='#e0e0e0'
                    buttonColor='gray'
                    Component={IssueForm}
                    onSubmit={handleCreateSprint}
                    ButtonIcon={FaPlus}
                />
            </div>

            <BacklogDrop handleDrop={handleTransferIssue} />

            <div style={{ marginLeft: 50, marginTop: 5 }}>
                <PopupHandle
                    buttonText='Create issue'
                    buttonColor='gray'
                    ButtonIcon={FaPlus}
                    Component={IssueForm}
                    onSubmit={handleCreateIssue}
                />
            </div>
        </div>
    }
}

function mapStateToProps({ backlogIssueReducer, activeProjectReducer, draggedReducer }) {
    return {
        backlogIssues: backlogIssueReducer,
        activeProject: activeProjectReducer,
        draggedIssue: draggedReducer
    }
}

export default connect(mapStateToProps, { createBacklogIssue, transferIssueToBacklog, createSprint })(Backlog)