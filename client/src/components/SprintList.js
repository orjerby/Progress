import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import { transferIssueToSprint } from '../actions/issues'
import { createSprint, deleteSprint, updateSprint } from '../actions/sprints'
import Sprint from './Sprint'
import PopupHandle from './PopupHandle'
import IssueForm from './IssueForm'
import DeleteIssue from './DeleteIssue'

class SprintList extends React.Component {
    render() {
        return (
            <div>
                <h2>Sprints</h2>
                {
                    this.props.sprints.map(s => {
                        return <div key={s._id}>
                            <h2>{s.description}</h2>
                            <Sprint sprint={s} handleDrop={(sprintId) => this.props.transferIssueToSprint(this.props.draggedIssue, sprintId)} />

                            <PopupHandle
                                buttonText='Edit' // required
                                Component={IssueForm} // required
                                initialValues={_.pick(s, 'description')} // optional (any other prop will go to PopupHandle and Component)
                                onSubmit={(updatedSprint) => this.props.updateSprint(updatedSprint, s._id)} // required
                            />

                            <PopupHandle
                                buttonText='Delete'
                                Component={DeleteIssue}
                                onSubmit={() => this.props.deleteSprint(s._id)}
                            />
                        </div>
                    })
                }

                <PopupHandle
                    buttonText='Create sprint'
                    Component={IssueForm}
                    onSubmit={(newSprint) => this.props.createSprint(newSprint, this.props.activeProject._id)}
                />

            </div>
        )
    }
}

function mapStateToProps({ sprintReducer, draggedReducer, activeProjectReducer }) {
    return {
        sprints: sprintReducer,
        draggedIssue: draggedReducer,
        activeProject: activeProjectReducer
    }
}

export default connect(mapStateToProps, { transferIssueToSprint, createSprint, deleteSprint, updateSprint })(SprintList)