var restler = require('restler');
var cheerio = require('cheerio');


exports.update = function(){
	var cityDataListUrl = 'http://www.stats.gov.cn/tjsj/tjbz/xzqhdm/';
	getCityDataUrl(cityDataListUrl,function(err,cityDataUrl){
		if(err){
			console.log('loading city data list page failed.');
			console.log(err.message);
			return;
		}

		getCityRawData(cityDataUrl,function(err,cityRawData){
			if(err){
				console.log('loading city raw data failed.');
				console.log(err.message);
				return;
			}

			var cityData = parseCityData(cityRawData);

			var overseasDataListUrl = 'http://zh.wikipedia.org/zh/%E5%9B%BD%E5%AE%B6%E5%88%97%E8%A1%A8_(%E6%8C%89%E6%B4%B2%E6%8E%92%E5%88%97)';
			getOverseasRawData(overseasDataListUrl,function(err,overseasRawData){
				if(err){
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

	});

};


function getCityDataUrl(cityDataListUrl,callback){
	console.log('loading citydata list page...');
	restler.get(cityDataListUrl).on('success',function(data){
		console.log('loading successed.');
		console.log('parsing newest city data page url.');
		var $ = cheerio.load(data);
		var cityDataUrl = $('.center_list_contlist a').eq(0).attr('href');
		var url = require('url');
		console.log('parsing successed, got newest citydata url:'+cityDataUrl);
		callback(null,url.resolve(cityDataListUrl,cityDataUrl));
	}).on('fail',function(){
		callback(new Error('fail'));
	}).on('error',callback);
}

function getCityRawData(url,callback){
	console.log('loading city raw data page...');
	restler.get(url).on('success',function(data){
		console.log('loading successed.');
		console.log('parsing to get city raw data.');
		var $ = cheerio.load(data);
		var cityRawData = $('.TRS_Editor').last().find('style').remove().end().text();
		console.log('parsing successed.');
		callback(null,cityRawData);
	}).on('fail',function(){
		callback(new Error('fail'));
	}).on('error',callback);
}

function parseCityData(rawData){
	console.log('start parsing city data');
	var cityRegExp = /(\d{6})\s+([\D]+)/g;
	var matchResult = cityRegExp.exec(rawData);
	var cityArr = [];
	while(matchResult){
		cityArr.push({
			code:matchResult[1],
			name:matchResult[2].trim()
		});
		matchResult = cityRegExp.exec(rawData);
	}
	var cityData = [];
	var currPrefix = '';
	var currItem = [];

	cityArr.forEach(function(cityItem){
		var thisPrefix = cityItem.code.replace(/0*$/,'');
		var thisLevel = Math.ceil(thisPrefix.length / 2);

		if(thisLevel === 1){
			cityData.push(cityItem);
			currItem[0] = cityItem;
		}else{
			var parent = currItem[thisLevel - 2];
			if(!parent.children){
				parent.children = [];
			}
			parent.children.push(cityItem);
			currItem[thisLevel - 1] = cityItem;
		}
	});
	console.log('parsing successed.');
	return cityData;
}

function getOverseasRawData(url,callback){
	console.log('loading overseas raw data page...');
	restler.get(url).on('success',function(data){
		console.log('loading successed.');
		console.log('parsing to get overseas raw data.');
		var $ = cheerio.load(data);
		var overseasRawData = $('.wikitable tr td b a').map(function(){
			return $(this).text().trim();
		}).get().filter(function(item){
			var filterArr = [
				'中华人民共和国',
				'香港',
				'澳门'
			];
			return item && filterArr.indexOf(item) === -1;
		}).sort(function(item1,item2){
			// todo:按拼音排序
		});
		console.log('parsing successed.');
		callback(null,overseasRawData);
	}).on('fail',function(){
		callback(new Error('fail'));
	}).on('error',callback);
}