const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/progress', {
    useNewUrlParser: true,
    useFindAndModify: false
}, () => {
    console.log('connected')
})