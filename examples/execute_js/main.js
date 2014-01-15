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
	start:5,
	end:11,
	target:"title_text"
});

data_doc.addSalt({
	start:7,
	end:11,
	target:"budget_text"
});

data_doc.addSalt({
	start:7,
	end:11,
	target:"policy_text"
});

data_doc.addSalt({
	start:7,
	end:11,
	target:"politics_text"
});


data_doc.addCaramel({
	url:"http://www.knightfoundation.org/grants/201346319/",
	target:"budget_text"
});

/*
	To execute an arbitrary JavaScript function, pass the "function_name" and, if desired, "function_params"
	arguments to the "addCaramel" function stedda "url". The mouse event will be passed to the specified 
	function by default. A second object containing all of the additiona parameters will be passed if
	provided. 
*/


data_doc.addCaramel({
	function_name:"policyClickHandler",
	function_params: {"target_id":"external_content", "text":"Success! You've clicked the policy button."},
	target:"policy_text"
});

data_doc.addCaramel({
	url:"http://www.washingtonpost.com/blogs/wonkblog/wp/2013/08/26/this-awesome-video-explains-how-to-read-the-jobs-data/",
	target:"politics_text"
});


}, false);


function policyClickHandler(clickEvent, paramsObject){

	//we don't explicitly use the clickEvent, but it is available

	var divToUpdate = document.getElementById(paramsObject.target_id);
	divToUpdate.innerHTML = paramsObject.text;


}
