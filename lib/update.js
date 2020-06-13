var restler = require('restler');
var cheerio = require('cheerio');

var xzqh_url = 'http://www.mca.gov.cn/article/sj/xzqh/2020/2020/202003301019.html';
var overseas_url = 'https://zh.wikipedia.org/zh/%E6%8C%89%E5%A4%A7%E6%B4%B2%E6%8E%92%E5%88%97%E7%9A%84%E5%9B%BD%E5%AE%B6%E5%88%97%E8%A1%A8';

exports.update = function () {

	getCityRawData(xzqh_url, function(err, cityRawData) {
		if (err) {
			console.log('loading city raw data failed.');
			console.log(err.message);
			return;
		}

		var cityData = parseCityData(cityRawData);

		getOverseasRawData(overseas_url, function (err,overseasRawData) {
			if (err) {
				console.log('loading overseas raw data failed.');
				console.log(err.message);
			} else {
				console.log('mixing overseas data to city data...');
				var overseasObj = {name:'海外'};
				overseasObj.children = overseasRawData.map(function(item){
					return {
						name:item
					};
				});
				cityData.push(overseasObj);
				console.log('mixing overseas data to city data successed.');
			}

			console.log('writing data file...');
			var fs = require('fs');
			fs.writeFileSync('./lib/citydata.json',JSON.stringify(cityData));
			console.log('writing data file successed.');
		});
	});

};

function getCityRawData (url, callback) {
	console.log('loading city raw data page...');
	restler.get(url)
		.on('success',function(data){
			console.log('loading successed.');
			console.log('parsing to get city raw data.');
			var $ = cheerio.load(data);

			var $validRows = $('tr').filter(function (_, tr) {
				return $(tr).attr('height') === '19'
			});

			var rowsContent = [];

			$validRows.each(function (_, tr) {
				var $validTds = $(tr).find('td').filter(function (_, td) {
					return $(td).html().trim() !== '';
				});
				var colsContent = [];
				$validTds.each(function (_, td) {
					colsContent.push($(td).text());
				});
				rowsContent.push(colsContent);
			});

			callback(null, rowsContent);
		}).on('fail',function () {
			callback(new Error('fail'));
		}).on('error',callback);
}

function parseCityData (rawData) {
	console.log('start parsing city data');

	var provinceIndexes = rawData.map(function (row, index) {
		if (!row[1].match(/\s/)) {
			return index;
		} else {
			return -1;
		}
	}).filter(function (idx) {
		return idx > -1;
	})

	var groups = provinceIndexes.map(function (idx, index) {
		var topLevel = {
			code: rawData[idx][0].trim(),
			name: rawData[idx][1].trim(),
			children: []
		};

		var children = rawData.slice(idx + 1, provinceIndexes[index + 1]);
		var hasCity = children.some(function (row) {
			return row[1].length - row[1].trim().length === 1;
		});

		if (hasCity) {
			var cityIndexes = children.map(function (row, index) {
				if (row[1].length - row[1].trim().length === 1) {
					return index;
				} else {
					return -1;
				}
			}).filter(function (idx) {
				return idx > -1;
			});

			var cityGroups = cityIndexes.map(function (idx, index) {
				var cityLevel = {
					code: children[idx][0].trim(),
					name: children[idx][1].trim(),
					children: []
				};

				var countyList = children.slice(idx + 1, cityIndexes[index + 1]).map(function (row) {
					return {
						code: row[0].trim(),
						name: row[1].trim()
					}
				});

				cityLevel.children = countyList.slice();
				return cityLevel;
			});

			topLevel.children = cityGroups.slice();
		} else { // 直辖市
			var _children = children.map(function (child) {
				return {
					code: child[0].trim(),
					name: child[1].trim()
				}
			});
			topLevel.children = _children.slice();
		}
		return topLevel;
	});

	console.log('parsing successed.');
	return groups;
}

function getOverseasRawData (url, callback) {
	console.log('loading overseas raw data page...');
	restler.get(url)
		.on('success', function (data) {
			console.log('loading successed.');
			console.log('parsing to get overseas raw data.');
			var $ = cheerio.load(data);
			var overseasRawData = $('.wikitable tr td b a').map(function () {
				return $(this).text().trim();
			}).get().filter(function (item) {
				var filterArr = [
					'中华人民共和国',
					'香港',
					'澳门',
					'澳門',
					'中华民国',
					'中華民國'
				];
				return item && filterArr.indexOf(item) === -1;
			});
			// @todo: 拼音支持
			console.log('parsing successed.');
			callback(null, overseasRawData);
		})
		.on('fail', function () {
			callback(new Error('fail'));
		})
		.on('error', callback);
}