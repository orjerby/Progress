import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'

import { transferIssueToSprint } from '../actions/issues'
import { createSprint, deleteSprint, updateSprint } from '../actions/sprints'
import Sprint from './Sprint'
import Accordion from './Accordion';
import PopupHandle from './PopupHandle';
import IssueForm from './IssueForm';

class SprintList extends React.Component {
    render() {
        return (
            <div>
                {
                    this.props.sprints.map(s => {
                        return <div key={s._id}>

                            <Accordion
                                title={s.description}
                                subText={this.props.sprintIssue.filter(i => i.sprintId === s._id).length + ' issues'}
                                footer={`${moment().format("DD/MMM/YY hh:mm a")} • ${moment().add(3, 'w').format("DD/MMM/YY hh:mm a")}`}
                            >
                                <Sprint sprint={s} handleDrop={(sprintId) => this.props.transferIssueToSprint(this.props.draggedIssue, sprintId)} />
                            </Accordion>

                            {/* <PopupHandle
                                buttonText='Edit' // required
                                Component={IssueForm} // required
                                initialValues={_.pick(s, 'description')} // optional (any other prop will go to PopupHandle and Component)
                                onSubmit={(updatedSprint) => this.props.updateSprint(updatedSprint, s._id)} // required
                            />

                            <PopupHandle
                                buttonText='Delete'
                                Component={DeleteIssue}
                                onSubmit={() => this.props.deleteSprint(s._id)}
                            /> */}
                        </div>
                    })
                }

                <PopupHandle
                    buttonText='Create sprint'
                    right
                    Component={IssueForm}
                    onSubmit={(newSprint) => this.props.createSprint(newSprint, this.props.activeProject._id)}
                />

                {/* <PopupHandle
                    buttonText='Create sprint'
                    Component={IssueForm}
                    onSubmit={(newSprint) => this.props.createSprint(newSprint, this.props.activeProject._id)}
                /> */}

            </div>
        )
    }
}

function mapStateToProps({ sprintReducer, draggedReducer, activeProjectReducer, sprintIssueReducer }) {
    return {
        sprints: sprintReducer,
        draggedIssue: draggedReducer,
        activeProject: activeProjectReducer,
        sprintIssue: sprintIssueReducer
    }
}

export default connect(mapStateToProps, { transferIssueToSprint, createSprint, deleteSprint, updateSprint })(SprintList)