/**
 * @author Susan McGregor
 */


function show_info(e){
	var the_div = $(e.target).parent().find('#the_info');
	$(the_div).css({'display':'block'});
}

$(document).ready(function(){

data_doc = DataDoc({"video_id": "datadocsvid", "fullscreen_id": "all_info", "embed_id":"embed_code"});

data_doc.enableGeolocation(true);

//adding a few "manual" overlays - our "Learn More" buttons

var moreContainer = $('<div>').attr({'id':'chart0_info','class':'rightColumn'});
var learnMore1 = $('<div>').attr({'class':'moreButton'});
var learnMoreInfo = $('<div>').attr({'id':'the_info'});
	$(learnMoreInfo).append(returnHandDrawn("U3 measures all the people who are looking for work and don't have a job, but not those who have stopped looking.", 20));
	$(learnMoreInfo).css({'display':'none'});

$(moreContainer).append(learnMore1, learnMoreInfo);
$('#overlays').append(moreContainer);

data_doc.addSalt({
	start:142,
	end:150,
	target:"chart0_info"
});	

data_doc.addCaramel({
	target:"chart0_info",
	function_name:"show_info"
})


var moreContainer2 = $('<div>').attr({'id':'chart1_info','class':'rightColumn'});
var learnMore2 = $('<div>').attr({'class':'moreButton'});
var learnMoreInfo2 = $('<div>').attr({'id':'the_info'});
	$(learnMoreInfo2).append(returnHandDrawn("U6 measures all the people who are looking for work and do not have a job, plus those who stopped looking for work in the past 4 weeks, and people in part time jobs who want full time jobs.", 20));
	$(learnMoreInfo2).css({'display':'none'});

$(moreContainer2).append(learnMore2, learnMoreInfo2);
$('#overlays').append(moreContainer2);

data_doc.addSalt({
	start:150,
	end:164,
	target:"chart1_info"
});	

data_doc.addCaramel({
	target:"chart1_info",
	function_name:"show_info"
});


//now, load json file with title info
$.get('text_labels.json', addLabelData, 'json');
$.get('DataDoc_FRED_data.json', addFREDData, 'json');

}, false);  //end document ready




function addLabelData(data){

	data_doc.addOverlays("labels", data);	

}

function addFREDData(data){
	
	data_doc.addOverlays("charts", data);

}

function buildThisChart(chartInfo, chartData){
	
	
			if(chartInfo.chartType == "lineChart"){
			
				buildLineChart(chartInfo, chartData);
			}
			if(chartInfo.chartType == "circleChart"){

				buildCircleChart(chartInfo, chartData);
			}
					

}

