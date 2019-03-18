const express = require('express')
const path = require('path')

const app = express()

// make express expect to get json in the api calls
app.use(express.json())

// make express knows about our client(react) folder in our heroku's files
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')))

// get the port from our secret file in config folder
const port = process.env.PORT

// if the user try to enter the url, express will take him to our client(react)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'))
})

// open the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})