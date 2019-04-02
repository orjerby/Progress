import React from 'react'
import { IoIosArrowDown } from "react-icons/io";

export default class Item extends React.Component {

    handleOptionsClick = (event) => {
        event.stopPropagation()
        this.props.handleOptionsClick()
    }

    render() {
        const { Icon, text, options, header, picture, subText } = this.props

        return (
            <div onClick={this.props.handleClick} className={`nav-item ${header && 'nav-item-header'}`} >

                <span className={`nav-item-icon ${header && 'nav-item-icon-header'}`}>
                    {header ? <img className='nav-item-icon-header-picture' src={picture} /> : <Icon />}
                </span>

                <span className={`nav-item-text-container`}>
                    <span className={`nav-item-text ${header && 'nav-item-text-header'}`}>{text}</span>
                    {subText && <span className={`nav-item-subtext ${header && 'nav-item-subtext-header'}`}>{subText}</span>}
                </span>

                {options && <span onClick={(event) => this.handleOptionsClick(event)} className='nav-item-options'><IoIosArrowDown /></span>}
            </div>
        )
    }
}