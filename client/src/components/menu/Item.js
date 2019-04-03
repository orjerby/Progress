import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { DropdownButton, Dropdown } from 'react-bootstrap'

export default class Item extends React.Component {

    handleOptionsClick = (value) => {
        const { handleOptionsClick } = this.props

        if (handleOptionsClick) {
            handleOptionsClick(value)
        }
    }

    handleClick = () => {
        const { handleClick } = this.props

        if (handleClick) {
            handleClick()
        }
    }

    renderOptionItems = () => {
        const { optionItems } = this.props

        return optionItems.map((i, k) => {
            return <Dropdown.Item key={k} onClick={() => this.handleOptionsClick(i)}>{i.name}</Dropdown.Item>
        })
    }

    render() {
        const { Icon, text, header, picture, subText, handleClick, optionItems } = this.props

        const itemClass = classNames({
            'menu-item': true,
            'menu-item-header': header
        })
        const leftClass = classNames({
            'menu-item-left-container': true,
            'menu-item-left-header-container': header
        })
        const pictureClass = classNames({
            'menu-item-picture-header': header,
            'menu-item-picture': !header
        })
        const iconClass = classNames({
            'menu-item-icon-header': header,
            'menu-item-icon': !header
        })
        const textClass = classNames({
            'menu-item-text': true,
            'menu-item-text-header': header
        })
        const subTextClass = classNames({
            'menu-item-subtext': true,
            'menu-item-subtext-header': header
        })

        return (
            <div onClick={handleClick} className={itemClass} >

                <span className={leftClass}>
                    {picture ? <img className={pictureClass} src={picture} alt={picture} /> : <span className={iconClass} >{Icon}</span>}
                </span>

                <span className={`menu-item-middle-container`}>
                    <span className={textClass}>{text}</span>
                    {subText && <span className={subTextClass}>{subText}</span>}
                </span>

                {
                    optionItems &&
                    <div className='menu-item-options'>

                        <Dropdown onClick={(e) => e.stopPropagation()}>
                            <DropdownButton alignRight id="dropdown-menu-align-right" variant='link' size='sm'>
                                {this.renderOptionItems()}
                            </DropdownButton>
                        </Dropdown>

                    </div>
                }
            </div>
        )
    }
}

Item.propTypes = {
    text: PropTypes.string.isRequired,
    subtext: PropTypes.string,
    Icon: PropTypes.element,
    picture: PropTypes.string,
    header: PropTypes.bool,
    handleClick: PropTypes.func,
    handleOptionsClick: PropTypes.func,
    optionItems: PropTypes.array
}