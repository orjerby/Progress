import React from 'react'
import { Router, Route, Switch, Link } from 'react-router-dom'

import history from '../history'
import ProjectList from './ProjectList'
import Login from './Login'

export default () => {
    return (
        <div>
            {/* we use our history object here */}
            <Router history={history}>
                <div>
                    {/* header(our links) */}
                    <Link to="/">Home</Link>
                    <Link to="/login">Login</Link>
                    s

                    {/* our routes. Switch only render the first route that matches the url */}
                    <Switch>
                        <Route path="/" exact component={ProjectList} />
                        <Route path="/login" exact component={Login} />
                    </Switch>
                </div>
            </Router>
        </div>
    )
}