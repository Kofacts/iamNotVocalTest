var mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
	'firstname':String,
	'lastname':String,
	'about':String,
	'dateAdded':{type:Date,default: Date.now},
	'picture':String,
	'email':String,
	'position':String,
	'cadre':String
})
// the cadre is to determine if the user is in management level or just an employee, would certainly be an options list

module.exports = mongoose.model('Team',teamSchema);