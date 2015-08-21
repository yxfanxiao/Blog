require('./db')								// 单独测试时用
var mongoose = require('mongoose')
var Schema = mongoose.Schema

// var ChildSchema = new Schema({
// 	// age: Number,
// 	name: 'string'
// })
var ParentSchema = new Schema({
	name: String,
	child: [{
		name: String
	}]
})

var Parent = mongoose.model('Parent', ParentSchema)
var parent = new Parent()
parent.name = 'father'
parent.child.push ({ name: 'son'})
parent.save()