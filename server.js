const bodyParser = require('body-parser')
const express = require('express')
const { check, validationResult } = require('express-validator')
const app = express()
const port = 3000
const users = require('./users')

app.listen(port, () => console.log(`App listening on port ${port}`))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/users', (req, res) => {
    res.json(users)
})

app.post('/users', (req, res) => {
    users.push(req.body)
    return res.send(users)
})


