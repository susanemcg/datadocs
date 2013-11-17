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
        text_el.style.fontFamily = theStyle.font;
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

    },

    /**
     * Retrieve geolocation data and store results. Should be called once,
     * preferably early, to get the position value and cache it. Necessary
     * to get any location information via getLocation.
     *
     * @param {boolean=} enableStringFormats [optional] Whether the resulting
     *     position object (latitude/longitude) should be reverse geolocated to
     *     enable getting things like zipcode, city, state, country, etc. If
     *     true, will make sure Google Maps API is loaded and then call
     *     reverseGeoLocate after position is retrieved to make the API call
     *     and cache the results.
     * @param {Object=} options [optional] object to customize the geolocation
     *     call. Parameters can be any of the PositionOptions values:
     *     developer.mozilla.org/en-US/docs/Web/API/PositionOptions
     * @param {Function=} onError [optional] function to be called if getting
     *     geo data fails for whatever reason.
     */
    enableGeolocation: function(enableStringFormats, options, onError) {
      // Do not update a position once it has been determined.
      // TODO(dbow): Maybe there is a use case for more than one call to get
      //     position? Right now this assumes you just need it once.
      if (this.position) {
        return;
      }

      // Make sure options is an object.
      options = (options === Object(options)) ? options : {};

      // TODO(dbow): Might be nice to handle a failure in browser-based
      //     geolocation somehow in a standard way. Right now you can
      //     pass an error handling function, but perhaps there should be
      //     some standardized error handlers. Like if you want to just
      //     stop the video and prevent playback. Or if you want to manually
      //     prompt the user for input. Or something else.
      onError = (typeof onError === 'function') ? onError : function () {};

      if ('geolocation' in navigator) {
        var geoOptions = {
          enableHighAccuracy: options.highAccuracy || false,
          timeout: options.timeout || 5000,
          maximumAge: options.maximumAge || 0
        };

        var self = this;

        function success(position) {
          // Store the position on the DataDoc.
          // Will be an object with latitude, longitude, and accuracy values.
          // (and maybe more but those are the only guaranteed ones).
          self.position = position.coords;

          // If enableStringFormats is true, load Google Maps API and reverse
          // geolocate the position coordinates.
          if (enableStringFormats) {
            self.loadGoogleMaps(self.reverseGeolocate);
          }
        }

        navigator.geolocation.getCurrentPosition(success, onError, geoOptions);

      } else {
        // Browser-based geolocation is not possible.
        onError();
      }
    },

    /**
     * Load the Google Maps API, if necessary, and then call the callback
     * function provided.
     *
     * @param {Function} callback to execute after Google Maps API loads.
     */
    loadGoogleMaps: function(callback) {
      // Ensure callback is a function.
      callback = (typeof callback === 'function') ? callback : function() {};

      // Google Maps API already present.
      if (window.google && window.google.maps && window.google.maps.Geocoder) {
        callback();

      // Need to load Google Maps API.
      } else {
        var self = this;

        // Create a function that will be called when the Google Maps API
        // loads. It will prevent multiple attempts to load the API, and
        // remove itself when completed. It will also call the initial callback
        // once the API is loaded.
        if (this.tempFunc_) {
          return;
        }
        // Create an obscure window variable to avoid naming collisions.
        this.tempFunc_ = '_tempCb' + new Date().getTime();
        window[this.tempFunc_] = function() {
          callback.apply(self);
          // Remove temporary callback.
          try {
            // Some browsers throw when deleting window properties.
            delete window[self.tempFunc_];
          } catch(e) {
            // In that case, just set it to undefined.
            window[self.tempFunc_] = undefined;
          }
        };

        // Load Google Maps API script with callback onload.
        var gmaps = document.createElement('script');
        gmaps.setAttribute('src',
            '//maps.googleapis.com/maps/api/js?v=3.exp' +
            '&sensor=false&callback=' + this.tempFunc_);
        document.body.appendChild(gmaps);
      }
    },

    /**
     * Issues a call to Google Maps API to reverse geolocate the latitude
     * and longitude stored on the DataDoc into zipcode, city, state, and
     * country values if possible and store results in formatCache.
     */
    reverseGeolocate: function() {
      // Can't do anything if we don't have position data.
      if (!this.position) {
        return;
      }

      // Map of format strings to google maps types.
      var formatMap = {
        'zipcode': 'postal_code',
        'city': 'locality',
        'state': 'administrative_area_level_1',
        'country': 'country'
      };

      // Make sure we have a cache of formats for this position.
      if (!this.formatCache) {
        this.formatCache = {};
      }

      // Wrapper to handle non-es5 browsers that lack Array.indexOf.
      // TODO(dbow): probably put this in a utils area for general use.
      function inArray(array, item) {
        if (typeof array.indexOf === 'function') {
          return array.indexOf(item) >= 0;
        }
        for (var i = 0, len = array.length; i < len; i++) {
          if (array[i] === item) {
            return true;
          }
        }
        return false;
      }

      // Calls to this function should be wrapped in loadGoogleMaps to ensure
      // the necessary files have been loaded. If they haven't, just exit.
      if (!google || !google.maps || !google.maps.Geocoder) {
        return;
      }

      // Initialize the Geocoder and Latitude/Longitude objects.
      var geocoder = new google.maps.Geocoder();
      var latlng = new google.maps.LatLng(this.position.latitude,
          this.position.longitude);
      var self = this;

      // Call a given function for each param in a given
      // object, and return whether the object is empty or not.
      // TODO(dbow): Could probably be more generally useful.
      function forEach(object, func) {
        var empty = true;
        for (var key in object) {
          if (object.hasOwnProperty(key)) {
            func(object[key], key);
            empty = false;
          }
        }
        return empty;
      }

      // Reverse geocode the latlng.
      geocoder.geocode({'latLng': latlng}, function(results, geocoderStatus) {
        var result;
        var components;
        var component;
        var empty = false;
        if (geocoderStatus === google.maps.GeocoderStatus.OK) {
          if (results.length) {
            // Iterate over results array.
            for (var i = 0, ilen = results.length; i < ilen; i++) {
              result = results[i];
              if (result && result.address_components) {
                components = result.address_components;
                // Iterate through address components of each result.
                for (var j = 0, jlen = components.length; j < jlen; j++) {
                  component = components[j];
                  // Use forEach to simultaneously cache any available formats
                  // and check if formatMap is empty yet so we can exit the
                  // loops early.
                  empty = forEach(formatMap, function(gmapsFormat, format) {
                    // If type matches an empty format value, cache it.
                    if (inArray(component.types, gmapsFormat)) {
                      // TODO(dbow): Right now this basically just uses the
                      //     first value it finds for each. There might be a
                      //     more accurate algorithm where you compare
                      //     frequency of each value appearing in multiple
                      //     addresses? Doubt that is essential at this point
                      //     though.
                      self.formatCache[format] = component.long_name;
                      delete formatMap[format];
                    }
                  });
                  // Break early if we have what we need.
                  if (empty) {
                    break;
                  }
                }
              }
              if (empty) {
                break;
              }
            }

          // TODO(dbow): Probably some better error handling.

          } else {
            // No results.
          }
        } else {
          // Geocoder failed.
        }
      });
    },

    /**
     * Retrieve location values in provided format.
     *
     * @param {string} format to return the location in. Can be 'zipcode',
     *     'city', 'state' or 'country'. Default (when not provided) is the
     *     position object, with lat and long.
     * @return {string|Object} The location string or object depending on what
     *     was available and requested.
     */
    getLocation: function(format) {
      // If enableGeolocation was not called, or it failed, can't get location.
      if (!this.position) {
        return '';
      }
      var result = this.position;
      if (format) {
        result = this.formatCache && this.formatCache[format] || '';
      }
      return result;
    }

  };//end prototype declaration


  //  Extend constructor prototype to instance prototype
  //  Allows chaining methods to instances
 DataDoc.dd.init.prototype = DataDoc.dd;

  //  Exposes DataDocs to global context
  global.DataDoc = DataDoc;

})(window, window.document);
