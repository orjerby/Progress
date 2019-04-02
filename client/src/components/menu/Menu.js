import React from 'react'
import { FaRunning, FaSave, FaStar, FaTableTennis } from "react-icons/fa";

import history from '../../history'
import Item from '../menu/Item';

export default class Menu extends React.Component {
    render() {
        return (
            <div className='nav-container'>
                <div className='nav-item-container'>
                    <Item
                        handleClick={() => history.push('/')}
                        picture='https://img.icons8.com/material/4ac144/256/twitter.png' text='Software Engineer' options header />
                    <Item Icon={FaRunning} text='FOR board' />
                    <Item Icon={FaSave} text='Backlog' handleClick={() => history.push('/backlog')} />
                    <Item Icon={FaStar} text='sprints' />
                    <Item Icon={FaTableTennis} text='Reports' />
                </div>
            </div>
        )
    }
}