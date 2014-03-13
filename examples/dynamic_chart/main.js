/**
 * @author Susan McGregor
 */

$(document).ready(function(){

/* initialize data_doc object inside our jQuery $(document).ready function,
  specifying the id of the video, and the fullscreen div at minimum */

data_doc = DataDoc({"video_id": "datadocsvid", "fullscreen_id": "all_info", "embed_id":"embed_code"}, {"control_style":"css"});



//the "addSalt" method requires that the div exist on the page, but there's no problem with it
//being empty to start. We'll populate it with data once it arrives.

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

/*
	NOTE: at the moment there is no error handling to ensure that the data is loaded by the time
	the video reaches the timestamp specified in addSalt.

*/



}, false);

