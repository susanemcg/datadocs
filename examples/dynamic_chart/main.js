/**
 * @author Susan McGregor
 */

$(document).ready(function(){

/* initialize data_doc object inside our jQuery $(document).ready function,
  specifying the id of the video, and the fullscreen div at minimum */

data_doc = DataDoc({"video_id": "datadocsvid", "fullscreen_id": "all_info", "embed_id":"embed_code"}, {"control_style":"css"});

/*
	referenced JSON file is result of the following API call:
	http://api.stlouisfed.org/fred/series/observations?series_id=IC4WSA&api_key=XXXXX&limit=5&output_type=3&sort_order=desc&realtime_start=2013-12-01&realtime_end=2014-01-03&file_type=json

*/


//the "addSalt" method requires that the div exist on the page, but there's no problem with it
//being empty to start. We'll populate it with data once it arrives.

/*
	NOTE: at the moment there is no error handling to ensure that the data is loaded by the time
	the video reaches the timestamp specified in addSalt.

*/
data_doc.addSalt({
	start:5,
	end:15,
	target:"u3Chart"
});

data_doc.addSalt({
	start:15,
	end:27,
	target:"u6Chart"
});


//first, we need to load the Google "corechart" package, which actually build the chart 
google.load("visualization", "1", {packages:["corechart"], "callback":loadChartData});


}, false);


function loadChartData(theData){

//loads result of: http://api.stlouisfed.org/fred/series/observations?series_id=UNRATE&observation_start=2007-01-01&frequency=q&api_key=XXXXXX&file_type=json

$.get('assets/data/U3Data.json', buildU3Chart, 'json');

//loads result of: http://api.stlouisfed.org/fred/series/observations?series_id=U^RATE&observation_start=2007-01-01&frequency=q&api_key=XXXXXX&file_type=json

$.get('assets/data/U6Data.json', buildU6Chart, 'json');

}


function buildU3Chart(U3Data){
	
	
	var U3Table = new google.visualization.DataTable();
	U3Table.addColumn('string','Month');
	U3Table.addColumn('number','U3 Unemployment');

	var rowData = U3Data.observations;
	

	
	//this is the number of readings
	var numReadings = rowData.length;
	
	var dataArray = [];

	for (var i=0; i<numReadings; i++){
		
		//DataTable expects an array of arrays

		var theRowData = [makeSlashDate(rowData[i].date), Number(rowData[i].value)];
		
		dataArray.push(theRowData);
				
	} //end of for loop
	
	
	U3Table.addRows(dataArray);
	
	var options = {
          title: "U3 Rate: Official Unemployment",
          width: 800,
          height: 400,
          legend: {position:'none'},
          vAxis: {title: 'Unemployment %', minValue: 0, textStyle: {color:'#FFFFFF'}, titleTextStyle: {color: '#FFFFFF'}},
          backgroundColor: {stroke: '#FFFFFF', strokeWidth: 0, fill:'#000000'},
          fontSize: 14,
          colors: ['#FFFFFF'],
          fontName: 'PT Mono',
          titleTextStyle: {color: '#FFFFFF'},
          hAxis: {format:'MMM d, y', showTextEvery:4, slantedText:true, titleTextStyle: {color: '#FFFFFF'}, textStyle: {color:'#FFFFFF'}}
        };

	//create bar chart framework, and put it in the div with the id "u3Chart"
	var chart = new google.visualization.LineChart(document.getElementById("u3Chart")); 
    //draw the line chart, based on the dataTable and options that we've created
    chart.draw(U3Table, options);

	
}


function buildU6Chart(U6Data){
	
	
	var U6Table = new google.visualization.DataTable();
	U6Table.addColumn('string','Month');
	U6Table.addColumn('number','U6 Unemployment');

	var rowData = U6Data.observations;
	

	
	//this is the number of readings
	var numReadings = rowData.length;
	
	var dataArray = [];

	for (var i=0; i<numReadings; i++){
		
		//DataTable expects an array of arrays

		var theRowData = [makeSlashDate(rowData[i].date), Number(rowData[i].value)];
		
		dataArray.push(theRowData);
				
	} //end of for loop
	
	
	U6Table.addRows(dataArray);
	
	var options = {
          title: 'U6 Rate: Unemployed and Underemployed',
          width: 800,
          height: 400,
          legend: {position:'none'},
          vAxis: {title: 'Unemployment %', minValue: 0, textStyle: {color:'#FFFFFF'}, titleTextStyle: {color: '#FFFFFF'}},
          backgroundColor: {stroke: '#FFFFFF', strokeWidth: 0, fill:'#000000'},
          fontSize: 14,
          colors: ['#FFFFFF'],
          fontName: 'PT Mono',
          titleTextStyle: {color: '#FFFFFF'},
          hAxis: {format:'MMM d, y', showTextEvery:4, slantedText:true, titleTextStyle: {color: '#FFFFFF'}, textStyle: {color:'#FFFFFF'}}
        };

	//create bar chart framework, and put it in the div with the id "u6Chart"
	var chart = new google.visualization.LineChart(document.getElementById("u6Chart")); 
       //draw the line chart, based on the dataTable and options that we've created
        chart.draw(U6Table, options);

	
}

