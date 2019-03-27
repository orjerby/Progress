import React from 'react'
import { Router, Route, Switch, Link } from 'react-router-dom'

import history from '../history'
import Dashboard from './Dashboard'
import Login from './Login'

export default () => {
    return (
        <div>
            {/* we use our history object here */}
            <Router history={history}>
                <div>
                    {/* header(our links) */}
                    {/* <Link to="/">Login</Link>
                    <Link to="/home">Home</Link> */}

                    {/* our routes. Switch only render the first route that matches the url */}
                    <Switch>
                        <Route path="/" exact component={Login} />
                        <Route path="/home" exact component={Dashboard} />
                    </Switch>
                </div>
            </Router>
        </div>
    )
}