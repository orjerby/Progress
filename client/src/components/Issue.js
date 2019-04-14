import React from 'react'
import PropTypes from 'prop-types'

export default class Issue extends React.Component {
    state = {
        name: undefined
    }

    handleBlur = () => {
        const { name } = this.state
        const { initialName, handleChangeName } = this.props

        if (initialName !== name) {
            handleChangeName(name)
        }

        this.setState({ name: undefined })
    }

    handleChange = (e) => {
        this.setState({ name: e.target.value })
    }

    render() {
        const { name } = this.state
        const { initialName, Icon } = this.props
        const { handleBlur, handleChange } = this

        return (
            <div style={{ cursor: 'move', paddingLeft: 12, padding: 5, backgroundColor: 'white', borderWidth: 0.1, display: 'flex', borderStyle: 'solid', borderColor: 'aliceblue' }}
                onDoubleClick={() => { this.setState({ name: initialName }); }}
            >

                {
                    Icon &&
                    <span style={{ marginLeft: 10 }}><Icon color='green' /></span>
                }

                {
                    name ?
                        <input
                            style={{ marginLeft: 10, height: 24 }}
                            value={name}
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
                        <div style={{ marginLeft: 10 }}>{initialName}</div>
                }
            </div>
        )
    }
}

Issue.propTypes = {
    initialName: PropTypes.string.isRequired,
    handleChangeName: PropTypes.func.isRequired,
    Icon: PropTypes.elementType
}