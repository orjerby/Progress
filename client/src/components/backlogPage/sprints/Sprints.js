import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import { transferIssueToSprint } from '../../../actions/issues'
import SprintDrop from './SprintDrop'
import Accordion from '../../common/Accordion';
import Description from '../../common/Description';

class SprintList extends React.Component {
    render() {
        const { sprints, issues, transferIssueToSprint, draggedIssue, projectId } = this.props

        return (
            <>
                {
                    sprints.map(s => {
                        return <Accordion
                            key={s._id}
                            description={<Description
                                text={s.name}
                                subText={issues.filter(i => i.sprintId === s._id).length + ' issues'}
                                footer={`${moment().format("DD/MMM/YY hh:mm a")} • ${moment().add(3, 'w').format("DD/MMM/YY hh:mm a")}`}
                            />}
                        >
                            <SprintDrop sprint={s} handleDrop={(sprintId) => transferIssueToSprint(draggedIssue, sprintId, projectId)} />
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
        projectId: activeProjectReducer._id,
        issues: sprintIssueReducer
    }
}

export default connect(mapStateToProps, { transferIssueToSprint })(SprintList)