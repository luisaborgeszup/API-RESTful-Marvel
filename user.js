const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/API-RESTful-Marvel');
 
const createUser = new mongoose.Schema({
    username: String,
    email: String,
    password: String
}, { collection: 'users' })

createUser.pre('remove', function(next) {
    this.model('User').deleteMany({ user: this._id }, next);
})

const User = mongoose.model('User', createUser, 'users')
 
module.exports = User