import React from 'react'
import PropTypes from 'prop-types'

export default function Empty(props) {
    const { text, borderColor } = props

    return (
        <div style={{ textAlign: 'center', borderColor, borderStyle: 'dashed', borderWidth: 2, opacity: 0.7, fontSize: 14, padding: 5 }}>
            {text}
        </div>
    )
}

Empty.propTypes = {
    text: PropTypes.string.isRequired,
    borderColor: PropTypes.string
}