(function (Popcorn) {
      
   /* Salt Popcorn plugin - as simple and essential as salt
    *
    * Adds the ability to show and hide arbitrary divs according to video timing.
    *
    * @param {Object} options
    *
    * Required parameters: start, end, target.
    *
    * start: the time in seconds when the div should be made visible
    * end: the time in seconds when the visible div should be made invisible
    * target: Is the ID of the element where whose visibility will be toggled. Display style is maintained.
    *
    * Optional parameters
    *
    *   has_reveal: "true" setting causes children elements to be progressively revealed 
    *   reveal_timeout: time (in milliseconds) to delay between revealing elements. Default 100.
    *
    * Thanks to @Matt Lindeboom - github/mmlindeboom for the core approach to the progressive reveal option
    *
    * Example:
    *
    *   var p = Popcorn('#video')
    *
    *   // Simple salt
    *   .salt({
    *     start: 5, // seconds
    *     end: 15, // seconds
    *     target: 'textdiv' //id of div to show/hide
    *   })
    *
    */  
  
  Popcorn.plugin( "salt" , {
    manifest: {
        about: {
            name: "Salt Popcorn Plugin",
            version: "0.1",
            author: "Susan E. McGregor (@susanemcg)",
            website: "github/susanemcg"
        },
        options: {
            start: {
              elem: "input",
              type: "number",
              label: "Start"
            },
            end: {
              elem: "input",
              type: "number",
              label: "End"
            },
            target: "div-id",
            has_reveal: {
              elem: "input",
              type: "string",
              label: "hasReveal"
            },
            reveal_timeout:{
              elem: "input",
              type: "number",
              label: "duration"
            }

        } 
    },

    _setup : function( options ) {
        var targetDiv = Popcorn.dom.find( options.target );

        if ( targetDiv ){
          //get the div element and save a reference to it
          options._container = targetDiv;
          var targetCSS = targetDiv.currentStyle || getComputedStyle(targetDiv,null);
          //remember its original display type
          options._displayType = targetCSS.display;
          //hide it
          options._container.style.display = "none";

        }        
     },
     
    start: function( event, options ){
  
      if ( options.has_reveal == "true" ) {          
           
        //if reveal option is set, create references to div and display style...  
        var revealDiv = options._container;
        var redisplayType = options._displayType;

        //because we may need to adjust them in the case of a "handText" instance
        if( ( options._container.className ).indexOf( 'handText' ) != -1 ) {
            revealDiv = options._container.children[0];
            revealCSS = revealDiv.currentStyle || getComputedStyle(revealDiv,null);
            redisplayType = revealCSS.display;

        }else if( ( options._container.className ).indexOf( 'revealWrap' ) == -1 ){
        //this means we're dealing with "normal" text. segments to be revealed successively should be pipe-separated
        //we check for the "revealWrap" class in case the user rewinds. without this check, the text will
        //be "divided" twice, leaving it all jammed up together.

          var revealContents = revealDiv.textContent;
          var revealArray = revealContents.split("|");
          revealDiv.innerHTML = "";
          revealDiv.className = "revealWrap";
          
          for (var p=0; p<revealArray.length; p++){
            var wrapperDiv = document.createElement("div");
            wrapperDiv.className = "revealWrap";
            wrapperDiv.innerHTML = revealArray[p];
            revealDiv.appendChild(wrapperDiv);
          }

        }

        //make the main/parent container visible
        options._container.style.display = options._displayType;

        //but loop through and hide its children...
        for(var i = 0; i < revealDiv.children.length; i++){
          revealDiv.children[i].style.display = "none";
          var delay = options.reveal_timeout ? Number(options.reveal_timeout) : 100;

            //while also setting a timeout for revealing them.
            (function (elem, display_style){
              setTimeout( function () { elem.style.display = display_style;}, delay*i);
            })(revealDiv.children[i], redisplayType);
        }
           
      } else {
       //display div with original display type
        options._container.style.display = options._displayType;  

      }      
    },

    end: function( event, options ){
      //hide it when it's all over
       options._container.style.display = "none";
     },

   _teardown: function( options ) {
      var targetDiv = Popcorn.dom.find( options.target );
      if ( targetDiv ) {
        targetDiv.removeChild( options._container );
      }
    }
  });

})(Popcorn);