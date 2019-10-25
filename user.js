const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const app = express()
mongoose.connect('mongodb://localhost/API-RESTful-Marvel')

const createUser = new mongoose.Schema({
  "name": {
    "first": {
      type: String
    },
    "last": {
      type: String
    }
  },
  "gender": {
    type: String,
  },
  "email": {
    type: String,
    unique: true
  },
  // "dob": {
  //     "date": {
  //         type: Date,
  //     }
  // },
  "location": {
    "street": {
      number: {
        type: Number,
      },
      name: {
        type: String
      }
    },
    "city": {
      type: String,
    },
    "state": {
      type: String,
    }
  },
  "phone": {
    type: String,
    unique: true
  },
  "login": {
    "username": {
      type: String,
      unique: true
    }
  },
  "picture": {
    "large": {
      type: String,
      unique: true
    },
    "medium": {
      type: String,
      unique: true
    },
    "thumbnail": {
      type: String,
      unique: true
    }
  },
}, {
  collection: 'users'
})

createUser.pre('remove', function (next) {
  this.model('user').deleteMany({
    user: this.uuid
  }, next);
})

const User = mongoose.model("User", createUser, "users")

module.exports = User