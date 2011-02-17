var hoursBefore = 0.5;
var hoursAfter = 0.5;
var lastVal = 0;//laastste waarde van slider bij request
var url = "";
var dummyUrl = "mockup/data/getData.json.php";
var useDummy = false;
var startTimestamp = 0;
var startTimestamp = getYesterday();
var endTimestamp = startTimestamp + 24*60*60;//*1000? /1000?
var maxfeatures = 50;
var logOutput = "console";

var datasets = {
	twitter: {
		name: "twitter"
	},
	nogiets: {
		name: "nogiets"
	}
}

function log(msg) {
	if (logOutput == "console" && typeof(console) != undefined) {
		console.log(msg);
	} else {
		document.getElementById("logwin").innerHTML += "<br/>"+msg;
	}
}
function getCurrentDataset() {
	var set = $("#dataset").val();
	if (typeof(datasets[set]) != "undefined") {
		return datasets[set];
	} else {
		return null;
	}
}

function slideHandler(evt, ui) {
	var ts = ui.value*1000;
	var now = new Date(ts);
	var nowString = now.getHours()+"."+now.getMinutes();
	$(".ui-slider-handle").html('<span>' + nowString +'</span>');
	
	changeHandler(evt, ui);
}

function getYesterday() {
	var now = new Date();
	var day = now.getDate();
	var month = now.getMonth();
	var year = now.getFullYear();
	var today = new Date(year, month, day);
	return (today.getTime()/1000-24*3600);
}

function getToday() {
	var now = new Date();
	var day = now.getDate();
	var month = now.getMonth();
	var year = now.getFullYear();
	var today = new Date(year, month, day);
	return today.getTime()/1000;
}

function getTimeRange(now) {
	//return object dtstart, dtend
	var dtstart = now - hoursBefore*3600;
	var dtend = now + hoursBefore*3600;
	return {
		dtstart: dtstart,
		dtend: dtend
	}
}

if (typeof(bbox) == "undefined") {
	bbox = function() {
		var top = 0;
		var left = 0;
		var bottom = 100;
		var right = 100;
		return top+","+left+","+bottom+","+right;
	}
}

function changeHandler(evt, ui) {
  var ts = ui.value*1000;
	var now = new Date(ts);
	var nowString = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+"T" +now.getHours()+":"+now.getMinutes();
  // var timeRange = getTimeRange(now);
  // var dtstart = timeRange.dtstart;
  // var dtend = timeRange.dtend;
	
	//getBoundingBox
	var bboxinfo = bbox();
	
	
	
	var dataToSend = {
    // ts__gt: now-1800,
    ts__lt: nowString,
		bbox:bboxinfo
	}
	getData(dataToSend);
}

/*
    http://example.com/featureserver.cgi/simple?bbox=-180,-90,0,0
    http://example.com/featureserver.cgi/simple?maxfeatures=10
    http://example.com/featureserver.cgi/simple?queryable=title,description&title=My%20Feature&description=Fun 
    
queryable=dtstart,dtend&dtstart=...[ts unix]&dtend=...&maxfeatures=..&bbox=
dataset?
*/

function updateMap(data) {
}

function dataSuccesHandler(data) {
	var features = data.features;
	map.removeOverlays();
	for (var i=0; i<features.length; i++) {
		var f = features[i];
		var lat = f.geometry.coordinates[0];
		var lng = f.geometry.coordinates[1];
		//console.log("("+lat+","+lng+")");
		setpoint(lat, lng);
	}
}

function dataErrorHandler() {
  console.log("error");
	var lat = "52.378153";
	var lng = "4.899364";
		setpoint(lat, lng);
}

function getDatasetUrl() {
	var setName = getCurrentDataset().name;
	var u
	if (useDummy) {
		url = setName+".json";
	} else {
    // url = "http://example.com/featureserver.cgi/"+setName+".json";
    url = "http://brws.in/featureserver/twitter";
	}
  // url = "mockup/data/getData.json.php";
  // url = "http://brws.in:8080/twitter";
  // url = "http://brws.in:8080/featureserver/twitter";
  // url = "mockup/data/getData.json";
	return url;
}

function getData(dataToSend) {
	var featureServerVars = {
    queryable: "ts",
		maxfeatures: maxfeatures
	}
	dataToSend = $.extend(dataToSend, featureServerVars);
	
	var ajaxSettings = {
		url: getDatasetUrl(),
		type: "get",
		data: dataToSend,
		dataType: "json",
		success: dataSuccesHandler,
		error: dataErrorHandler
	}
	$.ajax(ajaxSettings);
}

$(function(){
	
	// Slider
	var sliderOptions = {
		animate: true,
		min: startTimestamp,
		max: endTimestamp,
		step: 1200,
		slide: slideHandler,
		change: changeHandler
	}
	$('#slider').slider(sliderOptions).addTouch();
	

	
});
