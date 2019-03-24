import React from 'react'
import { connect } from 'react-redux'

import { fetchProjects } from '../actions'

class Home extends React.Component {
    onButtonClick = () => {
        // you can call the action like this
    }

    componentDidMount() {
        this.props.fetchProjects()
    }

    render() {
        console.log(this.props.projectReducer)
        return (
            <div>
                <div>Hello Roso</div>
                <button onClick={this.onButtonClick}>Hello World!</button>
            </div>
        )
    }
}

// get the data of whatever reducer you want
function mapStateToProps({ projectReducer }) {
    return {
        projectReducer
    }
}

// get whatever action you want
const actions = {
    fetchProjects
}

// connect redux with react
export default connect(mapStateToProps, actions)(Home)