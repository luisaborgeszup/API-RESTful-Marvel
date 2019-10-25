const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const request = require('request')
const querystring = require('querystring')
const User = require('./user')
const app = express()
const port = 8000

app.listen(port, () => console.log(`App listening on port ${port}`))

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.get('/', (req, res) => {
  res.send("API-RESTful-Marvel")
})

app.get('/users', (req, res, next) => {
  User.find({}).lean().exec((e, docs) => {
    res.json(docs)
    res.end()
  })
})

app.get('/api', (req, res, next) => {
  request({
    url: 'https://randomuser.me/api/?nat=br',
    qs: User
  }, (error, response, body) => {
    if (error) {
      res.send('An erorr occured')
    } else {
      res.send(body)
    }
  })
})

app.get('/users/:username', (req, res, next) => {
  User.find({
    login: {
      username: req.params.username
    }
  }).lean().exec((e, docs) => {
    res.json(docs)
    res.end()
  })
})

app.post('/users', (req, res, next) => {
  request({
    url: 'https://randomuser.me/api/?nat=br',
    qs: User
  }, (error, response, body) => {
    if (error) {
      res.send('An error occured')
    } else {
      const teste = JSON.parse(body)
      teste.results.map(i => {
        const newUser = new User(i)
        newUser.save((err) => {
          if (err) {
            console.log(err)
          }
        })
      })
      res.send({
        salvo: "User created"
      })
    }
  })
})

app.delete('/users/:id', (req, res) => {
  User.remove({
    _id: req.params.id
  }).lean().exec((err) => {
    if (err) {
      res.status(500).json({
        error: err.message
      })
      res.end()
      return
    }
    res.send('User deleted')
  })
})

app.put('/users/:id', (req, res, next) => {
  req.newData = {
    gender: req.body.gender,
    name: {
      first: req.body.name.first,
      last: req.body.name.last
    },
    email: req.body.email,
    dob: {
      date: req.body.dob.date
    },
    location: {
      street: req.body.location.street,
      city: req.body.location.city,
      state: req.body.location.state
    },
    phone: req.body.phone,
    login: {
      username: req.body.login.username
    },
    picture: {
      large: req.body.picture.large,
      medium: req.body.picture.medium,
      thumbnail: req.body.picture.thumbnail
    }
  }
  
  User.findOneAndUpdate({
    _id: req.params.id
  }, req.newData, {
    upsert: true
  }, function (err, doc) {
    if (err) return res.send(500, {
      error: err
    });
    return res.send("succesfully saved");
  });
})