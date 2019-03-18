import React from 'react'
import { Router, Route, Link } from 'react-router-dom'

import history from '../history'
import Home from './Home'
import Login from './Login'

export default () => {
    return (
        <div>
            {/* we use our history object here */}
            <Router history={history}>
                <div>
                    {/* our links */}
                    <Link to="/">Home</Link>
                    <Link to="/login">Login</Link>

                    {/* our routes */}
                    <Route path="/" exact component={Home} />
                    <Route path="/login" exact component={Login} />
                </div>
            </Router>
        </div>
    )
}