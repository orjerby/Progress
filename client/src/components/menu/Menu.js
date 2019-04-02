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
                        handleOptionsClick={()=>console.log('p')}
                        picture='https://img.icons8.com/material/4ac144/256/twitter.png'
                        text='orjerby'
                        subText='Software project'
                        options
                        header />
                    <Item Icon={FaRunning} text='FOR board' subText='Software project' options/>
                    <Item Icon={FaSave} text='Backlog' handleClick={() => history.push('/backlog')} />
                    <Item Icon={FaStar} text='sprints' />
                    <Item Icon={FaTableTennis} text='Reports' />
                </div>
            </div>
        )
    }
}