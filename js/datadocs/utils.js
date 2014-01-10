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


//lifted from Stack Overflow because why reinvent the wheel:
//http://stackoverflow.com/questions/18286389/js-add-commas-to-a-string

function addCommas(nStr)
{
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    
    return(x1 + x2)
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