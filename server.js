const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const request = require('request')
const User = require('./user')
const pagination = require('./pagination')
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

app.get('/users', pagination(User), (req, res) => {
  res.json(res.pagination)
})

app.get('/included', pagination(User, {class: "included"}), (req, res) => {
  res.json(res.pagination)
})

app.get('/checked', pagination(User, {class: "checked"}), (req, res) => {
  res.json(res.pagination)
})

app.get('/discarted', pagination(User, {class: "deleted"}), (req, res) => {
  res.json(res.pagination)
})

app.get('/profile', (req, res, next) => {
  User.find({class: "profile"}).lean().exec((e, docs) => {
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

app.get('/user/:_id', (req, res, next) => {
  User.find({
    _id: req.params._id
  }).exec((e, docs) => {
    res.json(docs)
    res.end()
  })
})

app.get('/users/names/:first', (req, res, next) => {
  User.find({
    "name.first": req.params.first
  }).exec((e, docs) => {
    console.log(e)
    res.json(docs)
    res.end()
  })
})

app.get('/users/emails/:email', (req, res, next) => {
  User.find({
    email: req.params.email
  }).exec((e, docs) => {
    console.log(e)
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
      const data = JSON.parse(body)
      data.results.map(i => {
        const newUser = new User({...i, class: "included"})
        newUser.save((err) => {
          if (err) {
            res.status(500).json({ error: err.message })
          }
        })
      })
      res.send({
        salvo: "User created"
      })
    }
  })
})

app.post('/checked', (req, res, next) => {
  const newUser = new User({
    gender: req.body.gender,
    name: {
      first: req.body.name.first,
      last: req.body.name.last
    },
    email: req.body.email,
    location: {
      street: req.body.location.street,
      city: req.body.location.city,
      state: req.body.location.state
    },
    phone: req.body.phone,
    login: {
      username: req.body.login.username,
      password: req.body.login.password
    },
    dob: {
      date: req.body.dob.date,
      age: req.body.dob.age
    },
    picture: {
      large: req.body.picture.large,
      medium: req.body.picture.medium,
      thumbnail: req.body.picture.thumbnail
    },
    class: req.body.class
  })
  newUser.save((err) => {
    if (err) {
      res.status(500).json({ error: err.message })
    }
  })
})

app.post('/discarted', (req, res, next) => {
  const newUser = new User({
    gender: req.body.gender,
    name: {
      first: req.body.name.first,
      last: req.body.name.last
    },
    email: req.body.email,
    location: {
      street: req.body.location.street,
      city: req.body.location.city,
      state: req.body.location.state
    },
    phone: req.body.phone,
    login: {
      profileUser: req.body.profileUserssword
    },
    dob: {
      date: req.body.dob.date,
      age: req.body.dob.age
    },
    picture: {
      large: req.body.picture.large,
      medium: req.body.picture.medium,
      thumbnail: req.body.picture.thumbnail
    },
    class: req.body.class
  })
  newUser.save((err) => {
    console.log(err)
    if (err) {
      res.status(500).json({ error: err.message })
    }
    res.send("Save")
  })
})

app.post('/profile', (req, res, next) => {
  request({
    url: 'https://randomuser.me/api/?nat=br',
    qs: User
  }, (error, response, body) => {
    if (error) {
      res.send('An error occured')
    } else {
      const user = JSON.parse(body)
      user.results.map(i => {
        const newUser = new User({...i, class: "profile"})
        newUser.save((err) => {
          if (err) {
            res.status(500).json({ error: err.message })
          }
        })
      })
      res.send({
        salvo: "User created"
      })
    }
  })
})

app.delete('/users/emails/:email', (req, res) => {
  User.remove({
    email: req.params.email
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

app.put('/users/emails/:email', (req, res, next) => {
  req.newData = {
    gender: req.body.gender,
    name: {
      first: req.body.name.first,
      last: req.body.name.last
    },
    email: req.body.email,
    location: {
      street: req.body.location.street,
      city: req.body.location.city,
      state: req.body.location.state
    },
    phone: req.body.phone,
    login: {
      username: req.body.login.username,
      password: req.body.login.password
    },
    dob: {
      date: req.body.dob.date,
      age: req.body.dob.age
    },
    picture: {
      large: req.body.picture.large,
      medium: req.body.picture.medium,
      thumbnail: req.body.picture.thumbnail
    },
    class: req.body.class
  }
  
  User.findOneAndUpdate({
    email: req.params.email
  }, req.newData, {
    upsert: true
  }, function (err, doc) {
    if (err) return res.send(500, {
      error: err
    });
    return res.send("succesfully saved");
  });
})