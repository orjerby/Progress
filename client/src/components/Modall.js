import React from 'react'
import { Button, Modal } from 'react-bootstrap'

class Modall extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: true,
        };
    }

    handleClose() {
        this.setState({ show: false });
        this.props.handleClose()
    }

    handleShow() {
        this.setState({ show: true });
    }

    render() {
        const { children } = this.props
        console.log(children)
        // if (!children) {
        //     return <div></div>
        // }
        return (
            <>
                {/* <Button variant="primary" onClick={this.handleShow}>
                    {this.props.text}
                </Button> */}

                <Modal show={this.state.show} onHide={this.handleClose}>
                    {this.props.children}
                </Modal>
            </>
        );
    }
}

export default Modall