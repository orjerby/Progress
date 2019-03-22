const app = require('./app')

// get the port from our secret file in config folder
const port = process.env.PORT

// open the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})