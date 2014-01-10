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


//in this example, we build the div that will hold our API results using javascript, and append it to the 
//overlays div. This could also be hard-coded into the HTML, or we could use jQuery.
var weeklyUnempHolder = document.createElement("div");
weeklyUnempHolder.id = "weeklyReadings";

var the_overlays = document.getElementById("overlays");
the_overlays.appendChild(weeklyUnempHolder);



//the "addSalt" method requires that the div exist on the page, but there's no problem with it
//being empty to start. We'll populate it with data once it arrives.

/*
	NOTE: at the moment there is no error handling to ensure that the data is loaded by the time
	the video reaches the timestamp specified in addSalt.

*/
data_doc.addSalt({
	start:8,
	end:30,
	target:"weeklyReadings"
});


//load the JSON, and pass it to the custom "addFREDData" method once it's returned

$.get('assets/data/IC4WSA.json', addFREDData, 'json');

}, false);


function addFREDData(data){

/*
	Once the data has been returned, we write whatever function we like to parse it into the format we want.
	In this case, the code below will look through the results for an entry that has more than one reading,
	and then add this info to the contents of our target div (which we have taken from the above). 

*/

var claimsList = data.observations;

for (var i=0; i<claimsList.length; i++){
	
	if(Object.keys(claimsList[i]).length > 2){
		//if we have more than 1 reading (aka, date + two or more = length > 2)
		
		//grab the object
		var mostRecentRevised = claimsList[i];

		//create a div element to add these to
		var readingsHolder = document.getElementById("weeklyReadings");
		//readingsHolder.innerHTML = "Initial Weekly Jobless Claims for";		

		//create an array to hold the values
		var valuesArray = [];


		for (var key in mostRecentRevised){

			if(key == "date"){
				var dateDiv = document.createElement("div");
				dateDiv.innerHTML = "Initial Weekly Jobless Claims for "+makeSlashDate(mostRecentRevised[key])+"/"+twoDigitYear(mostRecentRevised[key]);
				readingsHolder.appendChild(dateDiv);
			}else{
				//each reading has a unique key, so this is all we need to save
				valuesArray.push(key);
			}

		}

		//now that we have an array of values, reverse them (most recent value is always last)
		valuesArray.reverse();

		for (var j=0; j<valuesArray.length; j++){
			
			var readingsDiv = document.createElement("div");

			var valueString = "";
			//now the first one will be current
			if(j==0){
				valueString = "Current estimate: ";
			}else if (j==1){
				valueString = "Original estimate: ";

			}

			valueString += addCommas(mostRecentRevised[valuesArray[j]]);

			readingsDiv.innerHTML = valueString;
			readingsHolder.appendChild(readingsDiv);

		}
		
		break;
	}


}


}