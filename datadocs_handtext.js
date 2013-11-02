function renderHandDrawn(textToRender, divName, textSize){
	var holderDiv = document.getElementById(divName);
	while(holderDiv.firstChild){
		holderDiv.removeChild(holderDiv.firstChild);
	}
	holderDiv.appendChild(returnHandDrawn(textToRender, textSize));	
}

function returnHandDrawn(textToRender, textSize){
	var specialChars = {'!':'EM','\"':'openQuote', '?':'QM','&': 'amper', '*': 'astrisk','@': 'at', ':': 'colon',',':'comma','$':'dollar','%':'percent','.':'period','#':'pound', ' ':'space', '(':'openParen', ')':'closeParen','-':'dash','/':'slash'};
	var theDiv = document.createElement("div");
	theDiv.style.textAlign = "left";
	//split the text on spaces, and then compile each word as its own div
	var wordsArray = String(textToRender).split(" ");
	
	for (var j=0; j<wordsArray.length; j++){
		var wordDiv = document.createElement("div");
		wordDiv.style.display = "inline-block";
		wordDiv.style.position = "relative";
		var theWord = wordsArray[j];
		var wordLength = theWord.length;
		
		for (var i=0; i<wordLength; i++){
			var imageRoot = 'assets/tradeGothicHandGif/';
			var theChar = theWord.charAt(i);
			if(checkLower(theChar)){
				imageRoot = 'assets/tradeGothicLower/';
			}
			if(String(theChar) in specialChars){
				theChar = specialChars[String(theChar)];
				imageRoot = 'assets/tradeGothicHandGif/';
			}
			var charImg = document.createElement("img");
			charImg.src = imageRoot+theChar+'.gif';
			charImg.height = textSize;
			wordDiv.appendChild(charImg);
		}
	var aBlank = document.createElement("img");
	aBlank.src = 'assets/tradeGothicHandGif/space.gif';
	aBlank.height = textSize;
	if(wordsArray[1] != ""){
		wordDiv.appendChild(aBlank); //replace the spaces we lost on split
	}	
 	theDiv.appendChild(wordDiv);
 
	}
	theDiv.className = "handText";
	return(theDiv);
	
}

function checkLower(aChar){
      myCharCode = aChar.charCodeAt(0);
   
      if((myCharCode > 96) && (myCharCode < 123))
      {
         return true;
      }
   
      return false;
}