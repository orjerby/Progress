import React from 'react'
import { IoIosArrowDown } from "react-icons/io";

export default class Item extends React.Component {
    render() {
        const { Icon, text, options, header, picture } = this.props

        return (
            <div onClick={this.props.handleClick} className={`nav-item ${header && 'nav-item-header'}`} >

                <span className={`nav-item-icon ${header && 'nav-item-icon-header'}`}>
                    {header ? <img className='nav-item-icon-header-picture' src={picture} /> : <Icon />}
                </span>

                <span className={`nav-item-text ${header && 'nav-item-text-header'}`}>{text}</span>

                {options && <span className='nav-item-options'><IoIosArrowDown /></span>}
            </div>
        )
    }
}