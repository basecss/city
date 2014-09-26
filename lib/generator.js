
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

	console.log(JSON.stringify(ret));

};