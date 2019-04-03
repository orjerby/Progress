import React from 'react'
import { Button, Collapse } from 'react-bootstrap'
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"

export default class Accordion extends React.Component {
    state = {
        open: true
    }

    render() {

        const { open } = this.state;

        return (
            <>
                <div style={{ marginBottom: 10, marginTop: 10 }}>
                    <div>
                        <div>
                            <span style={{ cursor: 'pointer' }}><IoIosArrowDown onClick={() => this.setState({ open: !open })} /></span>
                            <span style={{ fontWeight: 'bold', marginLeft: 3 }}>{this.props.title}</span>
                            <span style={{ marginLeft: 8, color: 'gray', fontSize: 13 }}>{this.props.subText}</span>
                        </div>
                        {this.props.footer && <span style={{ marginLeft: 15, color: 'gray', fontSize: 13 }}>{this.props.footer}</span>}
                    </div>
                    <div style={{ paddingTop: 5, paddingBottom: 5 }}></div>
                    <Collapse in={this.state.open}>
                        <div style={{ marginLeft: 15 }}>
                            {this.props.children}
                        </div>
                    </Collapse>
                </div>
            </>
        )
    }
}