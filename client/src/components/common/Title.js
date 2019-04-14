import React from 'react'
import PropTypes from 'prop-types'

export default function Title(props) {
    const { text } = props

    return (
        <h1>{text}</h1>
    )
}

Title.propTypes = {
    text: PropTypes.string.isRequired
}