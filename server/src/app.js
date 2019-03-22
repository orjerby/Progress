const express = require('express')
require('./db/mongoose')
const path = require('path')
const taskRouter = require('./routers/task')
const projectRouter = require('./routers/project')
const secondaryRouter = require('./routers/secondary')
const littleRouter = require('./routers/little')

const app = express()

// make express expect to get json in the api calls
app.use(express.json())

// make express knows about our client(react) folder in our heroku's files
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')))

app.use(projectRouter)
app.use(taskRouter)
app.use(secondaryRouter)
app.use(littleRouter)

// if the user try to enter the url, express will take him to our client(react)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'))
})

module.exports = app