import React from 'react'

export default class D extends React.Component {
    render() {
        return (
            <div>
                <button onClick={this.props.onSubmit}>Are you sure?</button>
            </div>
        )
    }
}