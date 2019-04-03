import React from 'react'

export default class Menu extends React.Component {
    render() {
        return (
            <div className='menu-container'>
                <div className='menu-item-container'>
                    {this.props.children}
                </div>
            </div>
        )
    }
}