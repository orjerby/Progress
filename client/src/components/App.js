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
import { fetchUserByToken, logoutUser } from '../actions/user'

import '../styles/menu.css'
import Home from './Home';

class App extends React.Component {
    componentDidMount = () => {
        const { fetchUserByToken } = this.props

        const token = localStorage.getItem('token')
        if (token) {
            fetchUserByToken(token)
        }
    }

    renderContent = () => {
        const { loggedIn, loading, logoutUser, token } = this.props

        if (loggedIn) {
            return (
                <div>
                    {/* <Menu /> */}

                    <Menu>
                        <ProjectItem />
                        <Item Icon={<FaSave color='#627f99' />} text='Backlog' handleClick={() => history.push('/backlog')} />
                        <Item Icon={<FaStar color='#627f99' />} text='sprints' />
                        <Item Icon={<FaTableTennis color='#627f99' />} text='Reports' />
                        <Item Icon={<FaSave color='#627f99' />} text='Logout' handleClick={() => logoutUser(token)} />
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
            )
        }

        if (!loading) {
            return <Home />
        }
    }

    render() {
        const { renderContent } = this

        return (
            <DragDropContextProvider backend={HTML5Backend}>
                {/* we use our history object here */}
                <Router history={history}>

                    {renderContent()}

                </Router>
            </DragDropContextProvider>
        )
    }
}

function mapStateToProps({ userReducer, apiReducer }) {
    return {
        loggedIn: userReducer ? true : false,
        token: userReducer ? userReducer.token : null,
        loading: apiReducer.fetchLoading
    }
}

export default connect(mapStateToProps, { fetchUserByToken, logoutUser })(App)