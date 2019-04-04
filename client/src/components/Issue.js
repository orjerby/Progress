import React from 'react'
import PropTypes from 'prop-types'

export default class Issue extends React.Component {
    state = {
        description: undefined
    }

    handleBlur = () => {
        const { description } = this.state
        const { initialDescription, handleChangeDescription } = this.props

        if (initialDescription !== description) {
            handleChangeDescription(description)
        }

        this.setState({ description: undefined })
    }

    handleChange = (e) => {
        this.setState({ description: e.target.value })
    }

    render() {
        const { description } = this.state
        const { initialDescription, Icon } = this.props
        const { handleBlur, handleChange } = this

        return (
            <div style={{ cursor: 'move', paddingLeft: 12, padding: 5, backgroundColor: 'white', borderWidth: 0.1, display: 'flex', borderStyle: 'solid', borderColor: 'aliceblue' }}
                onDoubleClick={() => { this.setState({ description: initialDescription }); }}
            >

                {
                    Icon &&
                    <span style={{ marginLeft: 10 }}><Icon color='green' /></span>
                }

                {
                    description ?
                        <input
                            style={{ marginLeft: 10, height: 24 }}
                            value={description}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            autoFocus
                            draggable
                            onDragStart={(event) => {
                                event.stopPropagation()
                                event.preventDefault()
                            }}
                        />
                        :
                        <div style={{ marginLeft: 10 }}>{initialDescription}</div>
                }
            </div>
        )
    }
}

Issue.propTypes = {
    initialDescription: PropTypes.string.isRequired,
    handleChangeDescription: PropTypes.func.isRequired,
    Icon: PropTypes.elementType
}