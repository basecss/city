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

			console.log('writing data file...');
			var fs = require('fs');
			fs.writeFileSync('./lib/citydata.json',JSON.stringify(cityData));
			console.log('writing data file successed.');
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
			name:matchResult[2]
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
			if(!parent.sub){
				parent.sub = [];
			}
			parent.sub.push(cityItem);
			currItem[thisLevel - 1] = cityItem;
		}
	});
	console.log('parsing successed.');
	return cityData;
}