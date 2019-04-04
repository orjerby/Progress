import React from 'react'
import PropTypes from 'prop-types'
import { Collapse } from 'react-bootstrap'
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"

export default class Accordion extends React.Component {
    state = {
        collapse: true
    }

    render() {
        const { collapse } = this.state
        const { children, description } = this.props

        return (
            <>
                <div style={{ marginBottom: 10, marginTop: 10 }}>
                    <div style={{ display: 'flex' }}>
                        <span>

                            {
                                collapse ?
                                <IoIosArrowUp style={{cursor: 'pointer'}} onClick={() => this.setState({ collapse: !collapse })} />
                                :
                                <IoIosArrowDown style={{cursor: 'pointer'}} onClick={() => this.setState({ collapse: !collapse })} />
                            }

                        </span>

                        <div style={{ marginLeft: 5 }}>
                            {description}
                        </div>

                    </div>
                    <div style={{ paddingTop: 5 }}></div>
                    <Collapse in={collapse}>
                        <div style={{ marginLeft: 20 }}>
                            {children}
                        </div>
                    </Collapse>
                </div>
            </>
        )
    }
}

Accordion.propTypes = {
    children: PropTypes.any.isRequired,
    description: PropTypes.element
}