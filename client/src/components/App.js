import React from 'react'
import { connect } from 'react-redux'
import { Router, Route, Switch, Redirect } from 'react-router-dom'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import '../styles/menu.css'
import history from '../history'
import { fetchUserByToken, logoutUser } from '../actions/user'
import Home from './Home';
import Dashboard from './Dashboard';

class App extends React.Component {
    componentDidMount = () => {
        const { fetchUserByToken } = this.props
        
        const token = localStorage.getItem('token')
        if (token) {
            fetchUserByToken(token)
        }
    }

    render() {
        const { isLoggedIn, isLoading } = this.props
        
        return (
            <DragDropContextProvider backend={HTML5Backend}>
                {/* we use our history object here */}
                <Router history={history}>

                    <div>
                        {/* our routes. Switch only render the first route that matches the url */}
                        <Switch>
                            <Route path="/" exact render={props => {
                                if (!isLoading && isLoggedIn) {
                                    return <Redirect to='/dashboard' />
                                }
                                if (!isLoading && !isLoggedIn){
                                    return <Home {...props} />
                                }
                            }}
                            />
                            <Route path="/dashboard" render={props => {
                                if (!isLoading && isLoggedIn) {
                                    return <Dashboard {...props} />
                                }
                                if (!isLoading && !isLoggedIn){
                                    return <Redirect to='/' />
                                }
                            }} />
                            <Route component={props => <h1>Page not found</h1>} />
                        </Switch>
                    </div>

                </Router>
            </DragDropContextProvider>
        )
    }
}

function mapStateToProps({ userReducer, apiReducer }) {
    return {
        isLoggedIn: userReducer ? true : false,
        token: userReducer ? userReducer.token : null,
        isLoading: apiReducer.loginLoading
    }
}

export default connect(mapStateToProps, { fetchUserByToken, logoutUser })(App)