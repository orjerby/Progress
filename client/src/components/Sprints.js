import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import { transferIssueToSprint } from '../actions/issues'
import SprintDrop from './SprintDrop'
import Accordion from './Accordion';
import Description from './Description';

class SprintList extends React.Component {
    render() {
        const { sprints, issues, transferIssueToSprint, draggedIssue } = this.props

        return (
            <>
                {
                    sprints.map(s => {
                        return <Accordion
                            key={s._id}
                            description={<Description
                                text={s.description}
                                subText={issues.filter(i => i.sprintId === s._id).length + ' issues'}
                                footer={`${moment().format("DD/MMM/YY hh:mm a")} • ${moment().add(3, 'w').format("DD/MMM/YY hh:mm a")}`}
                            />}
                        >
                            <SprintDrop sprint={s} handleDrop={(sprintId) => transferIssueToSprint(draggedIssue, sprintId)} />
                        </Accordion>
                    })
                }
            </>
        )
    }
}

function mapStateToProps({ sprintReducer, draggedReducer, activeProjectReducer, sprintIssueReducer }) {
    return {
        sprints: sprintReducer,
        draggedIssue: draggedReducer,
        activeProject: activeProjectReducer,
        issues: sprintIssueReducer
    }
}

export default connect(mapStateToProps, { transferIssueToSprint })(SprintList)