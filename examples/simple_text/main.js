/**
 * @author Susan McGregor
 */

$(document).ready(function(){

/* initialize data_doc object inside our jQuery $(document).ready function,
  specifying the id of the video, and the fullscreen div at minimum */

data_doc = DataDoc({"video_id": "datadocsvid", "fullscreen_id": "all_info", "embed_id":"embed_code"}, {"control_style":"css"});

/* the "addSalt" method specifies our target div's "id" parameter, as well 
	as the start and end time for its visibility, in seconds */

data_doc.addSalt({
	start:11,
	end:16,
	target:"dateline"
});

data_doc.addSalt({
	start:11,
	end:16,
	target:"jobs_num"
});

data_doc.addSalt({
	start:11,
	end:16,
	target:"unemp_pct"
});


}, false);