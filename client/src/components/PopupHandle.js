import React from 'react'

import Popup from './Popup'

export default class PopupHandle extends React.Component {
    state = {
        showPupup: false
    }

    handleOnSubmit = values => {
        this.props.onSubmit(values)
        this.setState({ showPopup: false })
    }

    render() {
        const { Component } = this.props
        return <div>
            <button onClick={() => this.setState({ showPopup: true })}>{this.props.buttonText}</button>
            {
                this.state.showPopup &&
                <Popup handleClose={() => this.setState({ showPopup: false })}>
                    <Component {...this.props} onSubmit={(values) => this.handleOnSubmit(values)} />
                </Popup>
            }
        </div>
    }
}