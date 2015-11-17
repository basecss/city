var pinyin = require('pinyin');
var util = require('util');

var convertToPinyin = function(str) {
	var pinyins = pinyin(str, { style: pinyin.STYLE_NORMAL });
	return pinyins.map(function(word) {
		return word[0];
	}).join('_').toLowerCase();
};

exports.generate = function(options) {

	var level = options.level || 3;
	var cityData = require('./citydata.json');
	var currLevel = 0;
	if(!options.keys || typeof options.keys !== 'string' || !options.keys.length){
		options.keys = ['name','children','code','pinyin'];
	}else{
		options.keys = options.keys.split(',');
	}
	options.ignore = options.ignore || '';
	options.ignoreRegexp = new RegExp(util.format('(%s)$', options.ignore), 'i');


	var fillRet = function(arr){
		currLevel++;
		var ret = arr.map(function(item){
			if(item.name === '海外' && !options.overseas){
				return null;
			}
			var tmpObj = {};
			tmpObj[options.keys[0]] = item.name.replace(options.ignoreRegexp, '');
			if(options.code && item.code){
				tmpObj[options.keys[2]] = item.code;
			}
			// 输出拼音
			if(options.pinyin){
				tmpObj[options.keys[3]] = convertToPinyin(tmpObj[options.keys[0]]);
			}
			if(level > currLevel && item.children){
				tmpObj[options.keys[1]] = fillRet(item.children);
			}
			return tmpObj;
		});
		currLevel--;
		return ret;
	};

	var ret = fillRet(cityData).filter(function(item){
		return item;
	});

	if(options.amd){
		output(ret,options.pretty,options.output,'amd');
	}else if(options.cmd){
		output(ret,options.pretty,options.output,'cmd');
	}else if(options.js){
		output(ret,options.pretty,options.output,'js',options.js);
	}else{
		output(ret,options.pretty,options.output,'json');
	}

};

function output(data,isPretty,fileName,format,varName){
	var preText = '', endText = '';
	// var prettyStr = '\t';
	if(format === 'js'){
		if(typeof varName === 'boolean'){
			varName = 'city';
		}
		preText = 'var ' + varName + ' = ';
		if(!isPretty){
			preText = 'var ' + varName + '=';
		}
		endText = ';';
	}else if(format === 'amd'){
		preText = 'define(function(){\n\treturn ';
		if(!isPretty){
			preText = 'define(function(){return ';
		}
		endText = ';\n});';
		if(!isPretty){
			endText = ';});';
		}
	}else if(format === 'cmd'){
		preText = 'define(function(require, exports, module) {\n\tmodule.exports = ';
		if(!isPretty){
			preText = 'define(function(require,exports,module){module.exports=';
		}
		endText = ';\n});';
		if(!isPretty){
			endText = ';});';
		}
	}
	var dataString = JSON.stringify(data,null,isPretty?'\t':undefined);
	dataString = preText + dataString + endText;
	if(!fileName){
		console.log(dataString);
	}else{
		var fs = require('fs');
		fs.writeFileSync(fileName,dataString);
	}

}
