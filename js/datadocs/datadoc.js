(function(global, document) {


  //  Declare constructor
  //  Returns an instance object.
  function DataDoc(parameters, options) {

    //ok, so we're setting the new 
    return new DataDoc.dd.init( parameters.video_id, parameters.fullscreen_id, parameters.embed_id, options || null );

  };

  //  Declare a shortcut (DataDoc.dd) to and a definition of
  //  the new prototype for our DataDoc constructor
  DataDoc.dd = DataDoc.prototype = {

    init : function( entity, fullscreen_container_id, embed_div, options ) {

      this.video = Popcorn("#"+entity);
      
      var that = this;

      if(options.text_url){
        var styleObj = {"fontFamily": options.fontFamily, "fontSize":options.fontSize};
        $.get(options.text_url, function (data){
          that.addOverlays("labels", data, styleObj);
        }, 'json');
      }

      this.pauseBtnID = "#pause_button";
      this.overlay = document.getElementById("overlays");

      this["video"] = this.video; //expose the video property so it can be accessed by external scripts


      var hasCSS = null;
      this.awaitJSON = null;
      

      var included_frames = document.getElementsByTagName('iframe');
      this.numIFrames = included_frames.length;


      if(this.numIFrames > 0){
        for(var i=0; i<included_frames.length; i++){
          var aFrame = included_frames[i];
            $(aFrame).load(function(i){
              
              return function(){
              that.numIFrames--;
            }
            }(i));
        }
      }

      if(options){
        hasCSS = options.control_style;
        this.awaitJSON = options.data_url == undefined ? false : true;
      }

        
      if(this.awaitJSON == false){
        var readyTimer = setInterval(function(){
          if(that.video.readyState() == 4 && that.numIFrames == 0){
            document.getElementById("loader_gif").style.display = "none";
            clearInterval(readyTimer);
          }
        }, 100);
      }

      customcontrols(this["video"].video, {"fullscreen_container":fullscreen_container_id, "embed_container":embed_div, "control_style":hasCSS}, this);

      this["customcontrols"] = true;

      return this; 
    },

    runPlugin : function(plugin_name, params){
      this.video[plugin_name](params);

    },

    addSalt : function(jsonObj){
      var allSalt = jsonObj;
      if (!(jsonObj instanceof Array)){
        allSalt = new Array(jsonObj);
      }
      for(var p=0; p<allSalt.length; p++){
        this.video.salt(allSalt[p]);
      }
    },

    addCaramel : function(jsonObj){
      var allSugar = jsonObj;
      if (!(jsonObj instanceof Array)){
        allSugar = new Array(jsonObj);
      }
      for(var p=0; p<allSugar.length; p++){
        allSugar[p].pause_button_id = this.pauseBtnID;
        this.video.caramel(allSugar[p]);
      }
    },

    addOverlays : function(overlayType, jsonObj, theStyle){

      this.awaitJSON = "COMPLETE";
      if(this.video.readyState() == 4){
        document.getElementById("loader_gif").style.display = "none";
      }
      if(overlayType == "labels"){

        var json_data = jsonObj;
        //need to test what kind of json we have 
        if(jsonObj.kind){

        json_data = this.transformJSON(jsonObj, theStyle);

        }

        this.addFlexText(json_data.flex_text, this.overlay, this);
      }
      if(overlayType == "charts"){
        //and first generation Data Docs charts
        this.addChalkboardCharts(jsonObj.graph_list); 
      }

    },

    transformJSON : function(data, styles){

      var numRows = data.rows.length;

      var someJSON = {"flex_text": {}};
          someJSON.flex_text.stylesheet = styles;

      var textArray = [];

      for(var i=0; i<numRows; i++){
        var textObj = {};
            textObj.top_left = [Number(data.rows[i][1]), Number(data.rows[i][2])];
            textObj.start_end = [Number(data.rows[i][3]),Number(data.rows[i][4])];
            textObj.text_list = [{"text":data.rows[i][0]}];

            if(data.rows[i][5] != ""){
              textObj.text_list[0].fontSize = Number(data.rows[i][5]); 
            }

            if(data.rows[i][6] != ""){
              textObj.text_list[0].fontFamily = data.rows[i][6]; 
            }

            textArray.push(textObj);
      }

      someJSON.flex_text.text_blocks = textArray;
      return(someJSON);

    },

    buildFlex : function(textString, theStyle){
      var text_el = document.createElement("div");
      text_el.style.position = "relative";
      text_el.style.display = "block"; 

      if(theStyle.font == "MVP_Hand"){
        text_el.appendChild(returnHandDrawn(textString, theStyle.size));
      }else{

        text_el.style.fontFamily = new String(theStyle.font);
        text_el.style.textAlign = theStyle.align;
        text_el.style.fontSize = theStyle.size+'px';
        text_el.innerHTML = textString;
      }

      return(text_el);
    },

    addFlexText : function(theJSON){

      //create the default "styles" - so far we want to support the "MVP_Hand" font, and webfonts
      var theFont = theJSON.stylesheet.fontFamily;

      var theSize = theJSON.stylesheet.fontSize;

      var theAlign = theJSON.stylesheet.textAlign ? theJSON.stylesheet.textAlign : "left";

      var numBlocks = theJSON.text_blocks;

      //get each text block in the list
      for(var i=0; i<numBlocks.length; i++){
        
        var blockData = numBlocks[i];

        //every block is a single parent div
        var blockDiv = document.createElement("div");
        blockDiv.id = blockData.divID ? blockData.divID : "flex_text_"+i;
        blockDiv.style.position = "absolute";
        blockDiv.style.top = blockData.top_left[0]+"px";
        blockDiv.style.left = blockData.top_left[1]+"px";

        //add block div to page
        this.overlay.appendChild(blockDiv);

        this.addSalt({
          "start":blockData.start_end[0],
          "end":blockData.start_end[1],
          "target":blockDiv.id
        });

        var text_elems = blockData.text_list; 

        //get each element in the text block
        for(var j=0; j<text_elems.length; j++){

          var textBit = text_elems[j];

          //create the style object for this 
          var styleObj = {};

          styleObj.font = textBit.fontFamily ? textBit.fontFamily : theFont;
          styleObj.size = textBit.fontSize ? textBit.fontSize : theSize;
          styleObj.align = textBit.textAlign ? textBit.textAlign: theAlign;

          var lineDiv = this.buildFlex(textBit.text, styleObj);
          lineDiv.id = "dd_text_"+i+j;
          blockDiv.appendChild(lineDiv);


          //begin building object to pass to "addSalt" method
          var saltObj = {"start":blockData.start_end[0], "end":blockData.start_end[1],"target":lineDiv.id};

          if(textBit.reveal_timeout){
            saltObj.has_reveal = "true";
            saltObj.reveal_timeout = textBit.reveal_timeout;
          }

          this.addSalt(saltObj);

          //check for addCaramel parameters, and build object if present  
          if(textBit.url || textBit.function_name){
            var caramelObj = {"target":lineDiv.id};

            if(textBit.url){
              caramelObj.url = textBit.url;
            }

            if(textBit.function_name){
              caramelObj.function_name = textBit.function_name;
            }

            if(textBit.function_params){
              caramelObj.function_params = textBit.function_params;
            }

            this.addCaramel(caramelObj);

          }

          // STILL NEED TO ADD 'class' PARAMETER HANDLING

          if(textBit.class){
            lineDiv.classList.add(textBit.class);
          }



        }//end for [j]

      }//end for [i]

    },

    addChalkboardCharts : function(data){

      for (var p=0; p<data.chart_list.length; p++){

        var chartInfo = data.chart_list[p];

        var chartDiv = document.createElement("div");
        chartDiv.id = chartInfo.meta.divID ? chartInfo.meta.divID : "chart_"+p;
        chartDiv.style.position = 'absolute';
        chartDiv.style.width = Number(chartInfo.meta.width_height[0])+'px';
        chartDiv.style.height = Number(chartInfo.meta.width_height[1])+'px';
        chartDiv.style.top = Number(chartInfo.meta.top_left[0])+'px';
        chartDiv.style.left = Number(chartInfo.meta.top_left[0])+'px';        

        this.overlay.appendChild(chartDiv);

        //call salt plugin on each of these chart divs immediately; let data fill in later
        this.addSalt({
          start:Number(chartInfo.meta.start_end[0]),
          end:Number(chartInfo.meta.start_end[1]),
          target:chartDiv.id
        });

        //takes the metadata about the chart and the target div, and populates it with the appropriate chart!
        loadFREDChart(chartInfo.chart_info, chartDiv, 'gif');

      }

    }

  };//end prototype declaration


  //  Extend constructor prototype to instance prototype
  //  Allows chaining methods to instances
 DataDoc.dd.init.prototype = DataDoc.dd;

  //  Exposes DataDocs to global context
  global.DataDoc = DataDoc;

})(window, window.document);
