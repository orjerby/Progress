import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { Container } from 'react-bootstrap'

import history from '../history'
import Dashboard from './Dashboard'
import Menu from './menu/Menu'

import '../styles/style.css'

export default () => {
    return (
        <DragDropContextProvider backend={HTML5Backend}>
            {/* we use our history object here */}
            <Router history={history}>
                <div>

                    <Menu />

                    <div className='app-container'>
                        <Container fluid>

                            {/* our routes. Switch only render the first route that matches the url */}
                            <Switch>
                                <Route path="/backlog" exact component={Dashboard} />
                            </Switch>

                        </Container>
                    </div>

                </div>
            </Router>
        </DragDropContextProvider>
    )
}