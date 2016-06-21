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
	.option('-u --update','重新抓取原始数据，或在citydata.json丢失的情况下使用')
	.option('-k --key [value]','对象键名 name,children,code,pinyin，顺序不能改变，例如n,s,c,p')
	.option('-f --flat [value]','扁平化输出，可以指定parentId参数名称')
    .option('--closed','地区树默认为关闭状态')
    .option('--father [value]','转出指定父节点的所有子节点，不含父节点')
	.option('-r --reverse','转出以子节点为根的树，便于倒查父节点')
    // .option('-t --type','输出类型，array/object')
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
		ignore:commander.ignore,
        flat:commander.flat,
        closed:commander.closed,
        father:commander.father,
		reverse:commander.reverse
	};
	require('./lib/generator.js').generate(options);
}
