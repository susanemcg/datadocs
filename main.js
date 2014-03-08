/**
 * @author Susan McGregor
 */

$(document).ready(function(){

/* initialize data_doc object inside our jQuery $(document).ready function,
  specifying the id of the video, and the fullscreen div at minimum */

data_doc = DataDoc({
	    "video_id": "datadocsvid",
	    "fullscreen_id": "all_info",
	    "embed_id": "embed_code"
	},
	{
	    "control_style": "css",
	    "data_url": "assets/data/text_labels.json"
	});


}, false);
