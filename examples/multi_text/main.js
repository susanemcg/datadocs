/**
 * @author Susan McGregor
 */

$(document).ready(function(){

/* initialize data_doc object inside our jQuery $(document).ready function,
  specifying the id of the video, and the fullscreen div at minimum */

data_doc = DataDoc({"video_id": "datadocsvid", "fullscreen_id": "all_info", "embed_id":"embed_code"}, {"control_style":"css"});


/*	jQuery ajax get request for our "text_labels" JSON file 
	change the filename below to match your own json filename, if different */

$.get('assets/data/text_labels.json', addLabelData, 'json');

}, false);


function addLabelData(data){

/*	pass the specially-formatted JSON in our "text_labels.json" file, where 
   	we can specify any number of text items to add to our video, while still
   	individually controlling the font, size, alignment, and placement
 */

	data_doc.addOverlays("labels", data);	

}

function pop_message(event, params){
	alert(params.alert_msg);
}