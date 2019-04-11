import React from 'react'
import { connect } from 'react-redux'
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
import { setUser } from '../actions/user'

import '../styles/menu.css'
import Home from './Home';

class App extends React.Component {
    componentDidMount = () => {
        const res = Math.round(Math.random())

        if (res === 0) { // check local storage for user
            this.props.setUser()
        }
    }

    render() {
        return (
            <DragDropContextProvider backend={HTML5Backend}>
                {/* we use our history object here */}
                <Router history={history}>

                    {
                        this.props.user ?
                            <div>
                                {/* <Menu /> */}

                                <Menu>
                                    <ProjectItem />
                                    <Item Icon={<FaSave color='#627f99' />} text='Backlog' handleClick={() => history.push('/backlog')} />
                                    <Item Icon={<FaStar color='#627f99' />} text='sprints' />
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
                            :
                            <Home />
                    }


                </Router>
            </DragDropContextProvider>
        )
    }
}

function mapStateToProps({ userReducer }) {
    return {
        user: userReducer
    }
}

export default connect(mapStateToProps, { setUser })(App)