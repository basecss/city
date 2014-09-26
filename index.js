#!/usr/bin/env node

var commander = require('commander');
var version = require('./package.json').version;
var generator = require('./lib/generator.js');

commander
	.version(version)
	.option('-l --level <n>','输出指定级别行政区数据',parseInt)
	.option('-s --overseas','包含海外地区')
	// .option('-t --type','输出类型，array/object')
	// .option('-k --key','对象键名，name/zipcode/')
	// .option('-f --flatten','扁平化输出')
	// .option('-z --zipcode','包含邮编')
	.option('-c --code','包含地区编码（身份证前6位）')
	.option('-u --update','重新抓取原始数据')
	.parse(process.argv);


if(commander.update){
	require('./lib/update').update();
}else{
	var options = {
		level:commander.level,
		code:commander.code,
		overseas:commander.overseas
	};
	generator.generate(options);
}
