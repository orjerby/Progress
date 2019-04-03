import React from 'react'
import { FaPlus } from "react-icons/fa"

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
        const { Component, right, plus } = this.props
        return <div style={{textAlign: right && 'right'}}>
            <span style={{ marginLeft: 55, cursor: 'pointer' }} onClick={() => this.setState({ showPopup: true })}>
                {plus && <span style={{ color: 'gray' }}><FaPlus size='0.5em' /></span>}
                <span style={{ fontSize: 14, color: 'gray', marginLeft: 8 }}>{this.props.buttonText}</span>
            </span>
            {
                this.state.showPopup &&
                <Popup handleClose={() => this.setState({ showPopup: false })}>
                    <Component {...this.props} onSubmit={(values) => this.handleOnSubmit(values)} />
                </Popup>
            }
        </div>
    }
}