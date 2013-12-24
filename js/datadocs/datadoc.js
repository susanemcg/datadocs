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
      this.pauseBtnID = "#pause_button";
      this.overlay = document.getElementById("overlays");

      this["video"] = this.video; //expose the video property so it can be accessed by external scripts

      customcontrols(this["video"].video, {"fullscreen_container":fullscreen_container_id, "embed_container":embed_div});

      this["customcontrols"] = true;

      return this; 
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

    addOverlays : function(overlayType, jsonObj){

      if(overlayType == "labels"){
        //let's start by handling MVP text
        this.addFlexText(jsonObj.flex_text, this.overlay, this);
      }
      if(overlayType == "charts"){
        //and first generation Data Docs charts
        this.addChalkboardCharts(jsonObj.graph_list); 
      }

    },

    buildFlex : function(textString, theStyle){
      var text_el = document.createElement("div");
      text_el.style.position = "relative";
      text_el.style.display = "block"; 

      if(theStyle.font == "MVP_Hand"){
        text_el.appendChild(returnHandDrawn(textString, theStyle.size));
      }else{

        text_el.style.fontFamily = new String(theStyle.font);

        text_el.style.fontSize = theStyle.size+'px';
        text_el.innerHTML = textString;
      }

      return(text_el);
    },

    addFlexText : function(theJSON){

      //create the default "styles" - so far we want to support the "MVP_Hand" font, and webfonts
      var theFont = theJSON.stylesheet.fontFamily;

      var theSize = theJSON.stylesheet.fontSize;

      var numBlocks = theJSON.text_blocks;

      //get each text block in the list
      for(var i=0; i<numBlocks.length; i++){
        
        var blockData = numBlocks[i];

        //every block is a single parent div
        var blockDiv = document.createElement("div");
        blockDiv.id = numBlocks[i].divID ? numBlocks[i].divID : "flex_text_"+i;
        blockDiv.style.position = "absolute";
        blockDiv.style.top = numBlocks[i].top_left[0]+"px";
        blockDiv.style.left = numBlocks[i].top_left[1]+"px";

        //add block div to page
        this.overlay.appendChild(blockDiv);

        //call salt plugin
        this.addSalt({
          "start":numBlocks[i].start_end[0],
          "end":numBlocks[i].start_end[1],
          "target":blockDiv.id
        });

        var text_elems = blockData.text_list; 
        //get each element in the text block
        for(var j=0; j<text_elems.length; j++){

          //create the style object for this 
          var styleObj = {};
          styleObj.font = text_elems[j].fontFamily ? text_elems[j].fontFamily : theFont;
          styleObj.size = text_elems[j].fontSize ? text_elems[j].fontSize : theSize;

          blockDiv.appendChild(this.buildFlex(text_elems[j].text, styleObj));

        }

      }

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
