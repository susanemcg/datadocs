function customcontrols(entity, options, data_doc_instance) {
  var thevideo = entity;

  var options = options || {}; // if options were passed, use those; otherwise, make empty so tests don't throw errors

  var controls_div = options.controls_div ? document.getElementById(options.controls_div) : document.getElementById("custom_controls");
  var fs_div = options.fullscreen_container ? document.getElementById(options.fullscreen_container) : null;
  var control_style = options.control_style ? options.control_style : null;
  var embed_div = options.embed_container ? document.getElementById(options.embed_container) : null;
  var controlsArray = ["play_pause"]; //running list of which buttons/controls the plugin should generate
  var scalingElements = [];
  var embedFactor = 1;
  var videoRatio;
  var fsRatio;
  var controls_top;



  if(fs_div){ //required for fullscreen functionality

    if(window.screenfull && window.screenfull.enabled) { //screenfull.js is a dependency. Test for presence of screenfull variable.
      options.screenfull = window.screenfull;

      // gather all immediate children of our user-supplied fullscreen div
      elementsToScale = Array.prototype.slice.call(fs_div.childNodes);
      elementsToScale.push(fs_div);

      //incorrect dependency here - shouldn't need fullscreen to calculate default embed code
      var fs_CSS = fs_div.currentStyle || getComputedStyle(fs_div,null);

      videoRatio = [stripPx(fs_CSS.width), stripPx(fs_CSS.height)];

      //calculating proportion of controls height to overall video, to generate top positioning
      var controls_CSS = controls_div.currentStyle || getComputedStyle(controls_div,null);
      controls_top = Math.round((stripPx(controls_CSS.height)/stripPx(fs_CSS.height))*100);

      if(window != window.parent){

          embedFactor = window.innerWidth / stripPx(fs_CSS.width);
          
          //once we've determined what it should be, we have to adjust the
          //fs_div to match it

          fs_div.style.width = window.innerWidth+"px";
          fs_div.style.height = window.innerHeight+"px";

      }



      //for each child node, we need to keep track of: a) the element, b) original width and c) original height
      for (i=0; i<elementsToScale.length; i++){

        //make sure that we're not trying to scale the text or comment nodes that may be inside the fullscreen div
        if(elementsToScale[i].nodeName != "#text" && elementsToScale[i].nodeName != "#comment"){
          elemCSS = elementsToScale[i].currentStyle || getComputedStyle(elementsToScale[i],null);

          //fullscreen means appropriately scaling non-video; here, calculate transform and create new style on the document
          
          /*
          * implicit here is that the fullscreen div & the video will have the same proportions
          */

          if(elementsToScale[i] === fs_div){

            // create transform class to apply to non-video elements
            var scale_style = document.createElement('style');
            scale_style.type = 'text/css';

            //transform proportion determined by screen width vs. fullscreen element width
            fsRatio = screen.width/stripPx(elemCSS.width)*embedFactor;
            //console.log("calculating fullscreen factor, elemCSS = "+ elemCSS.width);
            var scaleString = "scale("+fsRatio+","+fsRatio+")";

            scale_style.innerHTML = ".fs_scale { -webkit-transform:"+scaleString+"; -webkit-transform-origin: 0% 0%; -moz-transform:"+scaleString+"; -moz-transform-origin: 0% 0%; -ms-transform: "+scaleString+"; -ms-transform-origin: 0% 0%; -o-transform:"+scaleString+"; -o-transform-origin: 0% 0%; transform:"+scaleString+"; transform-origin: 0% 0%;}";
            document.getElementsByTagName('head')[0].appendChild(scale_style);

            if(embedFactor != 1){
              //this means that we need to scale everything down, so that when we're at "normal" size we're actually
              //at the embed scale size

              var embed_style = document.createElement('style');
              embed_style.type = 'text/css';

              var embedScale = "scale("+embedFactor+","+embedFactor+")";

              embed_style.innerHTML = ".embed_scale { -webkit-transform:"+embedScale+"; -webkit-transform-origin: 0% 0%; -moz-transform:"+embedScale+"; -moz-transform-origin: 0% 0%; -ms-transform: "+embedScale+"; -ms-transform-origin: 0% 0%; -o-transform:"+embedScale+"; -o-transform-origin: 0% 0%; transform:"+embedScale+"; transform-origin: 0% 0%;}";
              document.getElementsByTagName('head')[0].appendChild(embed_style);
            }


          }

          scalingElements.push({"elem":elementsToScale[i], "width":elemCSS.width, "height":elemCSS.height});
        }
      }
      //add flag to show fullscreen button
      controlsArray.push("fullscreen");
    }else{
      //error message flagging missing dependency
      console.log("Please include screenFull.js to enable fullscreen functionality.");
    }

  }else{
    console.log("Cannot locate specified fullscreen container div.");

    //if fullscreen container cannot be located, hide the fullscreen button div
    if(document.getElementById("fullscreen_button")){
      document.getElementById("fullscreen_button").style.display = "none";
    }

  }//end fullscreen_container conditional


  if(embed_div){ 
    // add flag to show embed button
    controlsArray.push("embed");
    drawEmbedInterface(embed_div, videoRatio);
  }else{

    //if embed container cannot be located, hide the fullscreen button div
    if(document.getElementById("embed_button")){
      document.getElementById("embed_button").style.display = "none";
    }
    if(document.getElementById("embed_code")){
     document.getElementById("embed_code").style.display = "none"; 
    }

  }//end embed_container conditional
  
  // need error handling for below
  var scrubber = controls_div.querySelector("#scrubber");
  var progressBar = controls_div.querySelector( "#progress" );
  var timediv = controls_div.querySelector( "#time_text" );
  var controlsFlag = true;

  for(var i=0; i<controlsArray.length; i++){
    var controlButton = controls_div.querySelector("#"+controlsArray[i]+"_button");
    if(!controlButton){
      console.log("Required div "+controlsArray[i]+"_button not found.");
      controlsFlag = false;
    }else{
      if(i == 0){ //element 0 is always "play_pause"
        var playbtn = document.createElement("div");
        playbtn.id = "play_button";

        var pausebtn = document.createElement("div");
        pausebtn.id = "pause_button";

        if(control_style == "css"){
          playbtn.className = "play_btn";
          pausebtn.className = "pause_btn";

          var playArrow = document.createElement("div");
          playArrow.className = "arrow-right";
          playbtn.appendChild(playArrow);

          var pauseBox = document.createElement("div");
          pauseBox.className = "pauseDash";
          pausebtn.appendChild(pauseBox);


        }else{
          var playimg = document.createElement("img");
          playimg.src = "assets/controls/play.png";
          playbtn.appendChild(playimg);

          var pauseimg = document.createElement("img");
          pauseimg.src = "assets/controls/pause.png";
          pausebtn.appendChild(pauseimg);
        }

        controlButton.appendChild(playbtn);
        controlButton.appendChild(pausebtn);

        //click handler for play button
        playbtn.addEventListener("click", function(){

          if(data_doc_instance.video.readyState() == 4  && (data_doc_instance.awaitJSON == false || data_doc_instance.awaitJSON == "COMPLETE") && data_doc_instance.numIFrames == 0){
            
            document.getElementById("loader_gif").style.display = "none";
            thevideo.play();
            this.style.display = "none";
            pausebtn.style.display = "block";
        }
        });

        //click handler for pause button
        pausebtn.addEventListener("click", function(){
          thevideo.pause();
          this.style.display = "none";
          playbtn.style.display = "block";
        }); 

        pausebtn.style.display = "none"; //we assume autoplay = false

      } //end play_pause
      if(controlsArray[i] == "fullscreen"){

        if(control_style == "css"){
          //need to create 4 little divs to make "corners" indicating fullscreen
          for(var j=0; j<4; j++){
            var cornerDiv = document.createElement("div");
            cornerDiv.className = "cornerStyle"+j;
            controlButton.appendChild(cornerDiv);
          }

        
        }else{
          var btnimg = document.createElement("img");
          btnimg.src = "assets/controls/"+controlsArray[i]+".png"; 
          controlButton.appendChild(btnimg);
        }
        

        //add click handler for fullscreen button
        controlButton.addEventListener("click", function() {
          
          options.screenfull.toggle(fs_div);
          fs_div.style.width = "100%";
          fs_div.style.height = "100%";

          for (var j=0; j<scalingElements.length; j++){
            //going through all elements that need to be scaled and setting height & width to 100% *except* for controls
            var elem = scalingElements[j].elem;
            if(elem === controls_div){ //in case of controls div, only adjust width & top position

              //ok, so what if i *do* scale the controls.

              controls_div.style.width = "100%";
              controls_div.style.top = -(stripPx(scalingElements[j].height)*fsRatio*(controls_top/10))+"px";
              controls_div.style.height = (stripPx(scalingElements[j].height)*fsRatio*(controls_top-1)/10)+"px";

            }else{
              //this else clause should handle the video and the overlays div
              scalingElements[j].elem.style.width = "100%";
              scalingElements[j].elem.style.height = "100%";

              //if our element isn't the video, then transform it (so that contained elements, like text, also scale)
              if(scalingElements[j].elem.nodeName != "VIDEO" && scalingElements[j].elem != fs_div){
                scalingElements[j].elem.className = "fs_scale";
              }
            }
          }// end scaling elements loop

        });//end fullscreen click handler

        //add change handler for screenfull element
        screenfull.onchange = function(e){


          if (!options.screenfull.isFullscreen){

            for (var j=0; j<scalingElements.length; j++){
              //going through all elements that need to be scaled and returning height & width to original *except* for controls
              var elem = scalingElements[j].elem;
              if(elem === controls_div){ //in case of controls div, only adjust width & top position

                controls_div.style.width = scalingElements[j].width;
                controls_div.style.height = scalingElements[j].height;

                //this is the case when 
                controls_div.style.top = "-"+controls_top+"%";
              }else{
                //this else clause should handle the video and the overlays div
                scalingElements[j].elem.style.width = scalingElements[j].width;
                scalingElements[j].elem.style.height = scalingElements[j].height;
                //if our element isn't the video, then remove scalar transform
                if(scalingElements[j].elem.nodeName != "VIDEO" && scalingElements[j].elem != fs_div){

                  //IF there is an embed scale, apply that style
                  if(embedFactor != 1){
                    scalingElements[j].elem.className = "embed_scale";
                  }else{
                    scalingElements[j].elem.className = "";
                  }

                }
              }
            }// end scaling elements loop
          }// endif
        }; //end screenfull onchange handler              

        //initialize screenfull
        options.screenfull.onchange();

      } //end fullscreen


      if(controlsArray[i] == "embed"){

        if(control_style == "css"){
          controlButton.firstChild.innerHTML = "SHARE";
        }else{
          var btnimg = document.createElement("img");
          btnimg.src = "assets/controls/"+controlsArray[i]+".png";  
          controlButton.appendChild(btnimg); 
        }
        
        
        
        //add click handler to embed button
        controlButton.addEventListener('click', function(){
          embed_div.style.display = embed_div.style.display != 'none' ? 'none' : '';
        });

        //do not show embed code by default
        embed_div.style.display = "none";

      } //end embed code

    }
  }

  if(controlsArray.length == 1){ //e.g. neither fullscreen nor embed button are present
    scrubber.style.width = "68%";
  }else if (controlsArray.length == 2){ //e.g. either fullscreen or embed is present
    scrubber.style.width = "59%";
  }

  //if all necessary divs are present, full steam ahead!
  if (controls_div && scrubber && progressBar && timediv && controlsFlag){
  
    var totalTime; // because this.duration changes as the video progresses, keep a reference to the total length of the video

    //the "timeUpdate" function, which updates the numerical display of where we are in the video
    thevideo.addEventListener("timeupdate", function(e){

      if(isNaN(totalTime)){
        totalTime = this.duration;
      }

      timediv.innerHTML = formatTime(this.currentTime)+"/"+formatTime(totalTime);
      progressBar.style.width = ((this.currentTime / totalTime) * 100) + "%";
    }); //end timeupdate handler

    // the metadata of the video, which includes the total duration, loads earliest
    thevideo.addEventListener("loadedmetadata", function (e) {
      totalTime = this.duration;

      if(isNaN(totalTime)){

        timediv.innerHTML = "0:00/?:??";

      } else {
        timediv.innerHTML = "0:00/"+formatTime(totalTime);
      }
    }); //end loadedmetadata handler

    //add hand cursor to scrub bar
    scrubber.style.cursor = "pointer";

    //the scrubber handler, which allows the user to click the scrub bar jump to certain points in the video
    scrubber.addEventListener("mousedown", function(e){

      //the scope of "this" in this function is the scrubber div
      var rect = this.getBoundingClientRect();
      var percent = Math.round(((e.clientX - rect.left) / rect.width)*100);

      //update the width of the progress bar accordingly
      progressBar.style.width = percent + "%"; 
    
      //update the timestamp on the video
      thevideo.currentTime = (percent/100) * totalTime;
    }); // end scrubber mousedown handler

  } //end sufficiency if      

}// end customcontrols function


function drawEmbedInterface(targetDiv, originalSize){


  //possible approach for "copy to clipboard" - non-trivial without Flash at this point
  //http://stackoverflow.com/questions/17527870/how-does-trello-access-the-users-clipboard

  //have to add a whole lotta stuff here to support our embed features. let's get going
  var defaultSize = [String(originalSize[0])+" x "+String(originalSize[1])]; 
  var sizesDisplay = defaultSize.concat(["560 x 315", "640 x 360", "853 x 480", "1280 x 720"]);
  var dimensionsList = [[originalSize[0], originalSize[1]], [560, 315], [640, 360], [853, 480], [1280, 720]];

  var optionsHolder = document.createElement("div");
  optionsHolder.className = "sizeList";

  var arrowButton = document.createElement("div");
  arrowButton.className = "arrow-down";

  var arrowHolder = document.createElement("div");
  arrowHolder.className = "outline-box";

  arrowHolder.appendChild(arrowButton);
  arrowHolder.addEventListener("click", function(){
    var theOptions = optionsHolder.children;

    for(var l=2; l<5; l++){

      console.log("what?")
      theOptions[l].className = "embedOption optionFade";

    }  
  });
  var iFrameArray = ["&lt;iframe width=&quot;", "&quot; height=&quot;", "&quot; src=&quot;", "&quot; frameborder=&quot;0&quot; allowfullScreen&gt;&lt;/iframe&gt;"];
  var theURL = window.location;

  var theCodeHolder = document.createElement("div");
  theCodeHolder.className = "codeHolder";


  for(var k=0; k<5; k++){
    var theOption = document.createElement("div");
    theOption.className = "embedOption";
    theOption.innerHTML = sizesDisplay[k];
    theOption.addEventListener("click", function(m){
      return function(){
      

      theCodeHolder.innerHTML = iFrameArray[0]+dimensionsList[m][0]+iFrameArray[1]+dimensionsList[m][1]+iFrameArray[2]+theURL+iFrameArray[3];
        var theOptions = optionsHolder.children;

          for(var l=2; l<5; l++){

            //theOptions[l].className = "embedOption";
            //theOptions[l].style.display = "none";

          }

        }
      }(k));

    optionsHolder.appendChild(theOption);
    if(k==0){
      var event = document.createEvent("MouseEvents");
      event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      theOption.dispatchEvent(event);
      optionsHolder.appendChild(arrowHolder);
    }else{
      theOption.className += " noOp";
    }
    
  }

  //create close button
  var theClose = document.createElement("div");
  theClose.id = "embedClose";
  targetDiv.appendChild(theClose);

  theClose.addEventListener("click", function(){
    targetDiv.style.display = targetDiv.style.display != 'none' ? 'none' : '';
  });

  targetDiv.appendChild(optionsHolder);
  targetDiv.appendChild(theCodeHolder);


}
