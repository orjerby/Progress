import React from 'react'
import PropTypes from 'prop-types'

export default function Description(props) {
    const { text, subText, footer } = props

    return (
        <>
            <div>
                <span style={{ fontWeight: 'bold' }}>{text}</span>

                {
                    subText &&
                    <span style={{ marginLeft: 8, color: 'gray', fontSize: 13 }}>{subText}</span>
                }
            </div>
            {
                footer &&
                <span style={{ color: 'gray', fontSize: 13 }}>{footer}</span>
            }
        </>
    )
}

Description.propTypes = {
    text: PropTypes.string.isRequired,
    subText: PropTypes.string,
    footer: PropTypes.string
}