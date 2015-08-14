require('./db');								// 单独测试时用
var mongoose = require('mongoose');

// var listSchema = mongoose.Schema({
// 	id: Number
// });
var testSchema = mongoose.Schema({					// Test Schema
	test: String,
	list: {
		id: { type: Number },
		name: { type: String }
	}
}, {
	versionKey: false,
	collection: 'test'
});

var Test = mongoose.model('test', testSchema);		// Test Model

// Test.find(function (err,docs) {						// 显示查询结构会慢一些在console出现，因为“异步”
// 	console.log(docs);
// });

var test = new Test();						
test.test = 'First';
test.list.id = 1;
test.list.name = '一';
test.save(function () {
	console.log('保存成功！');
});