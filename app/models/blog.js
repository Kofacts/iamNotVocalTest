var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var blogSchema = mongoose.Schema({
	'author':String,
	'dateAdded':{type:Date, default:Date.now},
	'post':String,
	'title':String,
	'description':String,
	'comments':Array,
	'numberOfViews':Number,
	'numberOfShares':Number,
	'tags':String,
	'blogId':String,
	'featuredImage':String,
	'numberOfLikes':{type:Number, default:0},
	'published':Boolean,
	'hasPoll':Boolean,
	'pollId':String
})


module.exports = mongoose.model('Blog',blogSchema)