#!/usr/bin/env node

var commander = require('commander');
var version = require('./package.json').version;

commander
	.version(version)
	.option('-l --level <n>','输出指定级别行政区数据',parseInt)
	.option('-o --output [value]','输出文件')
	.option('-j --js [value]','以指定全局对象输出js文件')
	.option('-a --amd','以AMD规范输出js文件')
	.option('-m --cmd','以CMD规范输出js文件')
	.option('-p --pretty','格式化输出')
	.option('-s --overseas','包含海外地区')
	.option('-y --pinyin','输出pinyin')
	.option('-i --ignore [value]','忽略 \'省|市|区|地区|县\'')
	.option('-c --code','包含地区编码（身份证前6位）')
	.option('-u --update','重新抓取原始数据')
	.option('-k --key [value]','对象键名 name,children,code,pinyin')
	// .option('-t --type','输出类型，array/object')
	// .option('-f --flatten','扁平化输出')
	// .option('-z --zipcode','包含邮编')
	.parse(process.argv);


if(commander.update){
	require('./lib/update').update();
}else{
	var options = {
		level:commander.level,
		code:commander.code,
		overseas:commander.overseas,
		output:commander.output,
		js:commander.js,
		amd:commander.amd,
		cmd:commander.cmd,
		pretty:commander.pretty,
		keys:commander.key,
		pinyin:commander.pinyin,
		ignore:commander.ignore
	};
	require('./lib/generator.js').generate(options);
}
