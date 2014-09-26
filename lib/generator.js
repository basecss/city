var cityData = require('./citydata.json');

exports.generate = function(options) {

	var ret = [];

	if(options.province) {

		cityData.forEach(function(province) {
			ret.push(province.name);
		});

	} else if(options.level && options.args.toString() === '1') {

		cityData.forEach(function(item) {
			
		var temp = {};

			temp.province = item.name; // 省

			if(Array.isArray(item.sub)) { // 遍历市
				temp.city = [];

				item.sub.forEach(function(city) {
					temp.city.push(city.name);
				});

			}

			ret.push(temp);

		});

	} else {

		cityData.forEach(function(item) {
			
		var temp = {};

			temp.province = item.name; // 省

			if(Array.isArray(item.sub)) { // 遍历市
				temp.city = [];

				item.sub.forEach(function(city) {

					var o = {};

					if(Array.isArray(city.sub)) { // 县

						o[city.name] = city.sub.map(function(county) {
							return county.name;
						});

						temp.city.push(o);

					} else {

						temp.city.push(city.name);

					}

				});
			}

			ret.push(temp);

		});
	}

	console.log(JSON.stringify(ret));

};