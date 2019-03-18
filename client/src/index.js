import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import reducers from './reducers/index'
import reduxThunk from 'redux-thunk'

import App from './components/App'

// for redux dev tools on chrome
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// create the store with the reducers and the redux dev tools on chrome and redux thunk
// redux thunk make it easy to use async actions
const store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(reduxThunk))
)

// find the root id in the public/index.html file and render to it the react app
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, document.querySelector('#root'))