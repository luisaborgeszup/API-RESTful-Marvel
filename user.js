const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const app = express()
mongoose.connect('mongodb://localhost/API-RESTful-Marvel')

const createUser = new mongoose.Schema({
    "name": {
        "first": {
            type: String,
            unique: true
        },
        "last": {
            type: String,
            unique: true
        }
    },
    "gender": {
        type: String,
    },
    "email": {
        type: String,
        unique: true
    },
    "dob": {
        "date": {
            type: Date,
        }
    },
    "location": {
        "street": {
            type: String,
        }
    },
    "phone": {
        type: String,
        unique: true
    },
    "login": {
        "password": {
            type: String,
            unique: true
        }
    }
}, { collection: 'users' })

createUser.pre('remove', function(next) {
    this.model('User').deleteMany({ user: this.uuid }, next);
})

const User = mongoose.model('User', createUser, 'users')
 
module.exports = User