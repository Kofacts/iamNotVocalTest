var mongoose = require('mongoose');

var reportSchema = mongoose.Schema({
	'author':String,
	'dateAdded':{type:Date, default:Date.now},
	'post':String,
	'title':String,
	'description':String,
	'comments':Array,
	'numberOfViews':Number,
	'numberOfShares':Number,
	'tags':String,
	'numberOfLikes':{type:Number, default:0},
	'published':Boolean
})


module.exports = mongoose.model('Report',reportSchema)