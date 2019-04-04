import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { Container } from 'react-bootstrap'
import { FaSave, FaStar, FaTableTennis } from "react-icons/fa";

import history from '../history'
import BacklogPage from './BacklogPage'
import Menu from './menu/Menu'
import Item from './menu/Item'
import ProjectItem from './menu/ProjectItem'

import '../styles/menu.css'

export default () => {
    return (
        <DragDropContextProvider backend={HTML5Backend}>
            {/* we use our history object here */}
            <Router history={history}>
                <div>

                    {/* <Menu /> */}
                    
                    <Menu>
                        <ProjectItem />
                        <Item Icon={<FaSave color='#627f99' />} text='Backlog' handleClick={() => history.push('/backlog')} />
                        <Item Icon={<FaStar color='#627f99'/>} text='sprints' />
                        <Item Icon={<FaTableTennis color='#627f99' />} text='Reports' />
                    </Menu>

                    <div className='app-container'>
                        <Container fluid>

                            {/* our routes. Switch only render the first route that matches the url */}
                            <Switch>
                                <Route path="/backlog" exact component={BacklogPage} />
                            </Switch>

                        </Container>
                    </div>

                </div>
            </Router>
        </DragDropContextProvider>
    )
}