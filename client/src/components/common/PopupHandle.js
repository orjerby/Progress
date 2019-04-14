import React from 'react'

import Popup from './Popup'
import Button from './Button';

export default class PopupHandle extends React.Component {
    state = {
        showPupup: false
    }

    handleOnSubmit = values => {
        this.props.onSubmit(values)
        this.setState({ showPopup: false })
    }

    render() {
        const { Component, right, buttonText, buttonBackgroundColor, buttonColor, ButtonIcon } = this.props
        return <div style={{ textAlign: right && 'right' }}>
            <Button
                text={buttonText}
                backgroundColor={buttonBackgroundColor}
                color={buttonColor}
                Icon={ButtonIcon}
                handleClick={() => this.setState({ showPopup: true })}
            />

            {
                this.state.showPopup &&
                <Popup handleClose={() => this.setState({ showPopup: false })}>
                    <Component {...this.props} onSubmit={(values) => this.handleOnSubmit(values)} />
                </Popup>
            }
        </div>
    }
}