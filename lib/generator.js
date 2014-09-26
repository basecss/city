
exports.generate = function(options) {

	var level = options.level || 3;

	var cityData = require('./citydata.json');

	var currLevel = 0;

	var fillRet = function(arr){
		currLevel++;
		var ret = arr.map(function(item){
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

	var ret = fillRet(cityData);

	console.log(JSON.stringify(ret));

};