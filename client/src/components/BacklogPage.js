import React from 'react'
import { connect } from 'react-redux'

import { transferIssueToBacklog } from '../actions/issues'
import Backlog from './Backlog'
import Sprints from './Sprints'
import Title from './Title';
import Search from './Search';

class BacklogPage extends React.Component {

    render() {
        const { api, activeProject, transferIssueToBacklog, draggedIssue } = this.props

        if (api.fetchLoading) {
            return <></>
        }

        return (
            <>
                {
                    activeProject ? (
                        <div>

                            <Title text={'Backlog'} />
                            <Search handleSearch={(searchValue) => console.log(searchValue)} />

                            {/* Sprints area is in other component in case sprintReducer will be rendered so only this component get rendered */}
                            <Sprints />

                            <div style={{ height: 15 }}></div>

                            <Backlog handleDrop={() => transferIssueToBacklog(draggedIssue, activeProject.backlogId)} />
                            {/* Backlog area is in other component in case backlogReducer will be rendered so only this component get rendered */}
                        </div>
                    ) :
                        <h1>Select project!</h1>
                }

                {
                    api.actionLoading &&
                    <div style={{ width: 100, height: 100, backgroundColor: 'red' }}></div>
                }
            </>
        )
    }
}

// get the data of whatever reducer you want
function mapStateToProps({ activeProjectReducer, draggedReducer, apiReducer }) {
    return {
        activeProject: activeProjectReducer,
        draggedIssue: draggedReducer,
        api: apiReducer
    }
}

// connect redux with react
export default connect(mapStateToProps, { transferIssueToBacklog })(BacklogPage)