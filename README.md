datadocs
========

Data Docs is a platform for building interactive web videos that seamlessly integrate links, dynamic text and data into a web video experience. For more information about the project and team, see datadocs.org/beta. For training materials and some demos, visit datadocs.org/training. For an overview of the datadocs library and brief guide to the demos, read on.

What is a Data Doc?
-------------------

Conceptually, a Data Doc is a web video (audio TK) with interactive **things** on top, but styled and presented in such a way that the interactive elements and the video itself look seamless together. Technically, a Data Doc is an HTML5 video element with a container div on top and custom controls above that so that users can interact with the content but still control the video. 

From a programming perspective, this is implemented via some boilerplate HTML and the instantiation of a datadoc *object*, which is passed a handful of parameters that control whether there is a full-screen option, a share option &c. as well as whether or not the player controls are styled via CSS or images. The next section covers the basic requirements for setting up an HTML file that will contain a Data Doc, as well as the details of the datadoc javascript object.

Getting started with Data Docs
------------------------------

Making a basic Data Doc requires little to no understanding of JavaScript. If you have some experience with HTML & CSS, you should be able to get a Data Doc up and running in a few minutes.

*Required includes:*

**javascript**
> + popcorn.js
> + screenFull.js
> + utils.js
> + popcorn.salt.js
> + popcorn.caramel.js
> + customcontrols.js
> + datadoc.js

**css**
> + main.css
> + controls.css or controls_dark.css *unless you will provide images for the video controls*

**Data Docs is not dependent on jQuery**, though we use it for detecting page load events and creating content in many of the examples, simply because jQuery is so widely used. However, no part of the datadocs library incorporates jQuery functions.

### Creating the **data_doc** object

The **data_doc** object has a handful of required and optional parameters, outlined below:

    data_doc = DataDoc({
     "video_id": "datadocsvid", *id of <video> tag if using HTML5 video. If using YouTube, this should be a <div>.*
     "fullscreen_id": "all_info", *id of *
      "embed_id": "embed_code"
      },
      {
      "control_style": "css",
      "text_url": "assets/data/text_labels.json
    });


