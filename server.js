const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const User = require('./user')
const app = express()
const port = 3000

app.listen(port, () => console.log(`App listening on port ${port}`))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => { 
    res.send()
})

app.get('/users', (req, res, next) => {
    User.find({}).lean().exec((e,docs) => {
       res.json(docs)
       res.end()
    })
})

app.get('/users/:id', (req, res, next) => {
    User.find({ _id: req.params.id }).lean().exec((e, docs) => {
        res.json(docs)
        res.end()
    })
})

app.post('/users', (req, res, next) => {
    const newUser = new User({ username: req.body.username, email: req.body.email, password: req.body.password})
    newUser.save((err) => {
        if (err) {
            res.status(500).json({ error: err.message })
            res.end()
            return
        }
        res.json(newUser)
        res.end()
    })
})

app.delete('/users/:id', (req, res) => {
    User.remove({ _id: req.params.id }).lean().exec((err) => {
        if (err) {
            res.status(500).json({ error: err.message })
            res.end()
            return
        }
        res.send('User deleted')
    })
})

app.post('/users/:id/update', (req, res, next) => {
    req.newData = {username: req.body.username, email: req.body.email, password: req.body.password}
    User.findOneAndUpdate({ _id: req.params.id }, req.newData, {upsert:true}, function(err, doc){
        if (err) return res.send(500, { error: err });
        return res.send("succesfully saved");
    });
})
