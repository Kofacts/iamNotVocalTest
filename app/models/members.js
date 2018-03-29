var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var memberSchema = mongoose.Schema({
	'firstName':String,
	'lastName':String,
	'email':String,
	'password':String,
	'participatedIn':[],
	'uniqueHash':String,
	'ageRange':String,
	'dateJoined':{type:Date,default:Date.now},
	'picture':String,
	'registeredVoter':String

})

memberSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

memberSchema.methods.compareHash = function(password){
	return bcrypt.compareSync(password,this.password)
}

module.exports = mongoose.model('Member',memberSchema)