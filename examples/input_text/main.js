/**
 * @author Susan McGregor
 */

$(document).ready(function(){

/* initialize data_doc object inside our jQuery $(document).ready function,
  specifying the id of the video, and the fullscreen div at minimum */

data_doc = DataDoc({"video_id": "datadocsvid", "fullscreen_id": "all_info", "embed_id":"embed_code"}, {"control_style":"css"});

/* the "addSalt" method specifies our target div's "id" parameter, as well 
	as the start and end time for its visibility, in seconds */

function show_time(){
document.getElementById("clock_time").innerHTML = moment().format("hh")+":"+moment().format("mm");
}

function get_name(){
var theName = document.getElementById("the_name").value;
if(theName == ""){
	theName = "Name?!"
}
document.getElementById("name_ex1").innerHTML = theName;
document.getElementById("name_ex2").innerHTML = theName;
document.getElementById("name_ex3").innerHTML = theName;
document.getElementById("name_ex4").innerHTML = theName;

}

data_doc.runPlugin("code", { start: 29, end: 30, onStart: show_time});

data_doc.runPlugin("code", { start: 25, end: 26, onStart: get_name});

data_doc.addSalt({
	start:31,
	end:35,
	target:"clock_time"
});


data_doc.addSalt({
	start:26,
	end:28,
	target:"name_ex1"
});
data_doc.addSalt({
	start:26,
	end:28,
	target:"name_ex2"
});
data_doc.addSalt({
	start:26,
	end:28,
	target:"name_ex3"
});
data_doc.addSalt({
	start:26,
	end:28,
	target:"name_ex4"
});

data_doc.addSalt({
	start:1,
	end:3,
	target:"name_input"
});

data_doc.addSalt({
	start:17,
	end:18,
	target:"repo_link"
});

data_doc.addSalt({
	start:39,
	end:50,
	target:"sample_chart"
});

data_doc.addSalt({
	start:93,
	end:104,
	target:"repo_link2"
});

data_doc.addSalt({
	start:95,
	end:104,
	target:"mailto_link"
});


data_doc.addCaramel({
	url:"http://www.github.com/datadocs/datadocs/wiki",
	target:"repo_link"
});

data_doc.addCaramel({
	url:"http://www.github.com/datadocs/datadocs/wiki",
	target:"repo_link2"
});

data_doc.addCaramel({
	url:"mailto:datadocs@gmail.com",
	target:"mailto_link"
});


}, false);

