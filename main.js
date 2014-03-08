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
	    "fontFamily":"'PT Mono', sans-serif",
	    "fontSize": 40, 
	    "text_url": "https://www.googleapis.com/fusiontables/v1/query/?sql=SELECT+*+FROM+1qkVkd0TktLEEuUJjDZfPkbs0XTa_cC2XzUtqNoiS&key=AIzaSyAm9yWCV7JPCTHCJut8whOjARd7pwROFDQ"
	});

//assets/data/text_labels.json
}, false);
