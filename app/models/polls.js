var mongoose = require('mongoose');

var pollSchema = mongoose.Schema({
	'createdAt':{type:Date, default:Date.now},
	'createdBy':String,
	'startAt':String,
	'endAt':String,
	'name':String,
	'description':String,
	'contestants':[],
	'participants':[],
	'pollId':String,
	'pollType':String,
	'accessType':String,
	'passcode':String,
	'startDate':String,
	'endDate':String,
})


module.exports = mongoose.model('Poll',pollSchema);