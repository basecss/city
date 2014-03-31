var commander = require('commander'),
	cityData = require('./src/cityData');

commander
	.version('0.0.1')
	.option('-p --province', '输出一级行政区数据')
	.option('-l --level', '输出指定级别行政区数据')
	.parse(process.argv);

generate();

function generate() {

	var ret = [];

	if(commander.province) {

		cityData.forEach(function(province) {
			ret.push(province.name);
		});

	} else if(commander.level && commander.args.toString() === '1') {

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