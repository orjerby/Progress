import React from 'react'
import PropTypes from 'prop-types'

export default function Button(props) {
    const { text, backgroundColor, fontSize, color, handleClick, Icon } = props

    return (
        <div>
            {
                backgroundColor ?
                    <span style={{ cursor: 'pointer', fontSize, color, borderRadius: 5, backgroundColor, paddingTop: 5, paddingBottom: 5, paddingRight: 10, paddingLeft: 10 }} onClick={handleClick}>
                        {
                            Icon &&
                            <span><Icon size='0.5em' /></span>
                        }
                        <span style={{ marginLeft: 5 }}>
                            {text}
                        </span>
                    </span>
                    :
                    <span style={{ cursor: 'pointer', fontSize, color, borderRadius: 5 }} onClick={handleClick}>
                        {
                            Icon &&
                            <span><Icon size='0.5em' /></span>
                        }
                        <span style={{ marginLeft: 5 }}>
                            {text}
                        </span>
                    </span>
            }
        </div>
    )
}

Button.defaultProps = {
    fontSize: 14
}

Button.propTypes = {
    text: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired,
    backgroundColor: PropTypes.string,
    fontSize: PropTypes.number,
    color: PropTypes.string
}