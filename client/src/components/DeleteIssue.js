import React from 'react'
import PropTypes from 'prop-types'

export default function DeleteIssue(props) {
    const { onSubmit } = props

    return (
        <div>
            <button onClick={onSubmit}>Are you sure?</button>
        </div>
    )
}

DeleteIssue.propTypes = {
    onSubmit: PropTypes.func.isRequired
}