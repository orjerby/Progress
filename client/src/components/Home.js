import React from 'react'
import { connect } from 'react-redux'

import { test } from '../actions'

class Home extends React.Component {
    onButtonClick = () => {
        // you can call the action like this
        this.props.test('Hello World!')
    }

    render() {
        return (
            <div>
                <div>Hello Roso</div>
                <button onClick={this.onButtonClick}>Hello World!</button>

                {/* you can access the data of the reducer like this */}
                <p>{this.props.testReducer.result}</p>
            </div>
        )
    }
}

// get the data of whatever reducer you want
function mapStateToProps({ testReducer }) {
    return {
        testReducer
    }
}

// get whatever action you want
const actions = {
    test
}

// connect redux with react
export default connect(mapStateToProps, actions)(Home)