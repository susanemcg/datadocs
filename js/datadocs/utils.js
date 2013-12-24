//helper function for formatiing the time stamp
function formatTime(numSeconds){
  var minutes = Math.floor(Number(numSeconds)/60);
  var seconds = Math.round(Number(numSeconds)%60);
  var secMeasure = String(seconds); 
  if(seconds < 10){
    secMeasure = "0"+String(seconds);
  }
  return (String(minutes)+":"+secMeasure)
}// end formatTime

//helper function to extract number values from styles
function stripPx(pixArg){
 return ( Number((String(pixArg).split('px'))[0]) )
}

function monthNum(dateString){
	
	var dateArray = dateString.split("-");
	var monthNum = Number(dateArray[1])-1;
	
	return(monthNum);
	
}

function monthLetter(monthNum){
	var monthsArray = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
	return(monthsArray[monthNum])
}

function twoDigitYear(dateString){

	var dateArray = dateString.split("-");
	return(dateArray[0].substr(-2,2));
	
}

function makeSlashDate(dateString){
	var dateVals = String(dateString).split("-");
	return String(Number(dateVals[1]))+"/"+dateVals[0].substr(2,2);

}

function getParam( name ){
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )
      return "";
    else
      return results[1];
}

Array.max = function( array ){
return Math.max.apply( Math, array );
};

// Function to get the Min value in Array
Array.min = function( array ){
return Math.min.apply( Math, array );
};