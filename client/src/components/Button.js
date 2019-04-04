import React from 'react'
import PropTypes from 'prop-types'

export default function Button(props) {
    const { text, backgroundColor } = props

    return (
        <h1>{text}</h1>
    )
}

Title.propTypes = {
    text: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string
}