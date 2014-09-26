
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
			if(options.code){
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

	/*var ret = cityData.map(function(item) {
		var tmpObj = {
			name:item.name
		};

		if(level >= 2){
			if(item.sub){
				tmpObj.sub = item.sub.map(function(item){
					var tmpObj = {
						name:item.name
					};
					if(level >= 3){
						if(item.sub){
							tmpObj.sub = item.sub.map(function(item){
								var tmpObj = {
									name:item.name
								};
								return tmpObj;
							});
						}
					}
					return tmpObj;
				});
			}
		}

		return tmpObj;
	});*/
	var ret = fillRet(cityData);

	console.log(JSON.stringify(ret));

};