exports.generate = function(options) {

	var level = options.level || 3;

	var cityData = require('./citydata.json');

	var currLevel = 0;

	var fillRet = function(arr){
		currLevel++;
		var ret = arr.map(function(item){
			if(item.name === '海外' && !options.overseas){
				return null;
			}
			var tmpObj = {
				name:item.name
			};
			if(options.code && item.code){
				tmpObj.code = item.code;
			}
			if(level > currLevel && item.sub){
				tmpObj.sub = fillRet(item.sub);
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
