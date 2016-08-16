        var openSource = function (button, sourceContainer) {
            $(button).click(
                function () {
                    $(sourceContainer).show().click(
                        function () {
                            $(sourceContainer).hide();
                        }
                    )
                }
            );
        };

        var openPopup = function (button, popUp) {
            $(button).click(
                function () {
                    $(popUp).show();
                    $(popUp + ' .close-btn').click(
                        function () {
                            $(popUp).hide();
                        }
                    )
                }
            );
        };

        var closePopup = function () {
            $(".popup, .source").hide();
        };;/**
 * agnitio.js
 *
 * The Agnitio Content API
 *
 * Documentation can be found at:
 * http://wiki.agnitio.com/index.php/Agnitio_Content_API_(iPad)
 *
 * @author     Stefan Liden
 * @copyright  Copyright 2014 Agnitio
 */

(function () {

  // Is script running on iOS device?
  var api_version = '1.5.1',
      customInvoke = false,
      ua = navigator.userAgent,
      // From: http://davidwalsh.name/detect-ipad
      isiPad = /iPad/i.test(ua) || /iPhone OS 3_1_2/i.test(ua) || /iPhone OS 3_2_2/i.test(ua),
      isSafari = ua.match(/Safari/i) != null,
      // UIWebView does not contain the word "Version" in user agent string
      isUIWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Version)/i.test(navigator.userAgent),
      // isAndroid = ua.indexOf("Android") > -1,
      isiPlanner = isUIWebView; // Default, TODO: check platform.isAgnitio

  /**
   * Invoke method on platform/device
   * @private       
   */
  function invoke (api, params) {
    // Default will be no action
    // Will be overwritten based on what platform it's running in
  }

  /**
  * Publish event asynchronously
  * @private       
  */
  function publish (api, data) {
    setTimeout(function() {
      ag.publish(api, data);
    },0); 
  }

  // Invoke iPlanner public method
  function calliPlanner (api, params) {
    var invokeString, iFrame;
    // invokeString = "http://engager.agnitio.com/" + api + "?" + encodeURIComponent(params)
    if (isiPlanner) {
      invokeString = "objc://iplanner/" + api + "?" + encodeURIComponent(params),
      iFrame = document.createElement("IFRAME");
      iFrame.setAttribute("src", invokeString);
      document.body.appendChild(iFrame); 
      iFrame.parentNode.removeChild(iFrame);
      iFrame = null;
    }
  }

  // Set save method depending on environment
  if (isiPlanner) {
    invoke = calliPlanner;
  }

  // Create the global Agnitio namespace 'ag'
  window.ag = window.ag || {};

  /**
   * Set custom invoke method
   * @public       
   */
  ag.setInvoke = function (fn) {
    customInvoke = true;
    invoke = fn;
  }

  /**
   * Get version of Agnitio Content API (this file) 
   * @public        
   */
  ag.getVersion = function () {
    return api_version;
  }

  /***********************************************************
  *
  * Pub/Sub
  *
  ***********************************************************/

  var listeners = {};
  var tokens = {}; // Will allow unregistering listener

  // Listen to an event
  ag.on = function (event, callback) {
    var token;
    if (!listeners.hasOwnProperty(event)) {
      listeners[event] = [];
    }
    // ln = listeners[event].length;
    token = event + "_" + new Date().getTime();
    listeners[event].push(token);
    tokens[token] = [event, callback];
    return token;
  }

  ag.off = function (token) {
    var pos, listener;
    var evt = tokens[token];
    if (evt) {
      listener = listeners[evt[0]];
      pos = listener.indexOf(token);
      listener.splice(pos, 1);
    }
  }

  ag.publish = function (event, args) {
    if (listeners.hasOwnProperty(event)) {
      for (var i = 0; i < listeners[event].length; ++i) {
        try {
          tokens[listeners[event][i]][1].call(null, args);
          // listeners[event][i].call(null, args);
        } catch (e) {
          if (console && console.error) {
            console.error(e);
          }
        }
      }
    }
  }

  /***********************************************************
  *
  * Agnitio Debugger
  *
  ***********************************************************/

  // To access API it should be called as
  // var debugger = ag.debug();

  ag.debug = function(writeToConsole) {

    var writeToConsole = writeToConsole || false;
    var active = false;
    var data = []; // Container for all monitoring data
    // Event listener tokens
    var meToken, pdfToken, mailToken;

    if (window.console && window.console.warn) {
      console.warn('This presentation is in debug mode and will not submit to Agnitio Analytics.\nRemove ag.debug() call before publishing.');
    }

    // Write to console
    function write (api, info) {
      if (writeToConsole) console.log('[DEBUG] ' + api, info);
    }

    function validate (event) {
      if (event.category && event.label && event.value || event.category === 'slideExit') {
        return true;
      }
      return false;
    }

    // Log a monitoring event
    function log (event) {
      if (validate(event)) {
        // If the unique flag is set to true, we need to replace any previous ones
        // Only worry about this if specifically in debug mode
        if (event.isUnique) {
          data.forEach(function(loggedEvent, i) {
            if ((loggedEvent.category === event.category) && (loggedEvent.label === event.label)) {
              data.splice(i, 1);
            }
          });
        }
        data.push(event);   
        write(event.category, event);
      }
      // TODO: log error
    }


    // Set up listeners
    function start () {
      active = true;
      meToken = ag.on('monitoringEvent', log);
      pdfToken = ag.on('openPDF', function(path) {write('openPDF', path)} );
      mailToken = ag.on('sendMail', function(params) {write('sendMail', params)} );
      captureToken = ag.on('captureImage', function(params) {write('captureImage', params)} );
      presenterToken = ag.on('getPresenter', function(params) {write('getPresenter', params)} );
      contactsToken = ag.on('getCallContacts', function(params) {write('getCallContacts', params)} );
      attributesToken = ag.on('getCallAttributes', function(params) {write('getCallAttributes', params)} );
    }

    // Stop debugging
    function stop () {
      active = false;
      ag.off(meToken); 
      ag.off(pdfToken); 
      ag.off(mailToken);
      ag.off(captureToken);
      ag.off(presenterToken);
      ag.off(contactsToken);
      ag.off(attributesToken);
    }

    // Get the log data
    function getLog () {
      return data;
    }

    start();

    // Public API
    return {
      start: start,
      stop: stop,
      getLog: getLog
    }
  };

  /***********************************************************
  *
  * Get information about the platform
  *
  ***********************************************************/

  ag.platform = (function() {

    function info () {
      if (window.agnitioInfo) {
          return window.agnitioInfo;
      }
      else if (window.iPlanner) {
          return window.iPlanner;
      }
      return undefined;
    }

    // Utility for quickly checking if currently running in Agnitio
    function isAgnitio () {
      if (window.agnitioInfo || window.iPlanner) {
          return true;
      }
      return false;
    }

    // Utility for checking if currently running in an App (vs. web)
    // Currently check for iOS only
    function isApp () {
      if (isUIWebView) return true;
      return false;
    }

    return {
      info: info,
      isAgnitio: isAgnitio,
      isApp: isApp
    }
  }());


  /***********************************************************
  *
  * Call built-in iPlanner functionality
  *
  ***********************************************************/

  /**
   * Capture canvas image (i.e. signature) from presentation. 
   * @public     
   * @param options object   
   */
  ag.captureImage = function (options) {
    var params = {
      directCall: options.directCall || true,
      imageData: options.imageData || '',
      imageDescription: options.imageDescription || null,
      signatory: options.signatory || null,
      signatoryEmail: options.signatoryEmail || null,
      emailRecipients: options.emailRecipients || null,
      emailSubject: options.emailSubject || null,
      emailBody: options.emailBody || null
    },
    args = JSON.stringify(params);
    invoke('sigCapture', args);
    publish('captureImage', params);
  }

  /**
   * Opens PDF in iPlanner or browser
   * If name is included it will also monitor document
   * @public     
   * @param path string   
   * @param name string OPTIONAL
   */
  ag.openPDF = function (path, name) {
    var log = log || false,
        fileName;
    invoke('openPDF', path);
    publish('openPDF', path);
    // If name is included, automatically log opening of document
    if (name) {
      fileName = path.replace(/^.*[\\\/]/, '');
      ag.submit.document(fileName, name);
    }
  }

  /**
   * Sends email from iPlanner
   * NOTE: If using string for file attachment it will expect a filename, not path
   * @public     
   * @param address string   
   * @param subject string   
   * @param body string   
   * @param files array/string  
   */
  ag.sendMail = function (address, subject, body, files) {
    var files = files || '',
        params, args, invokeString, iFrame;
    if (typeof files === 'string' || files instanceof String) {
      params = {'address': address, 'subject': subject, 'body':body, 'fileName': files}
    }
    else {
      params = {'address': address, 'subject': subject, 'body':body, 'fileNames': files}
    }
    args = JSON.stringify(params);
    invoke('sendMail', args);
    publish('sendMail', params);
  }

  /***********************************************************
  *
  * Get data from Agnitio (iPlanner, DBs etc)
  *
  ***********************************************************/

  /**
   * @namespace     ag.data
   * @description   API for getting data from Agnitio into presentation
   */
  ag.data = (function() {
    // Holder for contacts returned from calling 'ag.data.getCallContacts'
    var presenter = null,
        call_attributes = null,
        call_contacts = null;

    /**
     * Save returned presenter attributes to property
     * Is used as callback in 'ag.data.getPresenter'
     * @private
     * @param data Data object
     */
    function savePresenter (data) {
      var attributes = JSON.parse(data);
      ag.data.presenter = attributes;
    }

    /**
     * Save returned meeting attributes to property
     * Is used as callback in 'ag.data.getMeetingAttributes'
     * @private
     * @param data Data object
     */
    function saveCallAttributes (data) {
      var attributes = JSON.parse(data);
      ag.data.call_attributes = attributes;
    }

    /**
     * Save returned contacts to property
     * Is used as callback in 'ag.data.getCallContacts'
     * @private
     * @param data Data object
     */
    function saveContacts (data) {
      var contacts = JSON.parse(data);
      ag.data.call_contacts = contacts;
    }

    /**
     * Get presenter attributes (e.g. sales rep attributes)
     * Implemented in iPlanner 1.11
     * @public
     */
    function getPresenter () {
      invoke('getPresenter', '{"resultFunction": "ag.data._savePresenter"}');
      publish('getPresenter', null);
    }

    /**
     * Get meeting attributes (dynamic custom attributes)
     * If no parameter is given it will return all known attributes for the meeting
     * Implemented in iPlanner 1.11
     * @public
     * @param attributes Array of names of desired attribute - OPTIONAL
     */
    function getCallAttributes (attributes) {
      var attr = attributes || [],
          attrStr = JSON.stringify(attr);
      invoke('getMeetingDynamicAttributes', '{"wantedAttributes": ' + attrStr + ', "resultFunction": "ag.data._saveCallAttributes"}');
      publish('getCallAttributes', attr);
    }

    /**
     * WORK IN PROGRESS
     * Set meeting attributes (dynamic custom attributes)
     * If no parameter is given it will return all known attributes for the meeting
     * Implemented in iPlanner 1.11
     * @public
     * @param attributes Array of names of desired attribute - OPTIONAL
     */
    function setCallAttributes (attributes) {
      var attr = attributes || [];
    // invoke('getMeetingDynamicAttributes', '{"wantedAttributes": attr, "resultFunction": "ag.data._saveCallAttributes"}');
    }

    /**
     * Get contacts that have been set up in the pre-call data
     * Will store the contacts as JavaScript objects to 'ag.data.call_contacts'
     * This function is best called when the presentation is initialized
     * Implemented in iPlanner 1.9.1
     * @public
     */
    function getCallContacts () {
      invoke('getCallContacts', 'ag.data._saveContacts');
      publish('getCallContacts', null);
    }

    // Public API
    return {
      presenter: presenter,
      call_contacts: call_contacts,
      call_attributes: call_attributes,
      getPresenter: getPresenter,
      getCallAttributes: getCallAttributes,
      getCallContacts: getCallContacts,
      _savePresenter: savePresenter,
      _saveCallAttributes: saveCallAttributes,
      _saveContacts: saveContacts
    }

  }());

  /***********************************************************
  *
  * Save data to the Agnitio Analyzer DB (direct or via iPlanner)
  *
  ***********************************************************/

  /**
   * @namespace     ag.submit
   * @description   Functionality for saving data to the Agnito Analyzer
   */
  ag.submit = (function() {

    var currentSlideId = null,
        currentData = null,
        enabled = true;

    function isEnabled () {
      return enabled;
    }

    function disable () {
      enabled = false;
    }

    function enable () {
      enabled = true;
    }

    // Save function if viewed in iPlanner
    function save (data) {
      if (isEnabled()) {
        invoke('monitoringEvent', JSON.stringify(data));
        publish('monitoringEvent', data);
      }
    }

    /**
     * Get current time in seconds
     * @private
     */
    function timestamp () {
      return Math.floor((new Date().getTime()) / 1000);
    }

    /**
     * Save slide data
     * @public
     * @param data Data object
     */
    function slide (data) {

     var monitoringData,
         now            = timestamp(),
         chapterName    = data.chapter || null,
         chapterId      = data.chapterId || null,
         subChapterName = data.subChapter || null,
         subChapterId   = data.subChapterId || null,
         slideIndex     = data.slideIndex || null,
         slidePath      = data.path || null,
         parent         = data.parent || null,
         grandParent    = data.grandParent || null;

     // Chapter validation and setting of parents
     // Parents are set for backward compatibility
     if (chapterName) {
      if (subChapterName) {
        grandParent = grandParent || chapterName;
        parent = parent || subChapterName;
      }
      else {
        parent = parent || chapterName;
      }
     }
     else if (subChapterName) {
      // Register error. Can't have subchapter without chapter
     }

     // Exit previous slide if there is one
     if (currentSlideId) { slideExit(); }

     // The data to be sent to database
     monitoringData = {
       type: "system",
       categoryId: null,
       category: "slideEnter",
       labelId: "id",
       label: "name",
       valueId: data.id,
       value: data.name,
       valueType: null,
       time: now,
       slideIndex: slideIndex,
       slidePath: slidePath,
       chapterName: chapterName,
       chapterId: chapterId,
       subChapterName: subChapterName,
       subChapterId: subChapterId,
       parentSlideName: parent,
       parentOfParentSlideName: grandParent
     };

     // Set the entered slide as the current one
     currentSlideId = data.id;
     currentData = data;

     ag.submit.save(monitoringData);
    }

    /**
     * Exit previous slide
     * @private
     */
    function slideExit () {

      var data, now;

      if (!currentSlideId) { return; }

      now = timestamp();

      data = {
        type: "system",
        categoryId: null,
        category: "slideExit",
        labelId: "id",
        label: "name",
        valueId: currentSlideId,
        value: undefined,
        valueType: undefined,
        time: now,
        slideIndex: undefined,
        slidePath: undefined,
        chapterName:undefined,
        chapterId: undefined,
        subChapterName: undefined,
        subChapterId: undefined
      };

      // Remove current slide
      currentSlideId = null;

      ag.submit.save(data);
    }

    /**
     * Resume monitoring after pausing
     * @public
     */
    function resume () {
      ag.submit.slide(currentData);
    }

    /**
     * Save opened document
     * @public
     * @param id Id of the opened document
     * @param name Name of the opened document
     */ 
    function documentOpen (id, name) {

      var data, now;

      now = timestamp();

      // The data to be sent to database
      data = {
        type: "system",
        categoryId: null,
        category: "documentOpen",
        labelId: "id",
        label: "name",
        valueId: id,
        value: name,
        valueType: null,
        time: now
      };

      // Set the opened document as the current one
      currentDocument = id;

      ag.submit.save(data);
    }

    /**
     * Save opened reference
     * @public
     * @param id Id of the opened reference
     * @param name Name of the opened reference
     */ 
    function referenceOpen (id, name) {

      var data, now;

      now = timestamp();

      // The data to be sent to database
      data = {
        type: "system",
        categoryId: null,
        category: "referenceOpen",
        labelId: "id",
        label: "name",
        valueId: id,
        value: name,
        valueType: null,
        time: now
      };

      // Set the opened document as the current one
      currentDocument = id;

      ag.submit.save(data);
    }

    /**
     * Save a presentation structure
     * @public
     * @param name string Label to identify structure
     * @param data Data object to save
     * DEPRECATED
     */ 
    function structure (name, structure) {

      var monitorData,
          now = timestamp();

      monitorData = {
        isUnique: true,
        type: "custom",
        category: "Presentation structure",
        categoryId: "ag-002",
        label: name,
        labelId: "",
        value: structure,
        valueId: "",
        valueType: "text",
        time: now
      }

      ag.submit.save(monitorData);
    }

    /**
     * Save a custom event
     * @public
     * @param data Data object to save
     */ 
    function customEvent (data) {

      var monitorData,
          now = timestamp(),
          category = data.category || 'Uncategorized',
          categoryId = data.categoryId || null,
          labelId = data.labelId || null,
          valueId = data.valueId || null,
          valueType = data.valueType || 'text',
          path = data.path || null;
          isUnique = data.unique || false;

      monitorData = {
        isUnique: isUnique,
        type: "custom",
        category: category,
        categoryId: categoryId,
        label: data.label,
        labelId: labelId,
        value: data.value,
        valueId: valueId,
        valueType: valueType,
        slidePath: path,
        time: now
      }

      ag.submit.save(monitorData);
    }

    // Public API
    return {
      save: save, // override save method
      isEnabled: isEnabled,
      disable: disable,
      enable: enable,
      slide: slide,
      resume: resume,
      'document': documentOpen,
      reference: referenceOpen,
      structure: structure,
      data: customEvent,
      'event': customEvent,
      _slideExit: slideExit
    }

  }()); // End ag.submit

  /***********************************************************
  *
  * Make sure JSON is available, else make it so
  *
  ***********************************************************/

  // Make sure JSON methods are available
  // TODO: TEST!
  if (!isiPad && !window.JSON) {
    var script  = document.createElement('script');
    script.src  = file;
    script.type = 'text/javascript';
    script.defer = true;
    document.getElementsByTagName('head').item(0).appendChild('lib/json2.js');
    // throw new Error('JSON methods are not available, please add json2.js');
  }

  /***********************************************************
  *
  * Save the version of this API to the Analyzer
  *
  ***********************************************************/

  // Send the API version being used to the Analyzer
  ag.submit.data({
    unique: true,
    categoryId: "ag-001",
    category: "Versions",
    labelId: "ag-001-001",
    label: "Agnitio API version",
    value: api_version
  });

  /***********************************************************
  *
  * Make sure this API is compatible with older presentations
  * At some point these will be removed
  *
  ***********************************************************/

  // Utility functions
  if (!window.openPDF) {
    window.openPDF = ag.openPDF;
  }
  if (!window.sendMail) {
    window.sendMail = ag.sendMail;
  }
  if (!window.closePresentation) {
    window.closePresentation = function() {
      //ag.closePresentation;
    };
  }

  // Monitoring events
  if (!window.submitSlideEnter) {
    window.isMonitoringEnabled = ag.submit.isEnabled();
    window.monitorSayHello = function() {};
    window.submitSlideEnter = function(slideId, slideName, slideIndex, parent, grandparent) {
      var gp = grandparent || null,
          p = parent || null,
          i = slideIndex || null;
      ag.submit.slide({
        grandParent: gp,
        parent: p,
        slideIndex: i,
        id: slideId,
        name: slideName
      });
    };
    window.submitSlideExit = function() {
      ag.submit._slideExit();
    }
    window.submitSlideReEnter = function() {
      ag.submit.resume();
    }
    window.submitDocumentOpen = function(id, name) {
      ag.submit.document(id, name);
    }
    window.submitReferenceOpen = function(id, name) {
      ag.submit.reference(id, name);
    }
    window.submitCustomEvent = function(category, label, value, valueType) {
      var vt = valueType || 'text';
      ag.submit.event({
        category: category,
        label: label,
        value: value,
        valueType: vt
      });
    }
    window.submitUniqueCustomEvent = function(category, label, value, valueType) {
      var vt = valueType || 'text';
      ag.submit.event({
        unique: true,
        category: category,
        label: label,
        value: value,
        valueType: vt
      });
    }
  }

}());;/* Support functions */

function monitorInclude(file)
{
  var script  = document.createElement('script');
  script.src  = file;
  script.type = 'text/javascript';
  script.defer = true;
  document.getElementsByTagName('head').item(0).appendChild(script);
}

/* include any js files here */
//monitorInclude('../viewer/js/json2.js');


var monitorSavedSlideId = null;
var monitorSavedSlideName = null;
var monitorSavedSlideIndex = null;
var monitorSavedParentSlideName = null;
var monitorSavedParentOfParentSlideName = null;

var monitorPreviousSlideId = null;
var monitorPreviousSlideName = null;
var monitorPreviousSlideIndex = null;
var monitorPreviousParentSlideName = null;
var monitorPreviousParentOfParentSlideName = null;

function isMonitoringEnabled()
{
    return (typeof(monitoringEnabled) == 'boolean' && monitoringEnabled);
}

function now()
{
    return Math.floor(new Date().getTime()/1000);
}

function monitorSayHello()
{
    alert("Monitoring module says hello! Monitoring enabled " + isMonitoringEnabled());
}

function monitorSubmitEvent(monitorEvent)
{
    if (isMonitoringEnabled()) {
        // alert(monitorEvent.category);
        //var invokeString = "objc://iplanner/monitoringEvent?" + encodeURIComponent(JSON.stringify(monitorEvent));
        // window.location = invokeString;
        
        iFrame = document.createElement("IFRAME");
        //iFrame.setAttribute("src", invokeString);
        document.body.appendChild(iFrame); 
        iFrame.parentNode.removeChild(iFrame);
        iFrame = null;
    }
}

/* Agnitio monitorings support functions */


function submitSlideReEnter()
{
    if (monitorSavedSlideId) {
        submitSlideEnter(
            monitorSavedSlideId,
            monitorSavedSlideName,
            monitorSavedSlideIndex,
            monitorSavedParentSlideName,
            monitorSavedParentOfParentSlideName
        );
    }

}

function submitSlideEnter(slideId, slideName, slideIndex, parentSlideName, parentOfParentSlideName)
{
    if (monitorPreviousSlideId) {
        submitSlideExit();
    }
	
    console.log('Monitor received: ' + slideId + slideName + slideIndex + parentSlideName)
    var e = {
        type: "system",
        categoryId: null,
        category: "slideEnter",
        labelId: "id",
        label: "name",
        valueId: slideId,
        value: slideName,
        valueType: null,
        time: now(),
        slideIndex: slideIndex,
        parentSlideName: parentSlideName,
        parentOfParentSlideName: parentOfParentSlideName
    };

    monitorPreviousSlideId = slideId;

    monitorSavedSlideId = slideId;
    monitorSavedSlideName = slideName;
    monitorSavedSlideIndex = slideIndex;
    monitorSavedParentSlideName = parentSlideName;
    monitorSavedParentOfParentSlideName = parentOfParentSlideName;

    return monitorSubmitEvent(e);
}


function submitSlideExit()
{
    return __submitSlideExit(monitorPreviousSlideId, monitorPreviousSlideName, monitorPreviousSlideIndex, monitorPreviousParentSlideName, monitorPreviousParentOfParentSlideName);
}

function __submitSlideExit(slideId, slideName, slideIndex, parentSlideName, parentOfParentSlideName)
{
    if (!(monitorPreviousSlideId && monitorPreviousSlideId == slideId)) {
        return;
    }

    var e = {
        type: "system",
        categoryId: null,
        category: "slideExit",
        labelId: "id",
        label: "name",
        valueId: slideId,
        value: slideName,
        valueType: null,
        time: now(),
        slideIndex: slideIndex,
        parentSlideName: parentSlideName,
        parentOfParentSlideName: parentOfParentSlideName
    };

    monitorPreviousSlideId = null;

    return monitorSubmitEvent(e);
}

function submitDocumentOpen(documentId, documentName)
{

    var e = {
        type: "system",
        categoryId: null,
        category: "documentOpen",
        labelId: "id",
        label: "name",
        valueId: documentId,
        value: documentName,
        valueType: null,
        time: now(),
    };

    return monitorSubmitEvent(e);
}

function submitReferenceOpen(referenceId, referenceName)
{

    var e = {
        type: "system",
        categoryId: null,
        category: "referenceOpen",
        labelId: "id",
        label: "name",
        valueId: referenceId,
        value: referenceName,
        valueType: null,
        time: now()
    };

    return monitorSubmitEvent(e);
}


function submitCustomEvent(category, label, value, valueType, categoryId, labelId, valueId)
{
    var e = {
        type: "custom",
        categoryId: categoryId,
        category: category,
        labelId: labelId,
        label: label,
        valueId: valueId,
        value: value,
        valueType: valueType,
        time: now()
    };

    return monitorSubmitEvent(e);
}


function submitUniqueCustomEvent(category, label, value, valueType, categoryId, labelId, valueId)
{
    var e = {
        isUnique: true,
        type: "custom",
        categoryId: categoryId,
        category: category,
        labelId: labelId,
        label: label,
        valueId: valueId,
        value: value,
        valueType: valueType,
        time: now()
    };

    return monitorSubmitEvent(e);
}





;/* Support functions */

function pdfInclude(file)
{
  var script  = document.createElement('script');
  script.src  = file;
  script.type = 'text/javascript';
  script.defer = true;
  document.getElementsByTagName('head').item(0).appendChild(script);
}

/* include any js files here */
// pdfInclude('../viewer/js/json2.js');

function openPDF(fileName)
{
       
        // alert(monitorEvent.category);
        var invokeString = "objc://iplanner/openPDF?" + encodeURIComponent(fileName);
        // window.location = invokeString;
        iFrame = document.createElement("IFRAME");
        iFrame.setAttribute("src", invokeString);
        document.body.appendChild(iFrame); 
        iFrame.parentNode.removeChild(iFrame);
        iFrame = null;

}

;
/* Support functions */

function sendMailInclude(file)
{
  var script  = document.createElement('script');
  script.src  = file;
  script.type = 'text/javascript';
  script.defer = true;
  document.getElementsByTagName('head').item(0).appendChild(script);
}

/* include any js files here */
sendMailInclude('./_framework/lib/json2.js');

function sendMail(address, subject, body, fileName)
{
    var args = {'address': address, 'subject': subject, 'body':body, 'fileName': fileName};

    var invokeString = "objc://iplanner/sendMail?" + encodeURIComponent(JSON.stringify(args));

    iFrame = document.createElement("IFRAME");
    iFrame.setAttribute("src", invokeString);
    document.body.appendChild(iFrame); 
    iFrame.parentNode.removeChild(iFrame);
    iFrame = null;
}

;/**
 * touchy.js
 *
 * A JavaScript microlibrary for UI interaction on Wekbit mobile and desktop.
 * Dispatches custom events to be used when normal events does not suffice.
 * NOTE: stopPropagation() will not work on these events, use touchy.stop(event) instead.
 *
 * @author     Stefan Liden
 * @version    0.2
 * @copyright  Copyright 2011 Stefan Liden
 * @license    Dual licensed under MIT and GPL
 */

(function() {
  var d = document,
      isTouch = 'ontouchstart' in window,
      doubleTap = false,
      touchEvents = {
        start: 'touchstart',
        move: 'touchmove',
        end: 'touchend'
      },
      mouseEvents = {
        start: 'mousedown',
        move: 'mousemove',
        end: 'mouseup'
      },
      evts = isTouch ? touchEvents : mouseEvents,
      customEvents = {
        tap: '',
        doubleTap: '',
        twoFingerTap: '',
        longTouch: '',
        swipeleft: '',
        swiperight: '',
        swipeup: '',
        swipedown: ''
      },
      swipeEvents = ['tap', 'doubleTap', 'twoFingerTap', 'longTouch', 'swipeleft', 'swiperight', 'swipeup', 'swipedown'];
  
  // Create the custom events to be dispatched
  function createSwipeEvents () {
    swipeEvents.forEach(function(evt) {
      customEvents[evt] = d.createEvent('UIEvents');
      customEvents[evt].initEvent(evt, true, true);
    });
  }
  // Fix for stopPropagation not working in Webkit and Opera for custom events
  function stopBubbling	 (event) {
    event.cancelBubble = true;
    setTimeout(function() {
      event.cancelBubble = false;
	  
    },0);
  }
  function onStart (event) { 

    var startTime = new Date().getTime(),
        touch = isTouch ? event.touches[0] : event,
        nrOfFingers = isTouch ? event.touches.length : 1,
        startX, startY, hasMoved;

    startX = touch.clientX;
    startY = touch.clientY;
    hasMoved = false;

    d.addEventListener(evts.move, onMove, false);
    d.addEventListener(evts.end, onEnd, false);
    
    function onMove (event) {
      hasMoved = true;
      nrOfFingers = isTouch ? event.touches.length : 1;
    }
    function onEnd (event) {
	
     var endX, endY, diffX, diffY,
          ele = event.target,
          customEvent = '',
          endTime = new Date().getTime(),
          timeDiff = endTime - startTime;
      touch = isTouch ? touch : event;

      if (nrOfFingers === 1) {
        if (!hasMoved) {
          if (timeDiff <= 1000) {
		  
            if (doubleTap) {
              ele.dispatchEvent(customEvents.doubleTap);
            }
            else {
              ele.dispatchEvent(customEvents.tap);
              doubleTap = true;
            }
            resetDoubleTap();
          }
          else {
            ele.dispatchEvent(customEvents.longTouch);
          }
        }
        else {
          if (timeDiff < 1000 ) {
            endX = touch.clientX;
            endY = touch.clientY;
            diffX = endX-startX;
            diffY = endY-startY;
	        dirX = diffX > 1 ? 'right' : 'left';
            dirY = diffY > 1 ? 'down' : 'up';
            absDiffX = Math.abs(diffX);
            absDiffY = Math.abs(diffY);
            
            if (absDiffX >= absDiffY) {
              customEvent = 'swipe' + dirX;
            }
            else {
              customEvent = 'swipe' + dirY;
            }
            
            ele.dispatchEvent(customEvents[customEvent]);
          }
        }
      }
      else if (nrOfFingers === 2) {
        ele.dispatchEvent(customEvents.twoFingerTap);
      }

      d.removeEventListener(evts.move, onMove, false);
      d.removeEventListener(evts.end, onEnd, false);
    }
  }
  
  function resetDoubleTap() {
    setTimeout(function() {doubleTap = false;}, 400);
  }
  

  createSwipeEvents();
  d.addEventListener(evts.start, onStart, false);

  // Return an object to access useful properties and methods
  return window.touchy = {
    isTouch: isTouch,
    stop: stopBubbling,
    events: evts
  }
})();;/**
 * draggy.js
 *
 * A JavaScript/CSS3 microlibrary for moving elements in Webkit browsers.
 *
 * BROWSER SUPPORT: Safari, Chrome, Firefox, Opera, IE9
 *
 * @author     Stefan Liden
 * @version    0.8
 * @copyright  Copyright 2012 Stefan Liden (Jofan)
 * @license    Dual licensed under MIT and GPL
 */

(function() {
  'use strict';

  // Some simple utility functions
  var util = {
    addClass: function(ele, classname) {
      if (!this.hasClass(ele, classname)) {
        ele.className += ' ' + classname;
      }
    },
    hasClass: function(ele, classname) {
      if (ele.className) {
        return ele.className.match(new RegExp('(\\s|^)' + classname + '(\\s|$)'));
      } else {
        return false;
      }
    },
    removeClass: function(ele, classname) {
      var cleaned = new RegExp(new RegExp('(\\s|^)' + classname + '(\\s|$)'));
      ele.className = ele.className.replace(cleaned, '');
    },
    // PPK script for getting position of element
    // http://www.quirksmode.org/js/findpos.html
    getPosition: function(ele) {
      var curleft = 0;
      var curtop = 0;
      if (ele.offsetParent) {
        do {
          curleft += ele.offsetLeft;
          curtop += ele.offsetTop;
        } while (ele = ele.offsetParent);
      }
      return [curleft,curtop];
    }
  };

  // Browser compatibility
  var transform = {}; 
  (function() {
    var ele = document.createElement('div');
    if ('WebkitTransform' in ele.style) {
      transform.pre = '-webkit-transform:translate3d(';
      transform.post = ', 0);';
    }
    else if ('MozTransform' in ele.style) {
      transform.pre = '-moz-transform:translate(';
      transform.post = ');';
    }
    else if ('msTransform' in ele.style) {
      transform.pre = '-ms-transform:translate(';
      transform.post = ');';
    }
    else if ('OTransform' in ele.style) {
      transform.pre = '-o-transform:translate(';
      transform.post = ');';
    }
    else {
      transform.pre = 'transform:translate(';
      transform.post = ');';
    }
  }()); 

  var d = document,
      isTouch = 'ontouchstart' in window,
      mouseEvents = {
        start: 'mousedown',
        move: 'mousemove',
        end: 'mouseup'        
      },
      touchEvents = {
        start: 'touchstart',
        move: 'touchmove',
        end: 'touchend'
      },
      events = isTouch ? touchEvents : mouseEvents;

  window.onDrag = d.createEvent('UIEvents');
  window.onDrop = d.createEvent('UIEvents');
  onDrag.initEvent('onDrag', true, true);
  onDrop.initEvent('onDrop', true, true);

  window.Draggy = function(attachTo, config) {
    this.attachTo = attachTo;
    this.config   = config || {};
    this.onChange = this.config.onChange || function() {};
    this.position = [0,0];
    this.bindTo   = this.config.bindTo || null;
    this.init();
  };

  Draggy.prototype = {
    init: function() {
      this.ele           = (typeof this.attachTo === 'string' ? d.getElementById(this.attachTo) : this.attachTo);
      this.ele.draggy    = this;
      this.ele.onChange  = this.onChange;
      this.ele.position  = this.position || [0, 0];
      this.ele.restrictX = this.config.restrictX || false;
      this.ele.restrictY = this.config.restrictY || false;
      this.ele.limitsX   = this.config.limitsX || [-9999, 9999];
      this.ele.limitsY   = this.config.limitsY || [-9999, 9999];
      this.ele.snapBack  = this.config.snapBack || false;
      if (this.bindTo) {
        this.bind(this.bindTo);
      }
      this.enable();
    },
    // Reinitialize draggy object and move to saved position
    reInit: function() {
      this.init();
      this.setTo(this.ele.position[0], this.ele.position[1]);
    },
    // Disable the draggy object so that it can't be moved
    disable: function() {
      this.ele.removeEventListener(events.start, this.dragStart);
    },
    // Enable the draggy object so that it can be moved
    enable: function() {
      this.ele.addEventListener(events.start, this.dragStart);
    },
    // Get current state and prepare for moving object
    dragStart: function(e) {
      var restrictX = this.restrictX,
          restrictY = this.restrictY,
          limitsX = this.limitsX,
          limitsY = this.limitsY,
          relativeX = this.position[0],
          relativeY = this.position[1],
          posX = isTouch ? e.touches[0].pageX : e.clientX,
          posY = isTouch ? e.touches[0].pageY : e.clientY,
          newX, newY,
          self = this; // The DOM element

      util.addClass(this, 'activeDrag');

      d.addEventListener(events.move, dragMove);
      d.addEventListener(events.end, dragEnd);
      
      // Move draggy object using CSS3 translate3d
      function dragMove (e) {
        e.preventDefault();
        var movedX, movedY, relX, relY,
            clientX = isTouch ? e.touches[0].pageX : e.clientX,
            clientY = isTouch ? e.touches[0].pageY : e.clientY;
        if (!restrictX) {
          // Mouse movement (x axis) in px
          movedX = clientX - posX;
          // New pixel value (x axis) of element
          newX = relativeX + movedX;
          if (newX >= limitsX[0] && newX <= limitsX[1]) {
            posX = clientX;
            relativeX = newX;
          }
          else if (newX < limitsX[0]) {
            posX = clientX;
            relativeX = limitsX[0];
          }
          else if (newX > limitsX[1]) {
            posX = clientX;
            relativeX = limitsX[1];
          }
        }
        if (!restrictY) {
          movedY = clientY - posY;
          newY = relativeY + movedY;
          if (newY >= limitsY[0] && newY <= limitsY[1]) {
            posY = clientY;
            relativeY = newY;
          }
          else if (newY < limitsY[0]) {
            posY = clientY;
            relativeY = limitsY[0];
          }
          else if (newY > limitsY[1]) {
            posY = clientY;
            relativeY = limitsY[1];
          }
        }
        self.pointerPosition = [posX, posY];
        self.position = [relativeX, relativeY];
        self.style.cssText = transform.pre + relativeX + 'px,' + relativeY + 'px' + transform.post;
        self.onChange(relativeX, relativeY);
        self.dispatchEvent(onDrag);
      }
      // Stop moving draggy object, save position and dispatch onDrop event
      function dragEnd (e) {
        self.pointerPosition = [posX, posY];
        self.draggy.position = self.position;
        util.removeClass(self.draggy.ele, 'activeDrag');
        self.dispatchEvent(onDrop);
        d.removeEventListener(events.move, dragMove);
        d.removeEventListener(events.end, dragEnd);
      }

    },
    // API method for moving the draggy object
    // Position is updated
    // Limits and restrictions are adhered to
    // Callback is NOT called
    // onDrop event is NOT dispatched
    moveTo: function(x,y) {
      x = this.ele.restrictX ? 0 : x;
      y = this.ele.restrictY ? 0 : y;
      if (x < this.ele.limitsX[0] || x > this.ele.limitsX[1]) { return; }
      if (y < this.ele.limitsY[0] || y > this.ele.limitsY[1]) { return; }
      this.ele.style.cssText = transform.pre + x + 'px,' + y + 'px' + transform.post;
      this.ele.position = this.position = [x,y];
    },
    // API method for setting the draggy object at a certain point
    // Limits and restrictions are adhered to
    // Callback is called
    // onDrop event is dispatched
    setTo: function(x,y) {
      x = this.ele.restrictX ? 0 : x;
      y = this.ele.restrictY ? 0 : y;
      if (x < this.ele.limitsX[0] || x > this.ele.limitsX[1]) { return; }
      if (y < this.ele.limitsY[0] || y > this.ele.limitsY[1]) { return; }
      this.ele.style.cssText = transform.pre + x + 'px,' + y + 'px' + transform.post;
      this.ele.onChange(x, y);
      this.ele.dispatchEvent(onDrop);
      this.ele.position = this.position = [x,y];
    },
    // API method for resetting position of draggy object
    reset: function() {
      this.ele.style.cssText = transform.pre + '0, 0' + transform.post;
      this.ele.position = [0,0];
    },
    // API method for restricting draggy object to boundaries of an element
    // Sets x and y limits
    // Used internally of config option "bindTo" is used
    bind: function(element) {
      var ele = (typeof element === 'string' ? d.getElementById(element) : element),
          draggyPos, elePos, draggyWidth, eleWidth, draggyHeight, eleHeight,
          xLimit1, xLimit2, yLimit1, yLimit2;

      if (ele) {
        draggyPos    = util.getPosition(this.ele),
        elePos       = util.getPosition(ele),
        draggyWidth  = this.ele.offsetWidth,
        eleWidth     = ele.offsetWidth,
        draggyHeight = this.ele.offsetHeight,
        eleHeight    = ele.offsetHeight,
        xLimit1      = elePos[0] - draggyPos[0],
        yLimit1      = elePos[1] - draggyPos[1],
        xLimit2      = (eleWidth - draggyWidth) - Math.abs(xLimit1),
        yLimit2      = (eleHeight - draggyHeight) - Math.abs(yLimit1);

        this.ele.limitsX = [xLimit1, xLimit2];
        this.ele.limitsY = [yLimit1, yLimit2];

      }
    }
  };

  window.DropZones = function(dropIds) {
    this.dropIds = dropIds;
    this.storage = [];
    this.init();
  };

  DropZones.prototype = {
    init: function() {
      var self = this; 
      this.dropObjects = [];
      this.zoneLimits = [];
      this.dropIds.forEach(function(id) {
        var zone = {};
        var ele = document.getElementById(id);
        var width = ele.offsetWidth;
        var height = ele.offsetHeight;
        zone.dragObject = null;
        zone.ele = ele;
        zone.position = util.getPosition(ele);
        console.log(zone.position);
        zone.position[1] = zone.position[1] + 50;
        zone.limit = [zone.position[0], zone.position[0] + width, zone.position[1], zone.position[1] + height];
        self.dropObjects.push(zone);
        self.zoneLimits.push(zone.limit);
      });
    },
    attach: function(dragObject, dropZone) {
      var obj = this.dropObjects[dropZone];
      var label = dragObject.ele.innerText;
      var slideshow = dragObject.ele.getAttribute('data-slideshow');
      // Check if the zone already has an object attached
      if (obj.dragObject) {
        obj.dragObject.reset();
        util.removeClass(obj.dragObject.ele, 'invisible');
      }
      // Attach the dragObject to the dropZone
      obj.dragObject = dragObject;
      this.storage[dropZone] = dragObject;
      util.addClass(dragObject.ele, 'invisible');
      obj.ele.innerHTML = label;
      obj.ele.setAttribute('data-slideshow', slideshow);
    },
    // Update from storage
    update: function() {
      var self = this;
      this.storage.forEach(function(obj, index) {
        if (obj) {
          self.attach(obj, index);
        }
      });
    },
    isInZone: function(x, y) {
      var zone = -1;
      this.zoneLimits.forEach(function(limit, index) {
        if (x > limit[0] && x < limit[1]) {
          if (y > limit[2] && y < limit[3]) {
            zone = index;
          }
        }
      });
      return zone;
    }
  };


}());;(function() {
	window.util = {
		bind: function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
		addClass: function(ele, classname) {
			if (!this.hasClass(ele, classname)) {
				ele.className += ' ' + classname;
			}
		},
		hasClass: function(ele, classname) {
			if (ele.className) {
				return ele.className.match(new RegExp('(\\s|^)' + classname + '(\\s|$)'));
			} else {
				return false;
			}
		},
		removeClass: function(ele, classname) {
			var cleaned = new RegExp(new RegExp('(\\s|^)' + classname + '(\\s|$)'));
			ele.className = ele.className.replace(cleaned, ' ');
		},
		swapClass: function(ele, classname1, classname2) {
			var cleaned = new RegExp(new RegExp('(\\s|^)' + classname1 + '(\\s|$)'));

			if (this.hasClass(ele, classname1)) {
				ele.className = ele.className.replace(cleaned, ' ');
				ele.className += ' ' + classname2;
			}
		},
		toggleClass: function(ele, classname) {
			if (this.hasClass(ele, classname)) {
				this.removeClass(ele, classname);
			}
			else {
				this.addClass(ele, classname);
			}
		},
		// Wrapper to the iPlanner openPDF function that will monitor clicks
		openPDF: function(doc) {
			var path = 'content/pdf/' + doc;
			openPDF(path);
			submitDocumentOpen(path, doc);
		},
		// PPK script for getting position of element
		// http://www.quirksmode.org/js/findpos.html
		getPosition: function(ele) {
			var curleft = 0;
			var curtop = 0;
			if (ele.offsetParent) {
				do {
					curleft += ele.offsetLeft;
					curtop += ele.offsetTop;
				} while (ele = ele.offsetParent);
			}
			return [curleft,curtop];
		}
	};
})();
window.addEventListener("contentLoad", function(){
	var pdfLinks = document.querySelectorAll('[data-ag-pdf]');
	pdfLinks.forEach(function(element){
		element.addEventListener(touchy.events.start, function(event){
			util.openPDF(this.getAttribute('data-ag-pdf'));
			event.stopPropagation();
		});
	});
});

;// Generated by CoffeeScript 1.3.3
(function() {
  var AutoMenu, Collection, InlineScroller, MemoryManager, Presentation, Slidescroller, Slideshow, View, d, lastSlide,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  d = document;

  window.presentationInit = d.createEvent('UIEvents');

  window.slideshowLoad = d.createEvent('UIEvents');

  window.slideshowUnload = d.createEvent('UIEvents');

  window.collectionLoad = d.createEvent('UIEvents');

  window.collectionUnload = d.createEvent('UIEvents');

  window.contentLoad = d.createEvent('UIEvents');

  window.contentUnload = d.createEvent('UIEvents');

  window.slideEnter = d.createEvent('UIEvents');

  window.slideExit = d.createEvent('UIEvents');

  window.sectionEnter = d.createEvent('UIEvents');

  window.sectionExit = d.createEvent('UIEvents');

  window.appError = d.createEvent('UIEvents');

  presentationInit.initEvent('presentationInit', false, false);

  slideshowLoad.initEvent('slideshowLoad', true, false);

  slideshowUnload.initEvent('slideshowUnload', true, false);

  collectionLoad.initEvent('collectionLoad', true, false);

  collectionUnload.initEvent('collectionUnload', true, false);

  contentLoad.initEvent('contentLoad', true, false);

  contentUnload.initEvent('contentUnload', true, false);

  slideEnter.initEvent('slideEnter', true, false);

  slideExit.initEvent('slideExit', true, false);

  sectionEnter.initEvent('sectionEnter', true, false);

  sectionExit.initEvent('sectionExit', true, false);

  appError.initEvent('appError', true, false);

  d = document;

  lastSlide = null;

  window.Presentation = Presentation = (function() {

    function Presentation(config) {
      var collection, slideshow, _i, _j, _len, _len1, _ref, _ref1,
        _this = this;
      window.app = this;
      this.config = config || {};
      this.type = config.type || 'dynamic';
      this.orientation = config.orientation || 'landscape';
      this.dimensions = this.orientation === 'landscape' ? [1024, 768] : [768, 1024];
      this.version = '2.2';
      this.manageMemory = config.manageMemory || false;
      this.wrapSlides = config.wrapSlides || this.manageMemory;
      this.pathToSlides = this.config.pathToSlides || 'slides/';
      this.loaded = null;
      this.savedEvents = {};
      this.slideshows = {};
      this.collections = {};
      this.currentPath = '';
      this.setupByType();
      this.getElements();
      this.getAllSlides();
      _ref = this.slideshowIds;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        slideshow = _ref[_i];
        this.register(slideshow, this.slides[slideshow]);
      }
      _ref1 = this.collectionIds;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        collection = _ref1[_j];
        this.register(collection, this.sections[collection], 'collection');
      }
      d.addEventListener('slideEnter', function(e) {
        return _this.currentSlide = e.target.id;
      });
      d.dispatchEvent(presentationInit);
      return;
    }

    Presentation.prototype.setupByType = function() {
      var content, structure,
        _this = this;
      if (this.type === 'dynamic') {
        this.slides = this.config.slideshows || {};
        this.sections = this.config.collections || {};
      } else if (this.type === 'json') {
        this.json = {};
        this.slides = {};
        this.sections = {};
        this.getData('presentation.json', function(data) {
          return _this.json = data;
        });
        for (structure in this.json.structures) {
          content = this.json.structures[structure].content;
          if (this.json.structures[structure].type === 'slideshow') {
            this.slides[structure] = content;
          } else {
            this.sections[structure] = content;
          }
        }
      }
      this.slideshowIds = Object.keys(this.slides);
      return this.collectionIds = Object.keys(this.sections);
    };

    Presentation.prototype.init = function(structure, content, subcontent) {
      var arr, linkArr, missing_structure, name, path, query, structure_data, type;
      content = content || '';
      subcontent = subcontent || '';
      if (this.manageMemory) {
        d.addEventListener('slideEnter', function(event) {
          var slide;
          slide = event.target;
          return util.addClass(slide, 'active');
        });
        d.addEventListener('slideExit', function(event) {
          var slide;
          slide = event.target;
          return setTimeout(function() {
            if (slide.id !== app.slideshow.current) {
              return util.removeClass(slide, 'active');
            }
          }, 500);
        });
      }
      if (this.type === 'json') {
        structure = structure || this.json.storyboard[0];
        structure_data = this.json.structures[structure];
        if (structure_data) {
          type = structure_data.type;
        } else {
          missing_structure = new View({
            template: 'missing_structure',
            structure_id: structure
          });
          this.elements.slideshows.innerHTML = missing_structure.markup;
          d.dispatchEvent(appError);
          throw new Error('Referenced structure in app.init does not exist: ' + structure);
        }
      } else {
        type = type || 'slideshow';
      }
      query = window.location.search;
      if (query) {
        arr = query.split('=');
        if (arr[0] === '?path') {
          path = arr[1].match(/^(\w+\.?\w*\.?\w*)/)[1];
          linkArr = path.split('.');
          name = linkArr[0];
          content = linkArr[1] || '';
          subcontent = linkArr[2] || '';
        } else if (arr[0] === '?slide') {
          this.show(arr[1]);
          return;
        }
      }
      this.goTo(structure, content, subcontent);
    };

    Presentation.prototype.add = function(name, content, type) {
      type = type || 'slideshow';
      if (type === 'slideshow') {
        this.slideshowIds.push(name);
        this.slides[name] = content;
      } else {
        this.collectionIds.push(name);
        this.sections[name] = content;
      }
      this.register(name, content, type);
    };

    Presentation.prototype.addEvent = function(type, callback, ele) {
      var currentSlide, eventInstance, src, _base, _ref;
      currentSlide = app.slideshow.current;
      src = ele || document;
      eventInstance = [type, callback, src];
      if ((_ref = (_base = this.savedEvents)[currentSlide]) == null) {
        _base[currentSlide] = [];
      }
      this.savedEvents[currentSlide].eventInstance;
      this.savedEvents[currentSlide].push(eventInstance);
      src.addEventListener(type, callback);
    };

    Presentation.prototype.removeEvents = function(slideName) {
      var currentSlide, event, _i, _len, _ref;
      currentSlide = slideName || this.slideshow.current;
      if (this.savedEvents[currentSlide]) {
        _ref = this.savedEvents[currentSlide];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          event = _ref[_i];
          event[2].removeEventListener(event[0], event[1]);
        }
      }
      delete this.savedEvents[currentSlide];
    };

    Presentation.prototype.removeElements = function(slideName) {
      var currentSlide, ele, elements, _results;
      currentSlide = slideName || this.slideshow.current;
      elements = app.slide[currentSlide].element;
      if (elements) {
        _results = [];
        for (ele in elements) {
          _results.push(elements[ele] = null);
        }
        return _results;
      }
    };

    Presentation.prototype.register = function(name, content, type) {
      type = type || 'slideshow';
      if (type === 'slideshow') {
        this.slideshows[name] = new Slideshow(name, content);
      } else {
        this.collections[name] = new Collection(name, content);
      }
    };

    Presentation.prototype.unregister = function(name, type) {
      type = type || 'slideshow';
      if (type === 'slideshow') {
        delete this.slides[name];
      } else {
        delete this.sections[name];
      }
    };

    Presentation.prototype.load = function(name, skipScroll) {
      var evt, type;
      evt = slideshowLoad;
      type = __indexOf.call(this.slideshowIds, name) >= 0 ? 'slideshow' : 'collection';
      if (this.loaded) {
        this.unLoad();
      }
      if (type === 'slideshow') {
        this.slideshow = this.loaded = this.slideshows[name];
        this.slideshow.parent = null;
        this.collection = null;
        this.loaded.onLoad();
      } else {
        evt = collectionLoad;
        this.collection = this.loaded = this.collections[name];
        this.slideshow = null;
        this.loaded.onLoad();
        this.setCurrent(this.collection.content[0]);
        this.insertSections(this.collection.content, this.collection.ele);
      }
      this.elements.presentation.setAttribute('class', name);
      this.insert(this.loaded);
      this.getSlides();
      this.loaded.ele.dispatchEvent(evt);
      this.loaded.ele.dispatchEvent(contentLoad);
      if (!skipScroll) {
        if (type === 'collection') {
          this.slideshow.ele.dispatchEvent(sectionEnter);
        }
        this.slideshow.scrollTo(0);
      }
    };

    Presentation.prototype.unLoad = function() {
      var evt, type;
      type = this.loaded.constructor.name;
      evt = type === 'Slideshow' ? slideshowUnload : collectionUnload;
      this.loaded.ele.dispatchEvent(evt);
      this.loaded.ele.dispatchEvent(contentUnload);
      this.loaded.onUnload();
      this.remove(this.loaded);
    };

    Presentation.prototype.insert = function(slideshow, container) {
      container = container || this.elements.slideshows;
      container.appendChild(slideshow.ele);
    };

    Presentation.prototype.insertSections = function(sections, container) {
      var missing_structure, slideshow, ss, _i, _len;
      for (_i = 0, _len = sections.length; _i < _len; _i++) {
        slideshow = sections[_i];
        ss = this.slideshows[slideshow];
        if (ss) {
          ss.direction = 'vertical';
          ss.parent = this.loaded;
          this.slideshows[slideshow].onLoad();
          this.insert(this.slideshows[slideshow], this.loaded.ele);
        } else {
          missing_structure = new View({
            template: 'missing_structure',
            structure_id: slideshow
          });
          this.elements.slideshows.innerHTML = missing_structure.markup;
          d.dispatchEvent(appError);
          throw new Error('Referenced section is not a slideshow: ' + slideshow);
        }
      }
    };

    Presentation.prototype.remove = function(slideshow, container) {
      container = container || this.elements.slideshows;
      container.removeChild(slideshow.ele);
    };

    Presentation.prototype.getData = function(path, callback) {
      var xhr,
        _this = this;
      xhr = new XMLHttpRequest();
      xhr.open('GET', path, false);
      xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.status !== 0 && xhr.status !== 200) {
          if (xhr.status === 400) {
            console.log("Could not locate " + path);
          } else {
            console.error("app.getData " + path + " HTTP error: " + xhr.status);
          }
          return;
        }
        return callback(JSON.parse(xhr.responseText));
      };
      xhr.send();
    };

    Presentation.prototype.getHtml = function(name, path, callback) {
      var xhr,
        _this = this;
      if (path == null) {
        path = this.pathToSlides;
      }
      path = path + name + '.html';
      xhr = new XMLHttpRequest();
      xhr.open('GET', path, false);
      xhr.onreadystatechange = function() {
        var missing_slide;
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.status !== 0 && xhr.status !== 200) {
          if (xhr.status === 400) {
            console.log("Could not locate " + path);
          } else {
            missing_slide = new View({
              template: 'missing_slide',
              slide_id: name
            });
            callback(missing_slide.markup);
            return d.dispatchEvent(appError);
          }
        } else {
          return callback(xhr.responseText);
        }
      };
      xhr.send();
    };

    Presentation.prototype.getPath = function() {
      var parent, path;
      path = '/';
      path += this.currentSlide;
      parent = this.slide[this.currentSlide].parent;
      if (parent) {
        path = '/' + parent.id + path;
        while (parent = parent.parent) {
          path = '/' + parent.id + path;
        }
      }
      return path;
    };

    Presentation.prototype.getAllSlides = function() {
      var addEmptyFunctions, arr, name, slide, slideMethods, _i, _len, _ref;
      this.allSlides = [];
      this.slide = {};
      slideMethods = ['onEnter', 'onExit'];
      addEmptyFunctions = function(slide) {
        var method, _i, _len, _results;
        app.slide[slide] = {};
        _results = [];
        for (_i = 0, _len = slideMethods.length; _i < _len; _i++) {
          method = slideMethods[_i];
          _results.push(app.slide[slide][method] = function() {});
        }
        return _results;
      };
      _ref = this.slides;
      for (name in _ref) {
        arr = _ref[name];
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
          slide = arr[_i];
          if (__indexOf.call(this.allSlides, slide) < 0) {
            this.allSlides.push(slide);
            addEmptyFunctions(slide);
          }
        }
      }
    };

    Presentation.prototype.getElements = function() {
      var eleId, globals, _i, _len;
      globals = this.config.globalElements;
      this.elements = this.elements || {};
      this.elements.presentation = d.getElementById('presentation');
      this.elements.slideshows = d.getElementById('slideshows');
      if (globals) {
        for (_i = 0, _len = globals.length; _i < _len; _i++) {
          eleId = globals[_i];
          this.elements[eleId] = d.getElementById(eleId);
        }
      }
    };

    Presentation.prototype.getSlides = function() {
      var slide, slides, _i, _len;
      this.slideElements = {};
      slides = d.querySelectorAll('.slide');
      for (_i = 0, _len = slides.length; _i < _len; _i++) {
        slide = slides[_i];
        this.slideElements[slide.id] = slide;
      }
    };

    Presentation.prototype.getSlideElements = function(slideName, ele) {
      var el, elements, slideObj, value, _results;
      slideObj = app.slide[slideName];
      slideObj.element = {};
      elements = slideObj.elements;
      if (elements) {
        _results = [];
        for (el in elements) {
          value = elements[el];
          if (typeof value === 'string') {
            _results.push(slideObj.element[el] = ele.querySelector(value));
          } else {
            if (value[1] === 'all') {
              _results.push(slideObj.element[el] = ele.querySelectorAll(value[0]));
            } else {
              _results.push(slideObj.element[el] = ele.querySelector(value[0]));
            }
          }
        }
        return _results;
      }
    };

    Presentation.prototype.goTo = function(name, content, subcontent) {
      var skipScroll, type, _ref, _ref1;
      type = __indexOf.call(this.slideshowIds, name) >= 0 ? 'slideshow' : 'collection';
      skipScroll = false;
      if (type === 'slideshow') {
        if (name !== ((_ref = this.slideshow) != null ? _ref.id : void 0)) {
          skipScroll = true;
          this.load(name, skipScroll);
        }
        if (!content || this.slideshow.content[0] === content) {
          this.slideshow.scrollTo(0);
        } else {
          this.slideshow.scrollTo(content, skipScroll);
        }
      } else {
        if (name !== ((_ref1 = this.collection) != null ? _ref1.id : void 0)) {
          skipScroll = true;
          this.load(name, skipScroll);
        }
        if (content) {
          if (content !== this.collection.current) {
            this.collection.scrollTo(content, skipScroll);
          }
          if (subcontent && subcontent !== this.slideshow.current) {
            this.slideshow.scrollTo(subcontent, skipScroll);
          }
        } else {
          this.collection.scrollTo(0, skipScroll);
        }
      }
    };

    Presentation.prototype.show = function(content) {
      var arr;
      arr = [];
      if (typeof content === 'string') {
        arr[0] = content;
      } else {
        arr = content;
      }
      app.add('temp', arr);
      app.load('temp');
    };

    Presentation.prototype.setCurrent = function(name) {
      this.slideshow = this.slideshows[name];
    };

    Presentation.prototype.template = function(str, data) {
      var p;
      for (p in data) {
        str = str.replace(new RegExp('{' + p + '}', 'g'), data[p]);
      }
      return str;
    };

    return Presentation;

  })();

  window.Slideshow = Slideshow = (function() {

    function Slideshow(id, content, config) {
      this.id = id;
      this.content = content;
      this.config = config != null ? config : {};
      this.type = 'slideshow';
      this.direction = this.config.direction || 'horizontal';
      this.currentIndex = 0;
      this.inline = {};
      this.embedded = [];
      this.markup = '';
    }

    Slideshow.prototype._createElement = function(inline) {
      var classes, section;
      classes = inline ? 'inline-slideshow' : 'slideshow';
      section = document.createElement('section');
      section.setAttribute('id', this.id + 'Container');
      section.setAttribute('class', classes);
      this.ele = section;
    };

    Slideshow.prototype._createMarkup = function() {
      var append, file, obj, prepend, slide, _i, _j, _len, _len1, _ref, _ref1,
        _this = this;
      prepend = app.wrapSlides ? '<div class="slideWrap">' : '';
      append = app.wrapSlides ? '</div>' : '';
      if (app.type === 'json') {
        _ref = this.content;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          slide = _ref[_i];
          obj = app.json.slides[slide];
          app.slide[slide].parent = this;
          if (obj) {
            file = obj.file;
            slide = file.split('.')[0];
          }
          app.getHtml(slide, app.pathToSlides, function(str) {
            return _this.markup += prepend + str + append;
          });
        }
      } else {
        _ref1 = this.content;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          slide = _ref1[_j];
          app.getHtml(slide, app.pathToSlides, function(str) {
            return _this.markup += prepend + str + append;
          });
        }
      }
    };

    Slideshow.prototype._destroyElement = function() {
      this.ele = null;
    };

    Slideshow.prototype._isValid = function(name) {
      return __indexOf.call(this.content, name) >= 0;
    };

    Slideshow.prototype._reset = function() {
      this.direction = 'horizontal';
      this.current = this.content[0];
      this.currentIndex = 0;
      this.length = this.content.length;
      this.markup = '';
    };

    Slideshow.prototype._scroll = function(nr, skipExit) {
      var currentSlide, previous, slide, x, y;
      skipExit = skipExit || false;
      slide = app.slideElements[this.content[nr]];
      previous = app.slideElements[this.current];
      x = 0;
      y = 0;
      if (previous === slide) {
        skipExit = true;
      }
      if (this.direction === 'horizontal') {
        x = nr * -app.dimensions[0];
      } else {
        y = nr * -app.dimensions[1];
      }
      if (!skipExit) {
        this.removeEmbedded();
        previous.dispatchEvent(slideExit);
        app.slide[this.current].onExit(previous);
        app.removeEvents(previous.id);
        app.removeElements(previous.id);
      }
      this.ele.style.cssText += '-webkit-transform:translate3d(' + x + 'px, ' + y + 'px, 0px);';
      this._setCurrent(nr);
      currentSlide = app.slide[this.current];
      currentSlide.ele = slide;
      slide.dispatchEvent(slideEnter);
      app.getSlideElements(this.current, slide);
      setTimeout(function(){currentSlide.onEnter(slide);}, 100);
    };

    Slideshow.prototype._setCurrent = function(content) {
      var type;
      type = typeof content;
      if (type === 'string') {
        this.current = content;
        this.currentIndex = this.getIndex(content);
      } else if ('number') {
        this.current = this.content[content];
        this.currentIndex = content;
      }
    };

    Slideshow.prototype._setMeasurements = function() {
      if (this.direction === 'horizontal') {
        this.width = app.dimensions[0] * this.length;
      } else {
        this.width = app.dimensions[0];
      }
    };

    Slideshow.prototype.embed = function(slideshowId, container, scroll) {
      var scroller, slide, slides, slideshow, _i, _len;
      if (scroll == null) {
        scroll = true;
      }
      if (container) {
        slideshow = app.slideshows[slideshowId];
        scroller = scroll ? new InlineScroller(container, slideshow) : '';
        slideshow.onLoad(true);
        slideshow.parent = this;
        app.insert(slideshow, container);
        this.inline[slideshowId] = slideshow;
        this.inline[slideshowId].scroller = scroller;
        this.embedded.push({
          slideshow: slideshowId,
          container: container
        });
        slides = slideshow.ele.querySelectorAll('.slide');
        for (_i = 0, _len = slides.length; _i < _len; _i++) {
          slide = slides[_i];
          app.slideElements[slide.id] = slide;
        }
        this.inline[slideshowId].scrollTo(0);
      } else {
        throw new Error('Missin container parameter in call to app.embed');
      }
    };

    Slideshow.prototype.removeEmbedded = function() {
      var ele, embed, slide, _i, _len, _ref;
      _ref = this.embedded;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        embed = _ref[_i];
        slide = this.inline[embed.slideshow].current;
        ele = app.slideElements[slide];
        this.inline[embed.slideshow].onUnload();
        this.inline[embed.slideshow].scroller = null;
        app.removeEvents(slide);
        app.removeElements(slide);
        embed.container.innerHTML = '';
        delete this.inline[embed.slideshow];
      }
      this.embedded = [];
    };

    Slideshow.prototype.get = function(name) {
      if (name) {
        return document.getElementById(name);
      } else {
        return document.getElementById(this.current);
      }
    };

    Slideshow.prototype.getIndex = function(name) {
      if (name && this._isValid(name)) {
        return this.content.indexOf(name);
      } else {
        return this.content.indexOf(this.current);
      }
    };

    Slideshow.prototype.onLoad = function(inline) {
      this.current = this.content[0];
      this.length = this.content.length;
      this._setMeasurements();
      this._createElement(inline);
      this._createMarkup();
      this.ele.style.cssText = "width:" + this.width + "px;-webkit-transform:translate3d(0px, 0px, 0px);";
      return this.ele.innerHTML = this.markup;
    };

    Slideshow.prototype.onUnload = function() {
      var previous;
      previous = app.slideElements[this.current];
      previous.dispatchEvent(slideExit);
      app.slide[this.current].onExit(previous);
      this._reset();
    };

    Slideshow.prototype.next = function() {
      if (this.currentIndex < this.length - 1) {
        this._scroll(this.currentIndex + 1);
      }
    };

    Slideshow.prototype.previous = function() {
      if (this.currentIndex > 0) {
        this._scroll(this.currentIndex - 1);
      }
    };

    Slideshow.prototype.scrollTo = function(content, skipExit) {
      var order, type;
      skipExit = skipExit || false;
      type = typeof content;
      if (type === 'string') {
        order = this.getIndex(content);
        this._scroll(order, skipExit);
      } else if ('number') {
        order = Math.abs(content);
        this._scroll(order, skipExit);
      }
    };

    Slideshow.prototype.scrollToEnd = function() {
      this._scroll(this.length - 1);
    };

    Slideshow.prototype.scrollToStart = function() {
      this._scroll(0);
    };

    return Slideshow;

  })();

  window.Collection = Collection = (function(_super) {

    __extends(Collection, _super);

    function Collection() {
      return Collection.__super__.constructor.apply(this, arguments);
    }

    Collection.prototype._resetSection = function() {
      var ss;
      ss = app.slideshow;
      return setTimeout(function() {
        ss.ele.style.cssText += '-webkit-transform:translate3d(0px, 0px, 0px);';
        return ss._setCurrent(0);
      }, 600);
    };

    Collection.prototype._scroll = function(nr, skipExit) {
      var collection, currentSlide, nextSlide, previous, x, y;
      skipExit = skipExit || false;
      collection = app.slideshows[this.content[nr]];
      previous = app.slideshows[this.current];
      nextSlide = app.slideElements[collection.content[0]];
      currentSlide = app.slideElements[previous.current];
      x = 0;
      y = 0;
      if (this.direction === 'horizontal') {
        x = nr * -app.dimensions[0];
      } else {
        y = nr * -app.dimensions[1];
      }
      if (!skipExit) {
        previous.removeEmbedded();
        previous.ele.dispatchEvent(sectionExit);
        currentSlide.dispatchEvent(slideExit);
        app.slide[currentSlide.id].onExit(currentSlide);
        app.removeEvents(currentSlide.id);
        app.removeElements(currentSlide.id);
      }
      this.ele.style.cssText += '-webkit-transform:translate3d(' + x + 'px, ' + y + 'px, 0px);';
      this._resetSection();
      this._setCurrent(nr);
      app.setCurrent(this.current);
      collection.ele.dispatchEvent(sectionEnter);
      nextSlide.dispatchEvent(slideEnter);
      app.getSlideElements(nextSlide.id, nextSlide);
      return app.slide[nextSlide.id].onEnter(nextSlide);
    };

    Collection.prototype.onLoad = function() {
      this.type = 'collection';
      this.current = this.content[0];
      this.length = this.content.length;
      this._setMeasurements();
      this._createElement();
      this.ele.style.cssText = "width:" + this.width + "px;-webkit-transform:translate3d(0px, 0px, 0px);";
      return this.ele.setAttribute('class', 'collection');
    };

    Collection.prototype.onUnload = function() {
      var collection, currentSlide, section, _i, _len, _ref, _results;
      collection = app.slideshows[this.current];
      currentSlide = app.slideElements[collection.content[0]];
      currentSlide.dispatchEvent(slideExit);
      app.slide[currentSlide.id].onExit(currentSlide);
      collection.ele.dispatchEvent(sectionExit);
      this._reset();
      _ref = this.content;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        _results.push(app.slideshows[section]._reset());
      }
      return _results;
    };

    Collection.prototype.get = function(name) {
      if (name) {
        return document.getElementById(name + 'Container');
      } else {
        return document.getElementById(this.current + 'Container');
      }
    };

    return Collection;

  })(Slideshow);

  d = document;

  window.Slidescroller = Slidescroller = (function() {

    function Slidescroller(id) {
      this.id = id;
      this._down = __bind(this._down, this);

      this._up = __bind(this._up, this);

      this._previous = __bind(this._previous, this);

      this._next = __bind(this._next, this);

      this.ele = app.elements.presentation;
      this.type = 'slideshow';
      this.actions = {
        left: this._next,
        right: this._previous,
        up: this._up,
        down: this._down
      };
      this._connect();
    }

    Slidescroller.prototype._connect = function() {
      var _this = this;
      d.addEventListener('contentLoad', function() {
        if (_this.id === app.loaded.id) {
          _this.ele = d.getElementById(_this.id);
        }
        _this.type = app.loaded.type;
        return _this._actionSetup;
      });
      this.enableAll();
    };

    Slidescroller.prototype._actionSetup = function() {
      if (this.type === 'slideshow') {
        this._next = this._nextSlide;
        return this._previous = this._previousSlide;
      } else {
        this._next = this._nextSection;
        this._previous = this._previousSection;
        this._up = this._nextSlide;
        return this._down = this._previousSlide;
      }
    };

    Slidescroller.prototype._next = function(event) {
      if (this.type === 'slideshow') {
        this._nextSlide(event);
      } else {
        this._nextSection(event);
      }
    };

    Slidescroller.prototype._previous = function(event) {
      if (this.type === 'slideshow') {
        this._previousSlide(event);
      } else {
        this._previousSection(event);
      }
    };

    Slidescroller.prototype._up = function(event) {
      if (this.type === 'collection') {
        this._nextSlide(event);
      }
    };

    Slidescroller.prototype._down = function(event) {
      if (this.type === 'collection') {
        this._previousSlide(event);
      }
    };

    Slidescroller.prototype._addSwipeListener = function(eventName) {
      this.ele.addEventListener(eventName, this.events[eventName]);
    };

    Slidescroller.prototype._nextSection = function(event) {
      app.collection.next();
    };

    Slidescroller.prototype._nextSlide = function(event) {
      app.slideshow.next();
    };

    Slidescroller.prototype._previousSection = function(event) {
      app.collection.previous();
    };

    Slidescroller.prototype._previousSlide = function(event) {
      app.slideshow.previous();
    };

    Slidescroller.prototype._nextInline = function(event) {
      touchy.stop(event);
      app.inline.next();
    };

    Slidescroller.prototype._previousInline = function(event) {
      touchy.stop(event);
      app.inline.previous();
    };

    Slidescroller.prototype.disable = function(dir) {
      this.ele.removeEventListener('swipe' + dir, this.actions[dir]);
    };

    Slidescroller.prototype.disableAll = function() {
      this.ele.removeEventListener('swipeleft', this._next);
      this.ele.removeEventListener('swiperight', this._previous);
      this.ele.removeEventListener('swipeup', this._up);
      this.ele.removeEventListener('swipedown', this._down);
    };

    Slidescroller.prototype.enable = function(dir) {
      this.ele.addEventListener('swipe' + dir, this.actions[dir]);
    };

    Slidescroller.prototype.enableAll = function() {
      this.ele.addEventListener('swipeleft', this._next);
      this.ele.addEventListener('swiperight', this._previous);
      this.ele.addEventListener('swipeup', this._up);
      this.ele.addEventListener('swipedown', this._down);
    };

    Slidescroller.prototype.enableInline = function() {
      app.inline.ele.addEventListener('swipeleft', this._nextInline);
      app.inline.ele.addEventListener('swiperight', this._previousInline);
    };

    Slidescroller.prototype.disableInline = function() {
      app.inline.ele.removeEventListener('swipeleft', this._nextInline);
      app.inline.ele.removeEventListener('swiperight', this._previousInline);
    };

    return Slidescroller;

  })();

  d = document;

  window.InlineScroller = InlineScroller = (function(_super) {

    __extends(InlineScroller, _super);

    function InlineScroller(ele, structure) {
      this.ele = ele;
      this.structure = structure;
      this._previous = __bind(this._previous, this);

      this._next = __bind(this._next, this);

      this.actions = {
        left: this._next,
        right: this._previous
      };
      this._connect();
    }

    InlineScroller.prototype._connect = function() {
      this.enableAll();
    };

    InlineScroller.prototype._next = function(event) {
      touchy.stop(event);
      this.structure.next();
    };

    InlineScroller.prototype._previous = function(event) {
      touchy.stop(event);
      this.structure.previous();
    };

    InlineScroller.prototype.disable = function(dir) {
      this.ele.removeEventListener('swipe' + dir, this.actions[dir]);
    };

    InlineScroller.prototype.disableAll = function() {
      this.ele.removeEventListener('swipeleft', this._next);
      this.ele.removeEventListener('swiperight', this._previous);
    };

    InlineScroller.prototype.enable = function(dir) {
      this.ele.addEventListener('swipe' + dir, this.actions[dir]);
    };

    InlineScroller.prototype.enableAll = function() {
      this.ele.addEventListener('swipeleft', this._next);
      this.ele.addEventListener('swiperight', this._previous);
    };

    return InlineScroller;

  })(Slidescroller);

  window.View = View = (function() {

    function View(config) {
      var name, path, template;
      this.config = config != null ? config : {};
      this.markup = '';
      template = this.config.template || null;
      path = this.config.path || '_framework/templates/';
      name = this.config.name || null;
      if (template) {
        return View.template[template](this.config);
      } else if (name) {
        return this.compile(name, path);
      }
    }

    View.prototype.compile = function(name, path) {
      var blueprint, output, template_data;
      blueprint = '';
      app.getHtml(name, path, function(data) {
        return blueprint = data;
      });
      output = app.template(blueprint, this.config.data);
      template_data = {
        markup: output
      };
      return template_data;
    };

    return View;

  })();

  View.template = {
    missing_slide: function(config) {
      var blueprint, output, template_data;
      blueprint = '';
      app.getHtml('error_missing_slide', '_framework/templates/', function(data) {
        return blueprint = data;
      });
      output = app.template(blueprint, {
        slide_id: config.slide_id
      });
      template_data = {
        name: 'Missing slide: ' + config.slide_id,
        markup: output
      };
      return template_data;
    },
    missing_structure: function(config) {
      var blueprint, output, template_data;
      blueprint = '';
      app.getHtml('error_missing_structure', '_framework/templates/', function(data) {
        return blueprint = data;
      });
      output = app.template(blueprint, {
        structure_id: config.structure_id
      });
      template_data = {
        name: 'Missing structure: ' + config.structure_id,
        markup: output
      };
      return template_data;
    }
  };

  window.MemoryManager = MemoryManager = (function() {

    function MemoryManager(name, config) {
      this.name = name;
      this.config = config != null ? config : {};
      this._connect();
    }

    MemoryManager.prototype._connect = function() {
      document.addEventListener('slideEnter', function(event) {
        return util.addClass(event.target('active test'));
      });
      return document.addEventListener('slideExit', function(event) {
        return setTimeout(function() {
          return util.removeClass(event.target('active'));
        }, 600);
      });
    };

    return MemoryManager;

  })();

  window.AutoMenu = AutoMenu = (function() {

    function AutoMenu(config) {
      this._setCurrent = __bind(this._setCurrent, this);
      this.config = config || {};
      this.offset = this.config.offset || 0;
      this.offsetLinks = this.config.offsetLinks || null;
      this.append = this.config.append || null;
      this.prepend = this.config.prepend || null;
      this.linksConfig = this.config.links || {};
      this.linkIds = null;
      this.attachTo = this.config.attachTo || [];
      this.content = this.config.content || null;
      this.ele = document.getElementById('mainMenu');
      this.orientation = this.config.orientation || 'horizontal';
      this.initialized = false;
      this.singleContent = false;
      if (this.attachTo) {
        this._init();
      }
    }

    AutoMenu.prototype._init = function() {
      var _this = this;
      document.addEventListener('contentLoad', function() {
        var _ref;
        if (_ref = app.loaded.id, __indexOf.call(_this.attachTo, _ref) >= 0) {
          _this.singleContent = true;
          return _this._load();
        } else if (_this.attachTo === 'storyboard' || _this.content) {
          _this.structurePath = app.json.structures;
          return _this._load();
        }
      });
      return document.addEventListener('contentUnload', function() {
        if (_this.attachTo.indexOf(app.loaded.id > -1)) {
          _this._remove();
          if (_this.contentType === 'slideshow') {
            return document.removeEventListener('slideEnter', self._setCurrent);
          } else {
            return document.removeEventListener('sectionEnter', self._setCurrent);
          }
        }
      });
    };

    AutoMenu.prototype._load = function() {
      this.ele.addEventListener('swipeleft', touchy.stop);
      this.ele.addEventListener('swiperight', touchy.stop);
      this.ele.addEventListener('swipeup', touchy.stop);
      this.ele.addEventListener('swipedown', touchy.stop);
      if (this.singleContent) {
        this.contentType = app.loaded.type;
        this.linkIds = app[this.contentType].content;
        if (this.contentType === 'collection') {
          document.addEventListener('sectionEnter', this._setCurrent);
          this.structurePath = app.json.structures;
        } else {
          document.addEventListener('slideEnter', this._setCurrent);
          this.structurePath = app.json.slides;
        }
      } else {
        this.linkIds = this.content || app.json.storyboard;
        document.addEventListener('contentLoad', this._setCurrent);
      }
      if (!this.initialized) {
        this._build();
      }
      this._insert();
      this._connect();
      return this._setCurrent();
    };

    AutoMenu.prototype._build = function() {
      var aClass, aLink, classname, link, linkConfig, markup, name, pClass, pLink, skip, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      markup = '';
      if (this.prepend) {
        _ref = this.prepend;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          pLink = _ref[_i];
          pClass = pLink.classname || '';
          markup += "<li data-link='" + pLink.goTo + "' class='" + pClass + "'>" + pLink.title + "</li>";
        }
      }
      _ref1 = this.linkIds;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        link = _ref1[_j];
        linkConfig = this.linksConfig[link];
        name = this.structurePath[link].name;
        if (this.singleContent) {
          link = "" + app.loaded.id + "." + link;
        }
        classname = '';
        if (linkConfig) {
          skip = linkConfig.skip || false;
          name = linkConfig.title || name;
          classname = linkConfig.classname || '';
        }
        if (!skip) {
          markup += "<li data-link='" + link + "' class='" + classname + "'>" + name + "</li>";
        }
      }
      if (this.append) {
        _ref2 = this.append;
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          aLink = _ref2[_k];
          aClass = aLink.classname || '';
          markup += "<li data-link='" + aLink.goTo + "' class='" + aClass + "'>" + aLink.title + "</li>";
        }
      }
      return this.markup = markup;
    };

    AutoMenu.prototype._insert = function() {
      var classes, count, list, offset, scrollLimit,
        _this = this;
      list = document.createElement('ul');
      classes = 'menu';
      if (this.orientation === 'vertical') {
        classes += ' vert-menu';
      }
      scrollLimit = 0;
      list.id = app.loaded.id + 'Menu';
      list.setAttribute('class', classes);
      list.innerHTML = this.markup;
      this.ele.appendChild(list);
      this.list = list;
      this._getWidth();
      if (this.orientation === 'horizontal') {
        scrollLimit = app.dimensions[0] - this.menuWidth;
        this.scroller = new Draggy(list.id, {
          restrictY: true,
          limitsX: [scrollLimit, 0],
          onChange: function(x, y) {
            return _this.offset = x;
          }
        });
      }
      if (this.offsetLinks) {
        this.config.offset = 0;
        count = -1;
        while ((count += 1) <= this.offsetLinks - 1) {
          this.config.offset += parseInt(this.linkWidths[count]);
        }
        this.config.offset = this.config.offset * -1;
        offset = this.config.offset;
      } else {
        offset = this.offset;
      }
      if (this.orientation === 'horizontal') {
        return this.scroller.moveTo(offset, 0);
      }
    };

    AutoMenu.prototype._remove = function() {
      this.ele.removeEventListener('tap', this._navigate);
      return this.ele.innerHTML = '';
    };

    AutoMenu.prototype._getWidth = function() {
      var link, links, width, _i, _len, _results;
      links = this.ele.querySelectorAll('li');
      this.menuWidth = 0;
      this.linkWidths = [];
      _results = [];
      for (_i = 0, _len = links.length; _i < _len; _i++) {
        link = links[_i];
        width = link.getBoundingClientRect().width;
        this.menuWidth += width;
        _results.push(this.linkWidths.push(width));
      }
      return _results;
    };

    AutoMenu.prototype._navigate = function(event) {
      var attr, content, ele, linkArr, name, prev, subcontent;
      ele = event.target;
      if (ele.nodeType === 3) {
        ele = ele.parentNode;
      }
      prev = this.querySelector('.selected');
      attr = ele.getAttribute('data-link');
      if (attr) {
        if (prev) {
          util.removeClass(prev, 'selected');
        }
        linkArr = attr.split('.');
        name = linkArr[0];
        content = linkArr[1] || '';
        subcontent = linkArr[2] || '';
        util.addClass(ele, 'selected');
        if (name === 'app') {
          return eval(attr);
        } else {
          return app.goTo(name, content, subcontent);
        }
      }
    };

    AutoMenu.prototype._connect = function() {
      return this.ele.addEventListener('tap', this._navigate);
    };

    AutoMenu.prototype._setCurrent = function() {
      var absOffset, appWidth, content, defaultOffset, link, pos, prev, query, realPos, rightPos, toMove, wd,
        _this = this;
      prev = this.ele.querySelector('.selected');
      content = this.singleContent ? "" + app.loaded.id + "." + app.loaded.current : app.loaded.id;
      query = "[data-link='" + content + "']";
      link = this.ele.querySelector(query);
      if (prev) {
        util.removeClass(prev, 'selected');
      }
      if (link) {
        util.addClass(link, 'selected');
        realPos = util.getPosition(link)[0];
        pos = realPos + this.offset;
        wd = link.getBoundingClientRect().width;
        rightPos = pos + wd;
        toMove = 0;
        defaultOffset = this.config.offset || 0;
        absOffset = Math.abs(defaultOffset);
        appWidth = app.dimensions[0];
        if (rightPos >= appWidth) {
          toMove = (rightPos - appWidth) - this.offset;
          this.list.style.webkitTransitionDuration = '0.5s';
          this.list.style.webkitTransform = 'translate3d(-' + toMove + 'px, 0, 0)';
          this.offset = -toMove;
        } else if (pos < 0) {
          toMove = pos - this.offset;
          this.list.style.webkitTransitionDuration = '0.5s';
          this.list.style.webkitTransform = 'translate3d(-' + toMove + 'px, 0, 0)';
          this.offset = -toMove;
        } else if (rightPos > absOffset && (realPos + wd) < appWidth) {
          toMove = defaultOffset;
          this.list.style.webkitTransitionDuration = '0.5s';
          this.list.style.webkitTransform = 'translate3d(' + toMove + 'px, 0, 0)';
          this.offset = toMove;
        } else if (pos < 0) {
          toMove = currentMenu.offset - pos;
          currentMenu.list.style.webkitTransitionDuration = '0.5s';
          currentMenu.list.style.webkitTransform = 'translate3d(' + toMove + 'px, 0, 0)';
          this.offset = toMove;
        }
        return setTimeout(function() {
          return _this.scroller.moveTo(_this.offset, 0);
        }, 500);
      }
    };

    return AutoMenu;

  })();

  window.debug = function() {
    document.addEventListener('presentationInit', function() {
      console.log("**** Presentation initialized");
      console.log("Registered slideshows:  " + app.slideshowIds);
      console.log("Registered collections: " + app.collectionIds);
      return window["debugger"].init();
    });
    document.addEventListener('slideshowLoad', function() {
      return console.log("**** Slideshow loaded: " + app.slideshow.id);
    });
    document.addEventListener('slideshowUnload', function() {
      return console.log("**** Slideshow unloaded: " + app.slideshow.id);
    });
    document.addEventListener('collectionLoad', function() {
      return console.log("**** Collection loaded: " + app.collection.id);
    });
    document.addEventListener('collectionUnload', function() {
      return console.log("**** Collection unloaded: " + app.collection.id);
    });
    document.addEventListener('inlineSlideshowLoad', function() {
      return console.log("**** Inline slideshow loaded: " + app.inline.id);
    });
    document.addEventListener('inlineSlideshowUnload', function() {
      return console.log("**** Inline slideshow unloaded: " + app.inline.id);
    });
    document.addEventListener('contentLoad', function(event) {
      return console.log("**** New content loaded: " + event.target.id);
    });
    document.addEventListener('contentUnload', function(event) {
      return console.log("**** Content unloaded: " + event.target.id);
    });
    document.addEventListener('slideEnter', function(event) {
      return console.log("---> Slide entered: " + event.target.id);
    });
    document.addEventListener('slideExit', function(event) {
      return console.log("<--- Slide exited: " + event.target.id);
    });
    document.addEventListener('sectionEnter', function() {
      return console.log(">>>> Section entered: " + app.slideshow.id);
    });
    document.addEventListener('sectionExit', function() {
      return console.log("<<<< Section exited: " + app.slideshow.id);
    });
    document.addEventListener('inlineSlideEnter', function() {
      return console.log("---> Inline slide entered: " + app.inline.current);
    });
    return document.addEventListener('inlineSlideExit', function() {
      return console.log("<--- Inline slide exited: " + app.inline.current);
    });
  };

  window["debugger"] = {
    ele: null,
    logs: null,
    isVisible: false,
    markup: '',
    init: function() {
      this.createWindow();
      this.addListeners();
      window.doc = this.doc;
      return window.log = this.log;
    },
    createBox: function() {
      var box;
      box = new View({
        name: 'debug_console'
      });
      return console.log(box);
    },
    createWindow: function() {
      var dragger, header, leftCol, logHeader, rightCol, stateBar;
      this.ele = document.createElement('section');
      header = document.createElement('header');
      stateBar = document.createElement('div');
      this.stateStructure = document.createElement('span');
      this.stateSlide = document.createElement('span');
      leftCol = document.createElement('div');
      rightCol = document.createElement('div');
      logHeader = document.createElement('h4');
      this.logs = document.createElement('div');
      this.ele.id = 'debug';
      header.innerText = 'Debug Console';
      stateBar.className = 'state-bar';
      leftCol.className = 'd-col';
      rightCol.className = 'd-col last-col';
      logHeader.innerText = 'Log output';
      stateBar.appendChild(this.stateStructure);
      stateBar.appendChild(this.stateSlide);
      this.ele.appendChild(header);
      this.ele.appendChild(stateBar);
      document.body.appendChild(this.ele);
      return dragger = new Draggy(this.ele, {});
    },
    addListeners: function() {
      var _this = this;
      document.addEventListener('longTouch', function() {
        if (_this.isVisible) {
          util.removeClass(_this.ele, 'showing');
          return _this.isVisible = false;
        } else {
          util.addClass(_this.ele, 'showing');
          return _this.isVisible = true;
        }
      });
      return document.addEventListener('slideEnter', function() {
        _this.stateStructure.innerText = app.loaded.current;
        return _this.stateSlide.innerText = app.slideshow.current;
      });
    },
    log: function(msg) {
      var logEle;
      logEle = document.createElement('p');
      logEle.innerText = msg;
      return this.logs.appendChild(logEle);
    },
    clearLog: function() {
      return this.logs.innerHTML = '';
    },
    doc: function(name) {
      name = '?' + name || '';
      return window.location.href = '../docs/index.html' + name;
    }
  };

}).call(this);
;HTMLElement.prototype.hasClass = function(c){
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
    return re.test(this.className);
};
HTMLElement.prototype.addClass = function(c){
    if (!this.hasClass(c)) {
		this.className = (this.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
	}
    return this;
};
HTMLElement.prototype.removeClass = function(c){
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
    this.className = this.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
    return this;
};
HTMLElement.prototype.toggleClass = function(c){
	return this.hasClass(c) ? this.removeClass(c) : this.addClass(c);
};
HTMLElement.prototype.appendFirstChild = function(node){
    this.firstChild ? this.insertBefore(node, this.firstChild) : this.appendChild(node);
};
HTMLElement.prototype.exchange = function(refNode){
	var tempParentNode = refNode.parentNode,
		tempBeforeNode = refNode.nextElementSibling;
	this.parentNode.insertBefore(refNode,this);
	if(tempBeforeNode){
		tempParentNode.insertBefore(this,tempBeforeNode);
	}else{
		tempParentNode.appendChild(this);
	}
	return refNode;
};

function extend(Child, Parent){
	var F = function(){};
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
}

function augment(receivingObject, givingObject){
	var i, methodName;
	if(arguments[2]){
		for(i = 2, len = arguments.length; i < len; i++){
			receivingObject.prototype[arguments[i]] = givingObject.prototype[arguments[i]];
		}
	}else{
		for(methodName in givingObject.prototype){
			receivingObject.prototype[methodName] = givingObject.prototype[methodName];
		}
	}
}
augment(NodeList, Array, 'forEach', 'filter', 'slice');
augment(HTMLCollection, Array, 'forEach', 'filter', "slice");;(function(global){

    var Point = function(x,y){
        this.x=parseInt(x);
        this.y=parseInt(y);
    }
    Point.prototype={
        toString:function(){
            return '{x='+this.x+',y='+this.y+'}';
        },
        add:function(p){
            return new Point(this.x+p.x,this.y+p.y);
        },
        sub:function(p){
            return new Point(this.x-p.x,this.y-p.y);
        },
        mult:function(k){
            return new Point(this.x*k,this.y*k);
        },
        negative:function(){
            return new Point(-this.x,-this.y);
        }
    }

    var MathPoint={
        getPointFromEvent:function(e){
            var isTouch = 'ontouchstart' in window;
            return new Point(isTouch?e.changedTouches[0].pageX : e.pageX,isTouch?e.changedTouches[0].pageY : e.pageY);
        },
        getNearIndex:function(arr,val){
            var delta=Math.abs(arr[0]-val);
            var index=0;
            for(var i=0;i<arr.length;i++){
                var temp=Math.abs(arr[i]-val);
                if(temp<delta){
                    delta=temp;
                    index=i;
                }
            }
            return index;
        },
        getNearIndexWithCaptureRadiusPoint:function(arr,radius,val,options){
            if(arr.length==0) return -1;
            var getLength=null;
            if(!options || (options.x && options.y && !options.IsTransformationSpace)){
                getLength=function(p1,p2){return Math.getLength(p1,p2);};
            }else if(options.x && options.y && options.IsTransformationSpace){
                getLength=function(p1,p2){return Math.sqrt(Math.pow(options.x*Math.abs(p1.x-p2.x),2)+Math.pow(options.y*Math.abs(p1.y-p2.y),2)); };
            }else if(options.x){
                getLength=function(p1,p2){return Math.abs(p1.x-p2.x);};
            }else if(options.y){
                getLength=function(p1,p2){return Math.abs(p1.y-p2.y);};
            }

            var delta=getLength(arr[0],val);
            var index=0;
            for(var i=0;i<arr.length;i++){
                var temp=getLength(arr[i],val);
                if(temp<delta){
                    delta=temp;
                    index=i;
                }
            }
            if(delta>radius){
                return -1;
            }
            return index;
        },
        bound:function(min,max,val){
            return Math.max(min,Math.min(max,val));
        },
        boundPoint:function(min,max,val){
            var x=Math.max(min.x,Math.min(max.x,val.x));
            var y=Math.max(min.y,Math.min(max.y,val.y));
            return new Point(x,y);
        },
        getLength:function(p1,p2){
            var dx=p1.x-p2.x;
            var dy=p1.y-p2.y;
            return Math.sqrt(dx*dx+dy*dy);
        },
        isOnRectangle:function(rect,size,p){
            if(rect.x>p.x) return false;
            if(rect.x+size.x<p.x) return false;
            if(rect.y>p.y) return false;
            if(rect.y+size.y<p.y) return false;
            return true
        },
        directCrossing:function(L1P1,L1P2,L2P1,L2P2){
            if(L2P1.x==L2P2.x){
                var temp=L2P1;
                L2P1=L1P1;
                L1P1=temp;
                var temp=L2P2;
                L2P2=L1P2;
                L1P2=temp;
            }
            if(L1P1.x==L1P2.x){
                var k2=(L2P2.y-L2P1.y)/(L2P2.x-L2P1.x);
                var b2=(L2P2.x*L2P1.y-L2P1.x*L2P2.y)/(L2P2.x-L2P1.x);
                var x=L1P1.x;
                var y =x*k2+b2;
                return new Point(x,y);
            }else{
                var k1=(L1P2.y-L1P1.y)/(L1P2.x-L1P1.x);
                var b1=(L1P2.x*L1P1.y-L1P1.x*L1P2.y)/(L1P2.x-L1P1.x);
                var k2=(L2P2.y-L2P1.y)/(L2P2.x-L2P1.x);
                var b2=(L2P2.x*L2P1.y-L2P1.x*L2P2.y)/(L2P2.x-L2P1.x);
                var x=(b1-b2)/(k2-k1);
                var y =x*k1+b1;
                return new Point(x,y);
            }
        },
        boundOnLine:function(LP1,LP2,P){
            var x= MathPoint.bound(Math.min(LP1.x,LP2.x),Math.max(LP1.x,LP2.x),P.x);
            if(x!=P.x){
                var y=(x==LP1.x)?LP1.y:LP2.y;
                P=new Point(x,y);
            }
            var y= MathPoint.bound(Math.min(LP1.y,LP2.y),Math.max(LP1.y,LP2.y),P.y);
            if(y!=P.y){
                var x=(y==LP1.y)?LP1.x:LP2.x;
                P=new Point(x,y);
            }
            return P;
        },
        getPointInLine:function(LP1, LP2,percent){
            var dx = LP2.x - LP1.x;
            var dy = LP2.y - LP1.y;
            return new Point(LP1.x + percent * dx , LP1.y + percent * dy );
        },
        getOffset:function(element,parentToStop,isConsiderTranslate){
            var style = window.getComputedStyle(element);
            var x = parseInt(style.marginLeft);
            if(x=="NaN"){x=0;}
            var y = parseInt(style.marginTop);
            if(y=="NaN"){y=0;}
            var offset=new Point(-x,-y);
            while(!!element && element!==parentToStop){
                (element.offsetLeft||element.offsetTop) && (offset=offset.add(new Point(element.offsetLeft,element.offsetTop)));
                if(isConsiderTranslate){
                    var transform,style=window.getComputedStyle(element);
                    if(style && (transform = style["-webkit-transform"])){
                        var x=0,y=0,arrVAlMatrix;
                        if(/matrix3d/.test(transform)){
                            arrVAlMatrix=transform.match(/[-]?\d+/g);
                            x=parseInt(arrVAlMatrix[13]);
                            y=parseInt(arrVAlMatrix[14]);
                        }else if(/matrix/.test(transform)){
                            arrVAlMatrix=transform.match(/[-]?\d+/g);
                            x=parseInt(arrVAlMatrix[4]);
                            y=parseInt(arrVAlMatrix[5]);
                        }
                    }
                    ( x || y ) && (offset=offset.add(new Point(x,y)));
                }
                element = element.parentNode;
            }
            return offset;
        }
    };
    
    global.Point = Point;
    global.MathPoint = MathPoint;
})(window);;/**
 * AGNITIO FRAMEWORK MODULE - Analytics
 * This module will automatically log slide data to the Agnitio Analyzer.
 * It will look for the slide name in two places (not looking further when found):
 * - a global JavaScript object named monitormap,
 * - the actual slide id.
 * @author - Stefan Liden, sli@agnitio.com
 */
 document.addEventListener('presentationInit', function() {

  function sendDefaults (version) {
    // Send some default analytics
    if (app.type === 'json') {
      ag.submit.structure("Default structure", JSON.stringify(app.json.structures));
    }
    if (app.version) {
      ag.submit.data({
        unique: true,
        categoryId: "ag-001",
        category: "Versions",
        labelId: "ag-001-002",
        label: "Framework version",
        value: app.version
      });
    }
    if (version) {
      ag.submit.data({
        unique: true,
        categoryId: "ag-001",
        category: "Versions",
        labelId: "ag-001-003",
        label: "Presentation version",
        value: version
      });
    }
  }

  app.analytics = (function () {
	
    var map = null,
        version = null,
        excludedContent = [],
        excluded = [],
        offsetChapter = 0;
	
    /**
     * Initialize analytics
     * @public
     * @param config OBJECT Configure the analytics
     *  -map OBJECT Map to translate ids to custom strings
     *  -offsetChapters INT Number of path items to offset to get chapter
     *  -excludeContent ARRAY List of content that should not be included
     *  -excludeSlides ARRAY List of slides to exclude from analytics
     */
    function init (config) {
		
      if (window.ag) {
        config = config || {};
        map = config.map || null;
        version = config.version || null;
        offsetChapter = config.offsetChapters || 0;
        excludedContent = config.excludeContent || [];
        excluded = config.excludeSlides || [];
        sendDefaults(version);
        log(excludedContent);
      }
      else {
        throw new Error('The Agnitio Content API is required to collect analytic data');
      }
    }

    /**
     * Save chapter/subchapter/slide to Analyzer
     * @private
     */
    function save () {
      var sPath = app.getPath(),
          path = sPath.split('/'),
          ln = path.length,
          sIndex = app.slideshow.currentIndex + 1,
          offset = offsetChapter,
          lnOffset = ln - offset,
          chapter = subchapter = null,
          mChapterId, mChapterName, mSubchapterId, mSubchapterName, mSlideId, mSlideName,
          slide = path[ln - 1];

      // If slide has been excluded, then skip.
      if (excluded.indexOf(slide) !== -1) {
        return;
      }

      // Full path: chapter/subchapter/slide
      if (lnOffset >= 3) {
        chapter = path[1 + offset];
        // Chapter only: chapter/slide
        if (lnOffset >= 4) {
          subchapter = path[2 + offset];
        }
      }
      // console.log(chapter + ' ' + subchapter + ' ' + slide);

      mChapterId = chapter;
      mChapterName = chapter;
      mSubchapterId = subchapter;
      mSubchapterName = subchapter;
      mSlideId = slide;
      mSlideName = slide;

      // If a map exist, use that to get proper ids and names
      if (map) {
        mChapterId = map[chapter].id || chapter;
        mChapterName = map[chapter].name || chapter;
        mSubchapterId = map[subchapter].id || subchapter;
        mSubchapterName = map[subchapter].name || subchapter;
        mSlideId = map[slide].id || slide;
        mSlideName = map[slide].name || slide;
      }
      // Else use the JSON file for names and ids
      else if (app.type === 'json') {
        if (app.json.structures[chapter]) {
          mChapterName = app.json.structures[chapter].name || chapter;
        }
        if (app.json.structures[subchapter]) {
          mSubchapterName = app.json.structures[subchapter].name || subchapter;
        }
        if (app.json.slides[slide]) {
          mSlideName = app.json.slides[slide].name || slide;
        }
      }
      ag.submit.slide({
        id: mSlideId,
        name: mSlideName,
        chapterId: mChapterId,
        chapter: mChapterName,
        subChapterId: mSubchapterId,
        subChapter: mSubchapterName,
        slideIndex: sIndex,
        path: sPath
      });
    }

    /**
     * Call save explicitly, to override or if not using framework
     * @public
     * @param chapter The chapter id
     * @param subchapter The subchapter id
     * @param slide The slide id
     */
    function explicitSave (chapter, subchapter, slide) {
      var path = app.getPath();

      // ag.submit.slide({
      //   id: monitorStr,
      //   name: monitorStr,
      //   subChapterId: subChapterId,
      //   subChapter: subChapterId,
      //   chapterId: chapterId,
      //   chapter: chapterId,
      //   path: slidePath
      // });
    }

    /**
     * Set eventlistener for slideEnter
     * @private
     */
    function log (exclude) {
      // Only log slides for certain content if exclude is given
      if (exclude.length) {
        document.addEventListener('contentLoad' ,function () {
          var loaded = app.loaded.id;
          if (exclude.indexOf(loaded) !== -1) {
            document.removeEventListener('slideEnter', save);
          }
          else {
            document.addEventListener('slideEnter', save);
          }
        });
      }
      // Always log slides
      else {
        document.addEventListener('slideEnter', save);
      }
    }

    // Public API
    return {
      init: init,
      save: explicitSave
    }
  }()); // End app.analytics

 });;/**
 * AGNITIO FRAMEWORK MODULE - resize
 * This is a framework module to help facilitate presentations
 * to run in both landscape and portrait orientation.
 * NOTE: onOrientationChange will be built into future version
 * of iPlanner.
 * @author - Stefan Liden, sli@agnitio.com
 */

(function() {
  
  // Custom event to be dispatched when view is resized
  window.resize = document.createEvent("UIEvents");
  resize.initEvent("resize", false, false);
  
  // Dispatch the custom event when window resizes
  window.onresize = function() {
    document.dispatchEvent(resize);
  };
  
  document.addEventListener("presentationInit", function() {
    var width = window.innerWidth,
        height = window.innerHeight;
        
    if (width < 1000) {
      width = 768;
      height = 1024;
    }
    else {
      width = 1024;
      height = 768;
    }
        
    app.dimensions = [width, height];
  });
  
  // Set app.dimensions when resize is sent
  document.addEventListener("resize",function(){
    var width = window.innerWidth,
        height = window.innerHeight,
        currentStructure = app.loaded.id,
        currentContent = app.loaded.current,
        currentSlide = app.slideshow.current;
        
    if (width < 1000) {
      width = 768;
      height = 1024;
    }
    else {
      width = 1024;
      height = 768;
    }
        
    app.dimensions = [width, height];
    
  });
  
})();



;/**
 * AGNITIO FRAMEWORK MODULE - Data
 * This module will automatically log slide data to the Agnitio Analyzer.
 * It will look for the slide name in three places (not looking further when found):
 * - a global JavaScript object named monitormap,
 * - a data-monitor attribute on the slide (on the article tag)
 * - the actual slide id.
 * NOTE: this module will not fit all specifications for saving slide data
 * @author - Stefan Liden, sli@agnitio.com
 */
(function() {

	window.Data = function(monitoringEnabled) {
		var self = this;
		this.version = 'v1.0';
		this.monitoringEnabled = monitoringEnabled || true;
		window.monitoringEnabled = this.monitoringEnabled;
		if (this.monitoringEnabled) {
			document.addEventListener('contentLoad', function(e) {
				this.removeEventListener('contentLoad', arguments.callee);
				if (!window.monitormap) { self._setSaveMethod(); }
				self.logSlides();
			});
		}
		else {
			console.log('Slide monitoring is turned off');
		}
	};

	Data.prototype = {
		// If a monitormap object is not available, then use either data-monitor attribute or slide id
		_setSaveMethod: function() {
			var firstSlide = document.querySelector('article'),
				attr = firstSlide.getAttribute('data-ag-slide-name');
			if (attr) {
				this.saveSlide = this._saveFromAttr;
			}
			else {
				this.saveSlide = this._saveFromId;
			}
		},
		// Saving from data-monitor attribute
		_saveFromAttr: function(slide) {
			var monitorStr = slide.getAttribute('data-ag-slide-name'),
				parentName = app.slideshow.id,
				grandparentName = 'Presentation';


			if (!monitorStr) { monitorStr = slide.id; }

			try{
				submitSlideEnter(monitorStr, monitorStr, 1, parentName, grandparentName);
			} catch(e){
				console.log('Saving: ' + monitorStr);
			}
		},
		// Saving from slide id
		_saveFromId: function(slide) {
			var monitorStr = slide.id,
				parentName = app.slideshow.id,
				grandparentName = 'Presentation';

			try{
				submitSlideEnter(monitorStr, monitorStr, 1, parentName, grandparentName);
			}catch(e){
				console.log('Saving: ' + monitorStr);
			}
		},
		// Default save, saving from monitormap object
		saveSlide: function(slide) {
			var monitorStr = window.monitormap.slides[slide.id] || slide.id,
				parentName = window.monitormap.slideshows[app.slideshow.id] || app.slideshow.id,
				grandparentName = window.monitormap.presentation || 'Presentation';


			try{
				submitSlideEnter(monitorStr, monitorStr, 1, parentName, grandparentName);
			}catch(e){
				console.log('Saving: ' + monitorStr);
			}
		},
		// Log slides to analyzer when entering slides
		logSlides: function() {
			var save = this.saveSlide;
			document.addEventListener('slideEnter', function(e) {
				save(e.target);
			});
			document.addEventListener('inlineSlideEnter', function(e) {
				save(e.target);
			});
		}
	};

	/* DATA HELPER
	 * Create timers for custom monitoring of i.e. popups
	 * It is possible to start and stop individual timers repeatidly
	 * @author Stefan Liden - sli@agnitio.com
	 */
	Data.Timer = function() {
		this.time = 0;
		this.startTime = 0;
		this.endTime = 0;
		this.isActive = false;
	};

	Data.Timer.prototype = {
		start: function() {
			this.isActive = true;
			this.startTime = new Date().getTime();
		},
		stop: function() {
			this.endTime = new Date().getTime();
			// Make sure the timer is active before updating
			if (this.isActive) {
				this.isActive = false;
				var timediff = this.endTime - this.startTime;
				// Add current time-slot to previously recorded time
				this.time = this.time + timediff;
			}
		},
		reset: function() {
			this.isActive = false;
			this.time = 0;
		},
		// Return the timers time as hh:mm:ss
		toString: function() {
			return this.msToHours(this.time);
		},
		/************************************************************************
		 Convert fra milliseconds to hh:mm:ss
		 By Mette Schmidt - Agnitio
		 ************************************************************************/
		msToHours: function(ms) {

			ms = parseInt(ms, 10);

			var hh = Math.floor(ms / 3600000);
			var mm = Math.floor((ms - (hh * 3600000)) / 60000);
			var ss = parseInt(((ms - (hh * 3600000) - (mm * 60000)) / 1000), 10);

			hh = (hh < 10) ? "0" + hh : hh;
			mm = (mm < 10) ? "0" + mm : mm;
			ss = (ss < 10) ? "0" + ss : ss;

			return hh + ":" + mm + ":" + ss;
		}
	};

})();
;/**
 * AGNITIO FRAMEWORK MODULE - Menu
 * This is a slideshow/collection menu that will allow you to easily
 * link to all your slideshows, collections, and slides.
 * NOTE: There is no scrolling of menu currently included
 * @author - Stefan Liden, sli@agnitio.com
 */

(function () {

    var currentMenu = null;

    window.Menu = function (config) {
        this.version = '1.1';
        this.config = config || {};
        this.containerId = this.config.container || 'mainmenu';
        this.ele = app.elements.menu = document.getElementById(this.containerId);
        this.menuItems = this.config.links;
        this.attachTo = this.config.attachTo || [];
        this.offset = this.config.offset || 0;
        this.initialized = false;
        this._init();
    };

    Menu.prototype = {
        _init: function () {
            var self = this;
            // Initialize and/or insert menu when content is loaded

            document.addEventListener('contentLoad', function () {
                if (self.attachTo.indexOf(app.loaded.id) > -1 || self.attachTo.length === 0) {
                    currentMenu = self;
                    if (self.initialized) {
                        self._connect();
                        self._insert();
                    }
                    else {
                        self.content = (app.loaded.type === 'slideshow' ? app.slideshows[app.loaded.id] : app.collections[app.loaded.id]);
                        self._build();
                        self._insert();
                        self._connect();
                        self.initialized = true;
                    }
                    if (app.loaded.type === 'slideshow') {
                        document.addEventListener('slideEnter', self._setCurrent);
                    }
                    else {
                        document.addEventListener('sectionEnter', self._setCurrent);
                    }
                }
            });

            // If slideshow/collection specific menu, remove when content unloads
            document.addEventListener('contentUnload', function () {
                if (self.attachTo.indexOf(app.loaded.id) > -1) {
                    self._remove();
                    if (app.loaded.type === 'slideshow') {
                        document.removeEventListener('slideEnter', self._setCurrent);
                    }
                    else {
                        document.removeEventListener('sectionEnter', self._setCurrent);
                    }
                }
            });
        },

        // Create the HTML of the menu
        _build: function () {
            var self = this,
          markup = '';
            // markup = '<ul id="' + app.loaded.id + 'Menu" class="menu">';
            this.menuItems.forEach(function (item) {
                item.className = item.className || "";
                var li = '<li data-goto="' + item.goTo + '" class="' + item.className + '">' + item.title + '</li>';
                markup += li;
            });
            // markup += '</ul>';
            this.markup = markup;
        },

        // Add markup to index page
        _insert: function () {
            var list = document.createElement('ul'),
          scrollLimit = 0;
            list.id = app.loaded.id + 'Menu';
            list.setAttribute('class', 'menu');
            list.innerHTML = this.markup;
            this.ele.appendChild(list);
            this.list = list;

            this._getWidth();

            // Find scroll limit
            scrollLimit = app.dimensions[0] - this.menuWidth;

            this.scroller = new Draggy(list.id, { restrictY: true, limitsX: [scrollLimit, 0] });
            this.scroller.moveTo(this.offset, 0);
        },

        // Clean up if unloading
        _remove: function () {
            this.ele.removeEventListener('tap', this._navigate);
            this.ele.removeEventListener('swipeleft', touchy.stop);
            this.ele.removeEventListener('swiperight', touchy.stop);
            this.ele.removeChild(this.list);
        },

        // Get the width of each link item
        // Update width of menu (ul)
        _getWidth: function () {
            var links = this.ele.querySelectorAll('li');
            this.menuWidth = 0;
            for (var i = 0, len = links.length; i < len; i++) {
                var width = links[i].getBoundingClientRect().width;
                this.menuWidth += width;
            }
        },

        // Update menu item classes (remove and add .selected)
        // Break up data-goto attribute and use it to call app.goTo
        _navigate: function (event) {
            var ele = event.target;
            var prev, attr, linkArr, name, content, subcontent;
            if (ele.nodeType === 3) {
                ele = ele.parentNode;
            }
            prev = this.querySelector('.selected');
            attr = ele.getAttribute('data-goto');
            if (attr) {
                if (prev) { util.removeClass(prev, 'selected'); }
                linkArr = attr.split('.');
                name = linkArr[0];
                content = linkArr[1] || '';
                subcontent = linkArr[2] || '';
                util.addClass(ele, 'selected');
                app.goTo(name, content, subcontent);
            }
        },

        // Add internal event listeners
        _connect: function () {
            var self = this;
            this.ele.addEventListener('tap', this._navigate);
            this.ele.addEventListener('swipeleft', touchy.stop);
            this.ele.addEventListener('swiperight', touchy.stop);
        },

        // Called on 'slideEnter' or 'sectionEnter'
        _setCurrent: function () {
            var prev = currentMenu.list.querySelector('.selected'),
          query = '[data-goto="' + app.loaded.id + '.' + app.loaded.current + '"]';
            link = currentMenu.list.querySelector(query);
            if (prev) { util.removeClass(prev, 'selected'); }
            if (link) {
                util.addClass(link, 'selected');
                var pos = util.getPosition(link)[0] + currentMenu.offset;
                var wd = link.getBoundingClientRect().width;
                var rightPos = pos + wd;
                var toMove = 0;
                var defaultOffset = currentMenu.config.offset || 0;
                var absOffset = Math.abs(defaultOffset);
                var appWidth = app.dimensions[0];
                if (rightPos >= appWidth) {
                    toMove = (rightPos - appWidth) - currentMenu.offset;
                    currentMenu.list.style.webkitTransitionDuration = '0.5s';
                    currentMenu.list.style.webkitTransform = 'translate3d(-' + toMove + 'px, 0, 0)';
                    currentMenu.offset = -toMove;
                }
                else if (pos < 0) {
                    toMove = pos - currentMenu.offset;
                    currentMenu.list.style.webkitTransitionDuration = '0.5s';
                    currentMenu.list.style.webkitTransform = 'translate3d(-' + toMove + 'px, 0, 0)';
                    currentMenu.offset = -toMove;
                }
                else if (rightPos > absOffset && (rightPos + absOffset + wd) < appWidth) {
                    toMove = defaultOffset;
                    currentMenu.list.style.webkitTransitionDuration = '0.5s';
                    currentMenu.list.style.webkitTransform = 'translate3d(' + toMove + 'px, 0, 0)';
                    currentMenu.offset = toMove;
                }
            }
        }
    };

})();
;/**
* AGNITIO FRAMEWORK MODULE - Loader
* This module will show a loading indicator when content is loading.
* There are three built-in types: default, bar, circle
* CSS is used to customize the look of the loader.
* REQUIREMENTS: util.js
* @author - Stefan Liden, sli@agnitio.com
*/
(function(doc) {
  
  /**
  * The config param accepts to settings:
  * type:  Type of loading indicator (['default'], 'bar', 'circle')
  * delay: How long the loading indicator should be visible after contentLoad as been called
  */
  window.Loader = function(config) {
    this.version = '1.0';
    this.requirements = 'util.js',
    this.config = config || {};
    this.type = this.config.type || 'default'
    this.delay = this.config.delay || 2000;
    this._init();
  };

  Loader.prototype = {
    
    _init: function() {
      this._createContainer();
      this._connect();
    },
    
    // Create the container holding the loading indicator
    _createContainer: function() {
      var presentation = app.elements.presentation;
      this.defaultContent = '<ul><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul>';
      this.ele = doc.createElement('div');
      this.ele.id = 'loader';
      this.ele.className = 'loader';
      if (this.type === 'default') {
        this.ele.innerHTML = this.defaultContent;
      }
      else if (this.type === 'bar') {
        this.ele.className = 'loader bar';
      }
      else if (this.type === 'circle') {
        this.ele.className = 'loader circle';
      }
      presentation.insertBefore(this.ele, presentation.childNodes[0]);
    },
    
    // Attach the event listeners for contentLoad and contentUnload
    _connect: function() {
      var loader = this.ele,
          delay = this.delay;
      function hide () {
        setTimeout(function() {
          util.addClass(loader, 'inactive');
        },0);
        setTimeout(function() {
          loader.style.display = "none";
        },delay);
      }
      doc.addEventListener('contentUnload', function(event) {
        util.removeClass(loader, 'inactive');
        loader.style.display = "block";
      });
      doc.addEventListener('contentLoad', function(event) {
        hide();
      });
      doc.addEventListener('appError', function(event) {
        hide();
      });
    }
  };
  
})(document);;/* AGNITIO MODULE:  SlidePopup
 * A module that will show and hide a slide on top of current slideshow
 * */
(function() {
  // Custom events for the Slide popup module
  window.slidePopupLoad = document.createEvent('UIEvents');
  window.slidePopupUnload = document.createEvent('UIEvents');
  window.slidePopupEnter= document.createEvent('UIEvents');
  window.slidePopupExit= document.createEvent('UIEvents');
  slidePopupLoad.initEvent('slidePopupLoad', true, false);
  slidePopupUnload.initEvent('slidePopupUnload', true, false);
  slidePopupEnter.initEvent('slidePopupEnter', true, false);
  slidePopupExit.initEvent('slidePopupExit', true, false);

  var d = document;

  window.SlidePopup = function(id, backButtonId) {
    var that=this;
    this.version = '1.2';
    this.id = id;
    this.ele = app.elements.popup = d.getElementById(id);
    this.backButton = document.getElementById(backButtonId);
    this.markup = '';
    this.isVisible = false;
    document.addEventListener("slideEnter",function(){that.hide();});
  };

  SlidePopup.prototype = {
    show: function(slide) {
      var self = this;
      var markup;

      // If changing content without hiding, call onExit for previous slide
      if (this.isVisible) {
        if (app.slide[this.slide]) {
          app.slide[this.slide].onExit(this.slideEle);
        }
      }

      this.isVisible = true;

      // Close the popup if jumping to another slideshow/collection
      document.addEventListener('contentUnload', function(e) {
        self.hide();
        document.removeEventListener('contentUnload', arguments.callee);
      });

      this.slide = slide;
      this.slideEle;
      // Make sure the slide is not already part of active slideshow
      if (app.slideshow.content.indexOf(slide) === -1) {
        app.getHtml(slide, app.pathToSlides, function(data) { markup = data; });
        this.ele.innerHTML = markup;
        this.slideEle = this.ele.querySelector('.slide');
        util.addClass(this.ele, 'displaying');
        this.slideEle.dispatchEvent(slidePopupLoad);

        if (app.slide[slide]) {
          app.getSlideElements(slide, this.slideEle);
          app.slide[slide].onEnter(this.slideEle);
        }
        if (app.scroller) {
            app.scroller.disableAll();
        }
          if(this.backButton){
              this.backButton.style.visibility = 'visible';
              this.backButton.addEventListener('tap', function(e) {
                  self.hide(slide);
                  self.backButton.removeEventListener('tap', arguments.callee);
              });
          }
              self.slideEle.dispatchEvent(slidePopupEnter);
      }
      else {
        console.log('Content is already part of slideshow');
      }
    },
    hide: function() {
      var self = this;
      if (this.isVisible) {
        this.isVisible = false;
        util.removeClass(this.ele, 'displaying');
        if(this.backButton) this.backButton.style.visibility = 'hidden';
        setTimeout(function() {
          if (app.slide[self.slide]) {
            app.slide[self.slide].onExit(self.slideEle);
            app.removeElements(self.slide);
          }
          self.ele.innerHTML = '';
          if (app.scroller) {
            app.scroller.enableAll();
          }
        }, 1000);
        this.slideEle.dispatchEvent(slidePopupUnload);
        this.slideEle.dispatchEvent(slidePopupExit);
      }
    }
  };
})();
;
(function () {

    window.Localisation = function (config) {
        this.version = '1.0';
        this.xml;
        this.config = config || {};
        this._init();
    };

    Localisation.prototype = {
        _init: function () {
            var baseUrl = "modules/localisation/languages/";
            if (window.location.href.indexOf('_ASK_Extensions') > -1) {
                baseUrl = "../../" + baseUrl;
            }
            if (window.location.href.indexOf('_framework') > -1) {
                baseUrl + "../" + baseUrl;
            }

            var self = this;
            $.ajax({
                type: "GET",
                url: baseUrl + language,
                dataType: "xml",
                async: false,
                success: function (xml) {
                    self.xml = xml;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Language xml file not found or is not valid, have you checked the case? " + jqXHR.status + "," + errorThrown);
                }
            });
        },

        getString: function (area, stringName) {
            var toReturn = '';
            $(this.xml).find("Content").each(function () {
                if ($(this).attr("area") == area) {
                    $(this).find("String").each(function () {
                        if ($(this).attr("name") == stringName) {
                            toReturn = $(this).text();
                            return false;
                        }
                    });
                }
            });
            return toReturn;
        },

        _insert: function () {

        },

        _remove: function () {

        }
    };

})();
;/**
 * 
 * Find more about the slide down menu at
 * http://cubiq.org/slide-in-menu
 *
 * Copyright (c) 2010 Matteo Spinelli, http://cubiq.org/
 * Released under MIT license
 * http://cubiq.org/dropbox/mit-license.txt
 * 
 * Version 0.1beta1 - Last updated: 2010.05.28
 * 
 */

function slideInMenu (el, opened) {
this.container = document.getElementById(el);
this.handle = this.container.querySelector('.handle');
this.openedPosition = this.container.clientWidth;
this.container.style.opacity = '1';
this.container.style.left = '-' + this.openedPosition + 'px';
this.container.style.webkitTransitionProperty = '-webkit-transform';
this.container.style.webkitTransitionDuration = '400ms';
if ( opened===true ) {
this.open();
}
this.handle.addEventListener('touchstart', this);
}
slideInMenu.prototype = {
pos: 0,
opened: false,
handleEvent: function(e) {
switch (e.type) {
case 'touchstart': this.touchStart(e); break;
case 'touchmove': this.touchMove(e); break;
case 'touchend': this.touchEnd(e); break;
}
},
setPosition: function(pos) {
this.pos = pos;
this.container.style.webkitTransform = 'translate3d(' + pos + 'px,0,0)';
if (this.pos == this.openedPosition) {
this.opened = true;
} else if (this.pos == 0) {
this.opened = false;
}
},
touchStart: function(e) {
e.preventDefault();
e.stopPropagation();
this.container.style.webkitTransitionDuration = '0';
this.startPos = this.pos;
this.startDelta = e.touches[0].pageX - this.pos;
this.handle.addEventListener('touchmove', this);
this.handle.addEventListener('touchend', this);
},
touchMove: function(e) {
var delta = e.touches[0].pageX - this.startDelta;
if (delta > this.openedPosition) {
delta = this.openedPosition;
}
this.setPosition(delta);
},
	
	touchEnd: function(e) {
		var strokeLength = this.pos - this.startPos;
		strokeLength*= strokeLength < 0 ? -1 : 1;
		
		if (strokeLength > 3) {		// It seems that on Android is almost impossibile to have a tap without a minimal shift, 3 pixels seems a good compromise
			this.container.style.webkitTransitionDuration = '200ms';
			if (this.pos==this.openedPosition || !this.opened) {
				this.setPosition(this.pos > this.openedPosition/3 ? this.openedPosition : 0);
			} else {
				this.setPosition(this.pos > this.openedPosition ? this.openedPosition : 0);
			}
		} else {
			this.container.style.webkitTransitionDuration = '400ms';
			this.setPosition(!this.opened ? this.openedPosition : 0);
		}

		this.handle.removeEventListener('touchmove', this);
		this.handle.removeEventListener('touchend', this);
	},
	
	open: function() {
		this.setPosition(this.openedPosition);
	},

	close: function() {
		this.setPosition(0);
	},
	
	toggle: function() {
		if (this.opened) {
			this.close();
		} else {
			this.open();
		}
	}
}
;;document.addEventListener('presentationInit', function(){
    var slide = app.slide.s0 = {
        elements: {
            painContent: "#s0_0"
        },
        onEnter:function(slideElement){
            app.menu.hide();
            util.addClass(slide.element.painContent, 'active');
            presentetion.prev('empty');

        },
        onExit:function(slideElement){
            submitSlideExit('s0');
        }
    }

});
;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s1_1 = {
			elements: {
      		painContent: "#s1_1_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');

				presentetion.bgStyle('nv1', 'nv1_', 7);
				presentetion.prev('nviz1', 'nviz1', "s1_1");
				//submitSlideEnter('slideId', 'slideName', slideIndex, 'parentName', 'grandparentName');
				submitSlideEnter('s1_1', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');
			},
			onExit:function(slideElement){
				submitSlideExit('s1_1');
				
	
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s1_2 = {
			elements: {
      		painContent: "#s1_2_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.prev('nviz1', 'nviz1', "s1_2");
				submitSlideEnter('s1_2', '2', 2, '2', 'A WH_Beauty_1_cycle_2015');
				

				$('.nv1_2 .info-btn').click(
					function () {
						$('.nv1_2 .source').show().click(
							function () {
								$('.nv1_2 .source').hide();
							}
						)
					}
				);

				$('.nv1_2 .switch_bones .switch').click(
					function () {
						$(this).toggleClass("changed");
						$(".nv1_2 .switch_bones ").toggleClass("changed");
					}
				);

				$('.nv1_2 .button').click(
					function () {
						$('.nv1_2 .popup').show();
						$('.nv1_2 .popup .close-btn').click(
							function () {
								$('.nv1_2 .popup').hide();
							}
						)
					}
				);
			},
			onExit:function(slideElement){
				submitSlideExit('s1_2');
				closePopup();
				$('.nv1_2 .switch_bones .switch, .nv1_2 .switch_bones ').removeClass("changed");

			}
		}

	});













































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s1_3 = {
			elements: {
      		painContent: "#s1_3_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.prev('nviz1', 'nviz1', "s1_3");
				submitSlideEnter('s1_3', '3', 3, '3', 'A WH_Beauty_1_cycle_2015');

				$('#nv1_3-drag').draggable({
					revert: true
				});
				$('#nv1_3-drop').droppable({
					drop: function(){
						$('#nv1_3-drag').hide(1000);
						setTimeout(
							function () {
								app.slideshow.next()
							}
							, 1200)
					}
				});
			},
			onExit:function(slideElement){
				submitSlideExit('s1_3');

				$('#nv1_3-drag').draggable('destroy').show(500);
				$('#nv1_3-drop').droppable('destroy');
			}
		}

	});













































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;document.addEventListener('presentationInit', function () {
    var slide = app.slide.s1_4 = {
        elements: {
            painContent: "#s1_4_2"
        },
        onEnter: function (slideElement) {
            app.menu.show();
            util.addClass(slide.element.painContent, 'active');
            presentetion.prev('nviz1', 'nviz1', "s1_4");
            submitSlideEnter('s1_4', '4', 4, '4', 'A WH_Beauty_1_cycle_2015');

            $('#nv1_4-drag').draggable({
                revert: true
            });
            $('#nv1_4-drop').droppable({
                drop: function(){
                    $('#nv1_4-drag').hide(1000);
                    setTimeout(
                        function () {
                            app.slideshow.next()
                        }
                        , 1200)
                }
            });


        },
        onExit: function (slideElement) {
            submitSlideExit('s1_4');

            $('#nv1_4-drag').draggable('destroy').show(500);
            $('#nv1_4-drop').droppable('destroy');

            presentetion.closePopup();

        }



    }


});




;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s1_5 = {
			elements: {
      		painContent: "#s1_5_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.prev('nviz1', 'nviz1', "s1_5");
				submitSlideEnter('s1_5', '5', 5, '5', 'A WH_Beauty_1_cycle_2015');




				openSource('.nv1_5 .info-btn', '.nv1_5 .source');

				$('.nv1_5 .popup .switch').click(
					function () {
						$(".nv1_5 .popup .content ").toggleClass("changed");
					}
				);

				openPopup('.nv1_5 .button', '.nv1_5 .popup');
			},
			onExit:function(slideElement){
				submitSlideExit('s1_5');

				closePopup();
			}
		}

	});
;document.addEventListener('presentationInit', function() {

  var slide = app.slide.s1_6 = {
  	elements: {
      painContent: "#s1_6_2"
    },
    onEnter: function(ele) {
     app.menu.show(); 
     util.addClass(slide.element.painContent, 'active');
     presentetion.prev('nviz1', 'nviz1', "s1_6");
     submitSlideEnter('s1_6', '6', 6, '6', 'A WH_Beauty_1_cycle_2015');


        openSource('.nv1_6 .info-btn', '.nv1_6 .source');

        $('.nv1_6 .switch').click(
            function () {
                $(".nv1_6").toggleClass("changed");
            }
        );
   },
   onExit: function(ele) {
    submitSlideExit('s1_6');

       closePopup();
  }
};


}); 

function openWindowSolo1_6(n) {
	var a = document.getElementById('window' + n);

	
	a.addClass('active');	
	
};
















































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s1_7 = {
			elements: {
      		painContent: "#s1_7_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.prev('nviz1', 'nviz1', "s1_7");
				submitSlideEnter('s1_7', '7', 7, '7', 'A WH_Beauty_1_cycle_2015');
				
			},
			onExit:function(slideElement){
				submitSlideExit('s1_7');
			}
		}

	});













































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s2_1 = {
			elements: {
      		painContent: "#s1_2_1"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.bgStyle('nv2', 'nv2_', 7);
				presentetion.prev('nviz2', 'nviz2', "s2_1");
				//submitSlideEnter('slideId', 'slideName', slideIndex, 'parentName', 'grandparentName');
				submitSlideEnter('s2_1', '2', 2, '2', 'A WH_Beauty_1_cycle_2015');
				scrolNav();
			},
			onExit:function(slideElement){
				submitSlideExit('s2_1');
				
	
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s2_2 = {
			elements: {
      		painContent: "#s1_2_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.prev('nviz2', 'nviz2', "s2_2");
				submitSlideEnter('s2_1', '2', 2, '2', 'A WH_Beauty_1_cycle_2015');


				var sliderTooltip = function(event, ui) {
					var curValue = ui.value || 1;
					var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + curValue + '</div><div class="tooltip-arrow"></div></div>';

					$('.ui-slider-handle').html(tooltip);

					if(ui.value == 10) {
						$('.nv2_2 .disease').hide();
						$('.nv2_2 .tissue').addClass("changed");
					} else if (ui.value >= 5) {
						$('.nv2_2 .disease').show().addClass("changed");
						$('.nv2_2 .tissue').show().removeClass("changed");
					} else {
						$('.nv2_2 .disease, .nv2_2 .tissue').show().removeClass("changed");
					}
				};

				$( "#nv2_2_slider" ).slider({
					value : 0,
					min : 0,
					max : 10,
					step : 1,
					range: 'min',
					create: sliderTooltip,
					slide: sliderTooltip
				});



				openPopup('.nv2_2 .button', '.nv2_2 .popup');

				openSource('.nv2_2 .info-btn', '.nv2_2 .source')



			},
			onExit:function(slideElement){
				submitSlideExit('s2_1');
				closePopup();

				$('.nv2_2 .disease, .nv2_2 .tissue').show().removeClass("changed");
				$('.tooltip-inner').html('1');
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s2_3 = {
			elements: {
      		painContent: "#s1_2_3"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.prev('nviz2', 'nviz2', "s2_3");
				submitSlideEnter('s2_1', '2', 2, '2', 'A WH_Beauty_1_cycle_2015');

				$('#nv2_3-drag').draggable({
					revert: true
				});
				$('#nv2_3-drop').droppable({
					drop: function(){
						$('#nv2_3-drag').hide(1000);
						setTimeout(
							function () {
								app.slideshow.next()
							}
							, 1200)
					}
				});
			},
			onExit:function(slideElement){
				submitSlideExit('s2_1');

				$('#nv2_3-drag').draggable('destroy').show(500);
				$('#nv2_3-drop').droppable('destroy');
	
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s2_4 = {
			elements: {
      		painContent: "#s1_2_4"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.prev('nviz2', 'nviz2', "s2_4");
				submitSlideEnter('s2_4', '2', 2, '2', 'A WH_Beauty_1_cycle_2015');

				$('#nv2_4-drag').draggable({
					revert: true
				});
				$('#nv2_4-drop').droppable({
					drop: function(){
						$('#nv2_4-drag').hide(1000);
						setTimeout(
							function () {
								app.slideshow.next()
							}
							, 1200)
					}
				});
			},
			onExit:function(slideElement){
				util.removeClass(slide.element.painContent,'active');
				submitSlideExit('s2_4');

				$('#nv2_4-drag').draggable('destroy').show(500);
				$('#nv2_4-drop').droppable('destroy');
	
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s2_5 = {
			elements: {
      		painContent: "#s1_2_5"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.prev('nviz2', 'nviz2', "s2_5");
				submitSlideEnter('s2_5', '2', 2, '2', 'A WH_Beauty_1_cycle_2015');

				openSource('.nv2_5 .info-btn', '.nv2_5 .source');

				$('.nv2_5 .popup .switch').click(
					function () {
						$(".nv2_5 .popup .content ").toggleClass("changed");
					}
				);

				openPopup('.nv2_5 .button', '.nv2_5 .popup');
			},
			onExit:function(slideElement){
				util.removeClass(slide.element.painContent,'active');
				submitSlideExit('s2_4');
				
				closePopup();
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s2_6 = {
			elements: {
      		painContent: "#s1_2_6"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.prev('nviz2', 'nviz2', "s2_6");
				submitSlideEnter('s2_6', '2', 2, '2', 'A WH_Beauty_1_cycle_2015');

				openSource('.nv2_6 .info-btn', '.nv2_6 .source');

				$('.nv2_6 .switch').click(
					function () {
						$(".nv2_6").toggleClass("changed");
					}
				);
			},
			onExit:function(slideElement){
				util.removeClass(slide.element.painContent,'active');
				submitSlideExit('s2_6');
				
				closePopup();
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s2_7 = {
			elements: {
      		painContent: "#s1_2_7"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.prev('nviz2', 'nviz2', "s2_7");
				submitSlideEnter('s2_7', '2', 2, '2', 'A WH_Beauty_1_cycle_2015');
			},
			onExit:function(slideElement){
				util.removeClass(slide.element.painContent,'active');
				submitSlideExit('s2_7');
				
	
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s3_1 = {
			elements: {
      		painContent: "#s1_3_1"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTop("Flex");	
				presentetion.menuTopSelected("menu_top_1");							
				presentetion.bgStyle('nv3', 'nv3_', 5);
				presentetion.prev('nviz3', 'nviz3', "s3_1");
				

				submitSlideEnter('s3_1', '2', 2, '2', 'A WH_Beauty_1_cycle_2015');
			},
			onExit:function(slideElement){
				submitSlideExit('s3_1');
				
	
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s3_2 = {
			elements: {
      		painContent: "#s1_3_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTopSelected("menu_top_2");					
				presentetion.prev('nviz3', 'nviz3', "s3_2");
				submitSlideEnter('s3_2', '2', 2, '2', 'A WH_Beauty_1_cycle_2015');

				$('.nv3_2 .button').click(
					function () {
						app.slideshow.next();
					}
				)
			},
			onExit:function(slideElement){
				submitSlideExit('s3_1');
				
	
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s3_3 = {
			elements: {
      		painContent: "#s1_3_3"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTopSelected("menu_top_3");					
				presentetion.prev('nviz3', 'nviz3', "s3_3");
				submitSlideEnter('s3_1', '2', 2, '2', 'A WH_Beauty_1_cycle_2015');

				openSource('.nv3_3>.info-btn', '.nv3_3>.source');
				openSource('.nv3_3>.popup .info-btn', '.nv3_3>.popup .source');

				$('.nv3_3 .switch').click(
					function () {
						$(".nv3_3").toggleClass("changed");
					}
				);

				openPopup('.nv3_3 .button', ".nv3_3>.popup");
				openPopup('.nv3_3>.popup .button', ".nv3_3>.popup>.popup.synergy");

				$('.nv3_3>.popup>.popup.synergy .close-btn').click(
					function () {
						$('.nv3_3>.popup').show();
					}
				)
			},
			onExit:function(slideElement){
				submitSlideExit('s3_1');

				closePopup();
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s3_4 = {
			elements: {
      		painContent: "#s1_3_4"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTopSelected("menu_top_4");					
				presentetion.prev('nviz3', 'nviz3', "s3_4");
				submitSlideEnter('s3_4', '2', 2, '2', 'A WH_Beauty_1_cycle_2015');

				openSource('.nv3_4 .info-btn', '.nv3_4 .source');

				$('.nv3_4 .switch').click(
					function () {
						$(".nv3_4").toggleClass("changed");
					}
				);
			},
			onExit:function(slideElement){
				util.removeClass(slide.element.painContent,'active');
				submitSlideExit('s3_4');
				
				closePopup();
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s3_5 = {
			elements: {
      		painContent: "#s1_3_5"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTopSelected("menu_top_4");					
				presentetion.prev('nviz3', 'nviz3', "s3_5");
				submitSlideEnter('s3_5', '2', 2, '2', 'A WH_Beauty_1_cycle_2015');
			},
			onExit:function(slideElement){
				util.removeClass(slide.element.painContent,'active');
				submitSlideExit('s3_4');
				
	
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s4_1 = {
			elements: {
      		painContent: "#s4_1_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTop("Mir");	
				presentetion.menuTopSelected("menu_top_1");
				presentetion.bgStyle('rv1', 'rv1_', 7);
				presentetion.prev('nviz4', 'nviz4', "s4_1");
				//submitSlideEnter('s1_1', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');
			},
			onExit:function(slideElement){
				submitSlideExit('s4_1');


			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s4_2 = {
			elements: {
      		painContent: "#s4_2_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTop("Mir");	
				presentetion.menuTopSelected("menu_top_2");
				presentetion.prev('nviz4', 'nviz4', "s4_2");

				var sliderTooltip = function(event, ui) {
					var curValue = ui.value || 1;
					var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + curValue + '</div><div class="tooltip-arrow"></div></div>';

					$('.ui-slider-handle').html(tooltip);

					if(ui.value == 200) {
						$('.rv1_2 .knee').removeClass("stage2").addClass("stage3");
					} else if (ui.value >= 100 && ui.value < 200) {
						$('.rv1_2 .knee').addClass("stage2").removeClass("stage3");
					} else if(ui.value < 100) {
						$('.rv1_2 .knee').removeClass("stage2").removeClass("stage3");
					}

				};

				$( "#rv1_2_slider" ).slider({
					value : 1,
					min : 1,
					max : 200,
					step : 1,
					range: 'min',
					create: sliderTooltip,
					slide: sliderTooltip
				});



				openPopup('.rv1_2 .button', '.rv1_2 .popup');

				openSource('.rv1_2 .info-btn', '.rv1_2 .source')
			},
			onExit:function(slideElement){
				submitSlideExit('s4_2');

				closePopup();
				$('.rv1_2 .knee').removeClass("stage2").removeClass("stage3");
				$('.tooltip-inner').html('1');
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s4_3 = {
			elements: {
      		painContent: "#s4_3_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTop("Mir");	
				presentetion.menuTopSelected("menu_top_2");
				presentetion.prev('nviz4', 'nviz4', "s4_3");
				//submitSlideEnter('s1_1', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');

				$('#rv1_3-drag').draggable({
					revert: true
				});
				$('#rv1_3-drop').droppable({
					drop: function(){
						$('#rv1_3-drag').hide(1000);
						setTimeout(
							function () {
								app.slideshow.next()
							}
							, 1200)
					}
				});
			},
			onExit:function(slideElement){
				submitSlideExit('s4_3');
				$('#nv3_3-drag').draggable('destroy').show(500);
				$('#nv3_3-drop').droppable('destroy');
	
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s4_4 = {
			elements: {
      		painContent: "#s4_4_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTop("Mir");	
				presentetion.menuTopSelected("menu_top_3");
				presentetion.prev('nviz4', 'nviz4', "s4_4");
				//submitSlideEnter('s1_1', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');

				$('#rv1_4-drag').draggable({
					revert: true
				});
				$('#rv1_4-drop').droppable({
					drop: function(){
						$('#rv1_4-drag').hide(1000);
						setTimeout(
							function () {
								app.slideshow.next()
							}
							, 1200)
					}
				});
			},
			onExit:function(slideElement){
				submitSlideExit('s4_4');
				$('#nv3_4-drag').draggable('destroy').show(500);
				$('#nv3_4-drop').droppable('destroy');
	
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s4_5 = {
			elements: {
      		painContent: "#s4_5_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTop("Mir");	
				presentetion.menuTopSelected("menu_top_4");
				presentetion.prev('nviz4', 'nviz4', "s4_5");
				//submitSlideEnter('s1_1', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');

				openSource('.rv1_5 .info-btn', '.rv1_5 .source');

				$('.rv1_5 .popup .switch').click(
					function () {
						$(".rv1_5 .popup .content ").toggleClass("changed");
					}
				);

				openPopup('.rv1_5 .button', '.rv1_5 .popup');
			},
			onExit:function(slideElement){
				submitSlideExit('s4_5');
				closePopup();
	
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s4_6 = {
			elements: {
      		painContent: "#s4_6_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTop("Mir");	
				presentetion.menuTopSelected("menu_top_4");
				presentetion.prev('nviz4', 'nviz4', "s4_6");
				//submitSlideEnter('s1_1', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');

				openSource('.rv1_6 .info-btn', '.rv1_6 .source');

				$('.rv1_6 .switch').click(
					function () {
						$(".rv1_6").toggleClass("changed");
					}
				);
			},
			onExit:function(slideElement){
				submitSlideExit('s4_6');
				closePopup();
	
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s4_7 = {
			elements: {
      		painContent: "#s4_7_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTop("Mir");	
				presentetion.menuTopSelected("menu_top_4");
				presentetion.prev('nviz4', 'nviz4', "s4_7");
				//submitSlideEnter('s1_1', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');
			},
			onExit:function(slideElement){
				submitSlideExit('s4_7');
				
	
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s5_1 = {
			elements: {
      		painContent: "#s5_1_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTop("rviz2");
				presentetion.menuTopSelected("menu_top_1");
				presentetion.bgStyle('rv2', 'rv2_', 7);
				presentetion.prev('nviz5', 'nviz5', "s5_1");
				//submitSlideEnter('s1_1', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');
			},
			onExit:function(slideElement){
				submitSlideExit('s5_1');
				
	
			}
		}

	});






































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s5_2 = {
			elements: {
      		painContent: "#s5_2_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTop("Mir");	
				presentetion.menuTopSelected("menu_top_2");
				presentetion.prev('nviz5', 'nviz5', "s5_2");
				//submitSlideEnter('s1_1', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');

				var sliderTooltip = function(event, ui) {
					var curValue = ui.value || 1;
					var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + curValue + '</div><div class="tooltip-arrow"></div></div>';

					$('.ui-slider-handle').html(tooltip);

					if(ui.value == 10) {
						$('.rv2_2 .disease').hide();
						$('.rv2_2 .tissue').addClass("changed");
					} else if (ui.value >= 5) {
						$('.rv2_2 .disease').show().addClass("changed");
						$('.rv2_2 .tissue').show().removeClass("changed");
					} else {
						$('.rv2_2 .disease, .rv2_2 .tissue').show().removeClass("changed");
					}

				}

				$( "#rv2_2_slider" ).slider({
					value : 0,
					min : 0,
					max : 10,
					step : 1,
					range: 'min',
					create: sliderTooltip,
					slide: sliderTooltip
				});



				openPopup('.rv2_2 .button', '.rv2_2 .popup');

				openSource('.rv2_2 .info-btn', '.rv2_2 .source')



			},
			onExit:function(slideElement){
				submitSlideExit('s5_2');
				closePopup();

				$('.rv2_2 .disease, .rv2_2 .tissue').show().removeClass("changed");
				$('.tooltip-inner').html('1');
	
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s5_3 = {
			elements: {
      		painContent: "#s5_3_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTop("Mir");	
				presentetion.menuTopSelected("menu_top_2");
				presentetion.prev('nviz5', 'nviz5', "s5_3");
				//submitSlideEnter('s1_1', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');

				$('#rv2_3-drag').draggable({
					revert: true
				});
				$('#rv2_3-drop').droppable({
					drop: function(){
						$('#rv2_3-drag').hide(1000);
						setTimeout(
							function () {
								app.slideshow.next()
							}
							, 1200)
					}
				});
			},
			onExit:function(slideElement){
				submitSlideExit('s5_3');
				$('#rv2_3-drag').draggable('destroy').show(500);
				$('#rv2_3-drop').droppable('destroy');
	
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s5_4 = {
			elements: {
      		painContent: "#s5_4_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTop("Mir");	
				presentetion.menuTopSelected("menu_top_3");
				presentetion.prev('nviz5', 'nviz5', "s5_4");
				//submitSlideEnter('s1_1', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');

				$('#rv2_4-drag').draggable({
					revert: true
				});
				$('#rv2_4-drop').droppable({
					drop: function(){
						$('#rv2_4-drag').hide(1000);
						setTimeout(
							function () {
								app.slideshow.next()
							}
							, 1200)
					}
				});
			},
			onExit:function(slideElement){
				submitSlideExit('s5_4');
				$('#rv2_4-drag').draggable('destroy').show(500);
				$('#rv2_4-drop').droppable('destroy');
	
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s5_5 = {
			elements: {
      		painContent: "#s5_5_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTop("Mir");	
				presentetion.menuTopSelected("menu_top_4");
				presentetion.prev('nviz5', 'nviz5', "s5_5");
				//submitSlideEnter('s1_1', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');

				openSource('.rv2_5 .info-btn', '.rv2_5 .source');

				$('.rv2_5 .popup .switch').click(
					function () {
						$(".rv2_5 .popup .content ").toggleClass("changed");
					}
				);

				openPopup('.rv2_5 .button', '.rv2_5 .popup');
			},
			onExit:function(slideElement){
				submitSlideExit('s5_5');
				closePopup();
	
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s5_6 = {
			elements: {
      		painContent: "#s5_6_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTop("Mir");	
				presentetion.menuTopSelected("menu_top_4");
				presentetion.prev('nviz5', 'nviz5', "s5_6");
				//submitSlideEnter('s1_1', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');

				openSource('.rv2_6 .info-btn', '.rv2_6 .source');

				$('.rv2_6 .switch').click(
					function () {
						$(".rv2_6").toggleClass("changed");
					}
				);
			},
			onExit:function(slideElement){
				submitSlideExit('s5_6');
				closePopup();
	
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s5_7 = {
			elements: {
      		painContent: "#s5_7_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTop("Mir");	
				presentetion.menuTopSelected("menu_top_4");
				presentetion.prev('nviz5', 'nviz5', "s5_7");
				//submitSlideEnter('s1_1', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');
			},
			onExit:function(slideElement){
				submitSlideExit('s5_7');
				
	
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s6_1 = {
			elements: {
      		painContent: "#s6_1_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTop("Mir");	
				presentetion.menuTopSelected("menu_top_1");
				presentetion.bgStyle('rv3', 'rv3_', 5);
				presentetion.prev('nviz6', 'nviz6', "s6_1");
				//submitSlideEnter('s1_1', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');
			},
			onExit:function(slideElement){
				submitSlideExit('s6_1');
				
	
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s6_2 = {
			elements: {
      		painContent: "#s6_2_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTop("Mir");	
				presentetion.menuTopSelected("menu_top_2");
				presentetion.prev('nviz6', 'nviz6', "s6_2");
				//submitSlideEnter('s1_1', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');
			},
			onExit:function(slideElement){
				submitSlideExit('s6_2');
				
	
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s6_3 = {
			elements: {
      		painContent: "#s6_3_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTop("Mir");	
				presentetion.menuTopSelected("menu_top_2");
				presentetion.prev('nviz6', 'nviz6', "s6_3");
				//submitSlideEnter('s1_1', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');

				openSource('.rv3_3>.info-btn', '.rv3_3>.source');
				openSource('.rv3_3>.popup .info-btn', '.rv3_3>.popup .source');

				$('.rv3_3 .switch').click(
					function () {
						$(".rv3_3").toggleClass("changed");
					}
				);

				openPopup('.rv3_3 .button', ".rv3_3>.popup");
				openPopup('.rv3_3>.popup .button', ".rv3_3>.popup>.popup.synergy");

				$('.rv3_3>.popup>.popup.synergy .close-btn').click(
					function () {
						$('.rv3_3>.popup').show();
					}
				)
			},
			onExit:function(slideElement){
				submitSlideExit('s6_3');
				
	
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s6_4 = {
			elements: {
      		painContent: "#s6_4_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTop("Mir");	
				presentetion.menuTopSelected("menu_top_3");
				presentetion.prev('nviz6', 'nviz6', "s6_4");
				//submitSlideEnter('s1_1', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');

				openSource('.rv3_4 .info-btn', '.rv3_4 .source');

				$('.rv3_4 .switch').click(
					function () {
						$(".rv3_4").toggleClass("changed");
					}
				);
			},
			onExit:function(slideElement){
				submitSlideExit('s6_4');
				
	
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s6_5 = {
			elements: {
      		painContent: "#s6_5_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTop("Mir");	
				presentetion.menuTopSelected("menu_top_4");
				presentetion.prev('nviz6', 'nviz6', "s6_5");
				//submitSlideEnter('s1_1', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');
			},
			onExit:function(slideElement){
				submitSlideExit('s6_5');
				
	
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s8_1 = {
			elements: {
				painContent: "#s1_8_1"
			},
			onEnter:function(slideElement){
				//app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				submitSlideEnter('s8_1', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');
				//previevs();	
				var text_survey_1 = ''; /*переменная зранения ответов*/
				var question_survey_1 = 'Какие интернет-сообщества вы посещаете?'; /*переменная вопроса*/
				var comment_val = ''; 

				/*отмечаем чекбоксы*/
				$('.survey_1').bind('click', function(event) {
					text_survey_1 = '';
					$('.survey_1').each(function() {
						if ($(this).prop('checked')) 
						{
							text_survey_1 = text_survey_1 + $(this).attr('data-title') + ' ' ;
						}


						if ($(".survey_nothing").is(":checked"))
						{	
							$('.survey_site').removeAttr("checked");
							$('.survey_site').removeClass("active");
						} else {
							$('.survey_site').addClass("active");
						};

						if ($(".survey_other").is(":checked"))
						{
							$('#comment')	.removeAttr("readonly")
														.css("color","#000")
														.addClass("active");
							comment_val = $('#comment').val();
						} else {
							$('#comment')	.attr("readonly", true)
														.css("color","#ddd")
							 							.removeClass("active");
						};

						if(text_survey_1 === '') {
							$('#sent_survey_1').removeClass('active');
						} else {
							$('#sent_survey_1').addClass('active');
						}
					});
				});
				

				/*работаем с полем для пункта ДАЛЕЕ*/
				$('#comment').on('focus', function (){
					var maxLength = $('#comment').attr('maxlength'); 
					$('#comment').on('keyup', function() {
						var curLength = $('#comment').val().length;
						comment_val = $('#comment').val();
						$("#free_symbols").text(maxLength - curLength);
					});

				});									

				$('#comment').on('blur', function (){
					if ($(".survey_other").is(":checked")) {
						text_survey_1 = text_survey_1 + comment_val;
					}
					comment_val = '';
											
				});

				/*отправляем результат опроса*/
				$('#sent_survey_1').on(ev, function() {
					if(text_survey_1 !== '') {
						$('#transmission_report_1').addClass('active');
						submitData(text_survey_1, question_survey_1)
					};
				}); 

				/*закрываем окно с отчетом об отправке*/
				$('#sent_survey_1_btn').on(ev, function() {
					$('#transmission_report_1').removeClass('active');
					app.goTo('s8_2s', 's8_2');
				});

			},
			onExit:function(slideElement){
				submitSlideExit('s8_1');
				

			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
	*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s8_2 = {
			elements: {
				painContent: "#s1_8_2"
			},
			onEnter:function(slideElement){
				//app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				submitSlideEnter('s8_2', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');
				//previevs();	

				var text_survey_2 = ''; /*переменная зранения ответов*/
				var question_survey_2 = 'Смотрите ли вы вебинары?'; /*переменная вопроса*/

				/*отмечаем чекбоксы*/
				$('.survey_2').bind('click', function(event) {
					text_survey_2 = $('input[name=survey_2]:checked').val();
					if(text_survey_2 !== false) {
						$('#sent_survey_2').addClass('active');
					};
				});


				$('#sent_survey_2').on(ev, function() {
					if(text_survey_2 !== false) {
						$('#transmission_report_2').addClass('active');
						submitData(text_survey_2, question_survey_2);
					};
				});

				/*закрываем окно с отчетом об отправке*/
				$('#sent_survey_2_btn').on(ev, function() {
					$('#transmission_report_2').removeClass('active');
					app.goTo('s1s', 's1');
				});

			},
			onExit:function(slideElement){
				submitSlideExit('s8_2');
			}
		}

	});










































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
	*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s9_1 = {
			elements: {
      		painContent: "#s1_9_1"
    		},
			onEnter:function(slideElement){
				//app.menu.hide();
				util.addClass(slide.element.painContent, 'active');
				//submitSlideEnter('slideId', 'slideName', slideIndex, 'parentName', 'grandparentName');
				submitSlideEnter('s9_1', 'Оглавление', 9, '9', 'A WH_Beauty_1_cycle_2015');
				
				popups();

			},
			onExit:function(slideElement){
				submitSlideExit('s9_1');
			}
		}

	});













































/*document.addEventListener('presentationInit', function() {
													   
  var slide = app.slide.s1 = {
	  
  	elements: {
      painContent: "#s1_2"
    },
    onEnter: function(ele) {
      util.addClass(slide.element.painContent,'active');
		document.getElementById('mainmenu').style.cssText="top:-50px;";
    },
    onExit: function(ele) {
      util.removeClass(slide.element.painContent,'active');
	  
    }
  };


}); 
*/
/*var link1;
link1 = prompt(link1);
link1 = "s" + link1;
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/;(function(config){

	
	
	// Creating our presentation and global namespace "app"
	window.app = new Presentation({
		globalElements: ['mainMenu'],
		type:'json',
		manageMemory: true
	});

	
	// Initiate modules
	app.scroller = new Slidescroller();
	AutoMenu.prototype.hide = function(){
		this.ele.addClass("hidden");
	};
	AutoMenu.prototype.show = function(){
		this.ele.removeClass("hidden");
	};
	app.menu = new AutoMenu({
		attachTo: 'storyboard',
		
		links: {
			s1s: {title: ' ', classname: 'home'},

		}
	});

	app.data = new Data(true);
	//builder.checkIfNeedToLoadPresentation();
	// Initialize presentation
	app.init('s1s', 'front_page');

	app.analytics.init(config);
})();




// Prevent vertical bouncing of slides
document.ontouchmove = function(event){
	event.preventDefault();
};

var ev = "touchend mouseup";

var nav_slide = 's8_1',
nav_dir = 's8_1s';


var prew = {
	"nviz1": {
		"nviz1": ["s1_1", "s1_2", "s1_3", "s1_4", "s1_5", "s1_6", "s1_7"],
		"class": "nviz1",
		"name": "nviz1",
		"prevId": "s1_1s"	
	},
	"nviz2": {
		"nviz2": ["s2_1", "s2_2","s2_3","s2_4","s2_5", "s2_6", "s2_7"],
		"class": "nviz2",
		"name": "nviz2",
		"prevId": "s2_1s"												
	},
	"nviz3": {
		"nviz3": ["s3_1", "s3_2","s3_3","s3_4","s3_5"],
		"class": "nviz3",
		"name": "nviz3",
		"prevId": "s3_1s"	
	},
	"nviz4": {
		"nviz4": ["s4_1", "s4_2", "s4_3", "s4_4", "s4_5", "s4_6", "s4_7"],
		"class": "nviz4",
		"name": "nviz4",
		"prevId": "s4_1s"
	},
	"nviz5": {
		"nviz5": ["s5_1", "s5_2", "s5_3", "s5_4", "s5_5", "s5_6", "s5_7"],
		"class": "nviz5",
		"name": "nviz5",
		"prevId": "s5_1s"
	},
	"nviz6": {
		"nviz6": ["s6_1", "s6_2", "s6_3", "s6_4", "s6_5"],
		"class": "nviz6",
		"name": "nviz6",
		"prevId": "s6_1s"
	}

	}



var presentetion = {
	bgImg: [],
	popups: [],	
	bgStyle: function(img, slide, count) {
		for (var i = 1; i <= count; i++) {
			bgImg = document.getElementsByClassName(slide + i);
			bgImg[0].style.backgroundImage = "url('content/img/"+ img + "/" + img + "_" + i + ".jpg')";
		}
	},
	popup: function(id) {
		var id = document.getElementById(id);
		presentetion.popups = document.getElementsByClassName('popups');		
		for (var i = 0; i < presentetion.popups.length; i++) {
			presentetion.popups[i].removeClass('active');
		};
		id.addClass('active');
	},
	closePopup: function() {
		for (var i = 0; i < presentetion.popups.length; i++) {
			if(presentetion.popups.length !== 0) {
				presentetion.popups[i].removeClass('active');
			};
		};
		presentetion.popups = [];
	},
	animationBlocks: function(id, arrow) {
		var id = document.getElementById(id);
		var arrow = document.getElementById(arrow);		
		setTimeout(function(){
			id.toggleClass('active');
			arrow.toggleClass('active');
		}, 300)

	},
	openAccordeon: function(id) {
		var id = document.getElementById(id);
		var blocks = document.getElementsByClassName('blocks');

		if(!(id.hasClass('active')))	{		
			for (var i = 0; i < blocks.length; i++) {
				blocks[i].removeClass('active');
			};	
			id.addClass('active');
		} else {
			id.removeClass('active');
		}				
	},
	secondId: '',
	firstId: '',
	prev: function(presId, groupId, slideId) {
		if(presId === 'empty') {
			document.getElementById('thumbs').classList.add('hiddenThrumbs');
			document.getElementById('thumbs').classList.remove("active");
		} else {
			document.getElementById('thumbs').classList.remove('hiddenThrumbs');				
			presentetion.firstId = groupId;

			var handle_middle = document.getElementById("handle_middle");
			var preview_container = document.getElementById("preview_container");				
			var slide_id = "",
					prev_id;

			handle_middle.classList.add(prew[presId]["class"]);

			if(presentetion.firstId !== presentetion.secondId) {

				removeChildrenRecursively(handle_middle);
				removeChildrenRecursively(preview_container);			

				for(var i = 0; i< prew[presId][groupId].length; i++) {

					var slideTrumb = document.createElement('div');
					slideTrumb.classList.add("indicator");
					slideTrumb.id = prew[presId][groupId][i] + '_indicator';

					handle_middle.appendChild(slideTrumb);

					var slidePrev = document.createElement('li');
					slidePrev.innerHTML = '<li class="prev" id="' + prew[presId][groupId][i] + '_prev" onclick="app.goTo(\''+ prew[presId]["prevId"] + '\',\'' + prew[presId][groupId][i] + '\')" ><img  src="content/img/thumbs/' + prew[presId][groupId][i] + '.jpg"></li>'
					preview_container.appendChild(slidePrev);
				};
				presentetion.secondId = groupId;
				slide_id = document.getElementById(slideId + '_indicator');
				prev_id = document.getElementById(slideId + '_prev');
				slide_id.classList.add("active");
				prev_id.classList.add("active");

				} else {
					var indicator = document.getElementsByClassName("indicator"), 
					prev = document.getElementsByClassName("prev");	
					slide_id = document.getElementById(slideId + '_indicator');
					prev_id = document.getElementById(slideId + '_prev');			
					for (var i = 0; i<indicator.length; i++) {
						indicator[i].classList.remove("active");
					};
					for (var i = 0; i<prev.length; i++) {
						prev[i].classList.remove("active");
					};

					slide_id.classList.add("active");
					prev_id.classList.add("active");			
				}
		}

		},

		openPrev: function() {
			var thumbs = document.getElementById("thumbs");

			if(!thumbs.hasClass("active")) {
				thumbs.classList.add("active");
			} else if(thumbs.hasClass("active")){
				thumbs.classList.remove("active");
			};

		},
		menuTop: function(product){
			var menu = document.getElementById('mainMenu');
			if(product == 'empty') {
				menu.innerHTML = '<nav id="menuTop" class=""></nav>';
			};	
			if(product == 'Flex') {
				menu.innerHTML = '<nav id="menuTop" class="">\
				<ul id="menu-1" class="menu_top menu_Flex">\
					<li class="home-menu menu_top_1" onclick="app.goTo(\'s1s\', \'s1\')"><span ontouchend="app.goTo(\'s1s\', \'s1\')"><img ontouchend="app.goTo(\'s1s\', \'s1\')" src="content/img/menu/home-button.png"></span></li>\
					<li class="menu_top_2" ontouchend="app.goTo(\'s3_1s\', \'s3_2\')"><span>Семейство<br/> Джес<sup>&reg;</sup></span></li>\
					<li class="menu_top_3" ontouchend="app.goTo(\'s3_1s\', \'s3_3\')"><span>Джес<sup>&reg;</sup> во флекс-<br/>картридже</span></li>\
					<li class="menu_top_4" ontouchend="app.goTo(\'s3_1s\', \'s3_4\')"><span>Новый<br/>режим</span></li>\
					<li class="menu_top_5" ontouchend="app.goTo(\'s3_1s\', \'s3_7\')"><span>Клик<br/>(Clyk)</span></li>\
					<li class="menu_top_6" ontouchend="app.goTo(\'s3_1s\', \'s3_12\')"><span>Профиль кровотечений<br/> и тромбозы</span></li>\
					<li class="menu_top_7" ontouchend="app.goTo(\'s3_1s\', \'s3_16\')"><span>Эффективность</span></li>\
					<li class="menu_top_8" ontouchend="app.goTo(\'s3_1s\', \'s3_18\')"><span>Дисменорея</span></li>\
					<li class="menu_top_9" ontouchend="app.goTo(\'s3_1s\', \'s3_19\')"><span>Кому Джес<sup>&reg;</sup> во флекс-<br/>картридже и Клик(Clyk)</span></li>\
				</ul></nav>';
			};
			if(product == 'Jass') {
				menu.innerHTML = '<nav id="menuTop" class="">\
					<ul id="menu-1" class="menu_top menu_Jass">\
						<li class="home-menu menu_top_1" onclick="app.goTo(\'s1s\', \'s1\')"> <span><img ontouchend="app.goTo(\'s1s\', \'s1\')" src="content/img/menu/home-button.png"></span></li>\
						<li class="menu_top_2" ontouchend="app.goTo(\'s3_1s\', \'s3_2\')"><span>Для кого?</span></li>\
						<li class="menu_top_3" ontouchend="app.goTo(\'s3_1s\', \'s3_6\')"><span>Эффективность</span></li>\
						<li class="menu_top_4" ontouchend="app.goTo(\'s3_1s\', \'s3_12\')"><span>Длительность</span></li>\
						<li class="menu_top_5" ontouchend="app.goTo(\'s3_1s\', \'s3_15\')"><span>Безопасность</span></li>\
						<li class="menu_top_6" ontouchend="app.goTo(\'s3_1s\', \'s3_23\')"><span>Акне</span></li>\
						<li class="menu_top_7" ontouchend="app.goTo(\'s3_1s\', \'s3_24\')"><span>СПКЯ</span></li>\
						<li class="menu_top_8" ontouchend="app.goTo(\'s3_1s\', \'s3_38\')"><span>ПМС</span></li>\
						<li class="menu_top_9" ontouchend="app.goTo(\'s3_1s\', \'s3_40\')"><span>FAQ</span></li>\
					</ul></nav>';
			};
			if(product == 'Ang') {
				menu.innerHTML = '<nav id="menuTop" class="">\
				<ul id="menu-1" class="menu_top menu_Ang">\
					<li class="home-menu menu_top_0" ontouchend="app.goTo(\'s1s\', \'s1\')"> <span><img ontouchend="app.goTo(\'s1s\', \'s1\')" src="content/img/menu/home-button.png"></span></li>\
					<li class="menu_top_1" ontouchend="app.goTo(\'s1_1s\', \'s1_1\')"><span>Схемы<br>назначения</span></li>\
					<li class="menu_top_2" ontouchend="app.goTo(\'s1_1s\', \'s1_2\')"><span>Эффективность</span></li>\
					<li class="menu_top_3" ontouchend="app.goTo(\'s1_1s\', \'s1_3\')"><span>Безопасность</span></li>\
					<li class="menu_top_4" ontouchend="app.goTo(\'s1_1s\', \'s1_7\')"><span>Качество<br> жизни</span></li>\
					<li class="menu_top_5" ontouchend="app.goTo(\'s1_1s\', \'s1_8\')"><span>Дополнительные<br>преимущества</span></li>\
					<li class="menu_top_6" ontouchend="app.goTo(\'s1_1s\', \'s1_17\')"><span>Анжелик<sup>&reg;</sup> <br>vs Фемостон</span></li>\
					<li class="menu_top_7" ontouchend="app.goTo(\'s1_1s\', \'s1_18\')"><span>Кому <br>Анжелик<sup>&reg;</sup></span></li>\
					<li class="menu_top_8" ontouchend="app.goTo(\'s1_1s\', \'s1_21\')"><span>Ультранизкая<br>доза</span></li>\
					<li class="menu_top_9" ontouchend="app.goTo(\'s1_1s\', \'s1_25\')"><span>Кому<br>Анжелик<sup>&reg;</sup> Микро</span></li>\
					<li class="menu_top_10" ontouchend="app.goTo(\'s1_1s\', \'s1_35\')"><span>Ультра доза vs<br>Фитоэстрогены</span></li>\
					<li class="menu_top_11" ontouchend="app.goTo(\'s1_1s\', \'s1_36\')"><span>Длительность</span></li>\
					</ul></nav>';
			};
			if(product == 'Ang_M') {
				menu.innerHTML = '<nav id="menuTop" class=""><ul id="menu-1" class="menu_top menu_Ang_M"><li class="home-menu menu_top_1" ontouchend="app.goTo(\'s1s\', \'s1\')"> <span><img ontouchend="app.goTo(\'s1s\', \'s1\')" src="content/img/menu/home-button.png"></span></li><li class="menu_top_2" ontouchend="app.goTo(\'s4_1s\', \'s4_2\')"><span>Ультранизкая<br/> доза</span></li><li class="menu_top_3" ontouchend="app.goTo(\'s4_1s\', \'s4_5\')"><span>Ультра доза vs<br/>Фитоэстрогены</span></li>				<li class="menu_top_4" ontouchend="app.goTo(\'s4_1s\', \'s4_6\')"><span>Эффективность</span></li>				<li class="menu_top_5" ontouchend="app.goTo(\'s4_1s\', \'s4_7\')"><span>Переносимость</span></li>				<li class="menu_top_6" ontouchend="app.goTo(\'s4_1s\', \'s4_8\')"><span>Дополнительные<br/>преимущества</span></li>				<li class="menu_top_7" ontouchend="app.goTo(\'s4_1s\', \'s4_9\')"><span>Безопасность</span></li>				<li class="menu_top_8" ontouchend="app.goTo(\'s4_1s\', \'s4_10\')"><span>Кому<br/>Анжелик<sup>&reg;</sup> Микро</span></li>    <li class="menu_top_9" ontouchend="app.goTo(\'s4_1s\', \'s4_23\')"><span>Длительность</span></li>     <li class="menu_top_10" ontouchend="app.goTo(\'s4_1s\', \'s4_24\')"><span>Схемы<br/>назначения</span></li></ul></nav>';
			};
			if(product == 'Mir') {
				menu.innerHTML = '<nav id="menuTop" class="">\
					<ul id="menu-1" class="menu_top menu_Mir">\
						<li class="home-menu menu_top_1" ontouchend="app.goTo(\'s1s\', \'s1\')"><span ontouchend="app.goTo(\'s1s\', \'s1\')"><img ontouchend="app.goTo(\'s1s\', \'s1\')" src="content/img/menu/home-button.png"></span></li>\
						<li class="menu_top_2" ontouchend="app.goTo(\'s4_1s\', \'s4_2\')"><span>Что такое <br>ВМС Мирена<sup>&reg;</sup>?</span></li>\
						<li class="menu_top_3" ontouchend="app.goTo(\'s4_1s\', \'s4_4\')"><span>Эффективность</span></li>\
						<li class="menu_top_4" ontouchend="app.goTo(\'s4_1s\', \'s4_5\')"><span>Безопасность<br/>и переносимость</span></li>\
						<li class="menu_top_5" ontouchend="app.goTo(\'s4_1s\', \'s4_11\')"><span>ОМК</span></li>\
						<li class="menu_top_6" ontouchend="app.goTo(\'s4_1s\', \'s4_17\')"><span>Компонент МГТ</span></li>\
						<li class="menu_top_7" ontouchend="app.goTo(\'s4_1s\', \'s4_21\')"><span>Портреты<br>пациенток</span></li>\
						<li class="menu_top_8" ontouchend="app.goTo(\'s4_1s\', \'s4_36\')"><span>Мирабель</span></li>\
						<li class="menu_top_9" ontouchend="app.goTo(\'s4_1s\', \'s4_42\')"><span>Что выбирают<br>эксперты?</span></li>\
					</ul></nav>';
			};
			if(product == 'rviz2') {
				menu.innerHTML = '<nav id="menuTop" class="">\
					<ul id="menu-1" class="menu_top menu_rviz2">\
						<li class="home-menu menu_top_1" ontouchend="app.goTo(\'s1s\', \'s1\')"><span ontouchend="app.goTo(\'s1s\', \'s1\')"><img ontouchend="app.goTo(\'s1s\', \'s1\')" src="content/img/menu/home-button.png"></span></li>\
						<li class="menu_top_2" ontouchend="app.goTo(\'s5_1s\', \'s5_2\')"><span>Что такое <br>ВМС Мирена<sup>&reg;</sup>?</span></li>\
						<li class="menu_top_3" ontouchend="app.goTo(\'s5_1s\', \'s5_4\')"><span>Эффективность</span></li>\
						<li class="menu_top_4" ontouchend="app.goTo(\'s5_1s\', \'s5_5\')"><span>Безопасность<br/>и переносимость</span></li>\
						<li class="menu_top_5" ontouchend="app.goTo(\'s5_1s\', \'s5_11\')"><span>ОМК</span></li>\
						<li class="menu_top_6" ontouchend="app.goTo(\'s5_1s\', \'s5_17\')"><span>Компонент МГТ</span></li>\
						<li class="menu_top_7" ontouchend="app.goTo(\'s5_1s\', \'s5_21\')"><span>Портреты<br>пациенток</span></li>\
						<li class="menu_top_8" ontouchend="app.goTo(\'s5_1s\', \'s5_36\')"><span>Мирабель</span></li>\
						<li class="menu_top_9" ontouchend="app.goTo(\'s5_1s\', \'s5_42\')"><span>Что выбирают<br>эксперты?</span></li>\
					</ul></nav>';
			}
			scrolNav();	
		},




		menuTopSelected: function(selectLi) {
			var menu_top_before;
			if(selectLi != menu_top_before) {
				$("#menuTop li").removeClass('selected');
				$("." + selectLi).addClass('selected');
				menu_top_before = selectLi;
			};
		}

	}

	function removeChildrenRecursively(node)
	{
		if (!node) return;
		while (node.hasChildNodes()) {
			removeChildrenRecursively(node.firstChild);
			node.removeChild(node.firstChild);
		}
	};

/*функция скроллинга*/
function scrolNav() {
	var preview = document.getElementsByClassName("touch_scroll"); 
	var scrollStartPos=0;
	for(var i = 0, j=preview.length; i<j; i++){


		preview[i].addEventListener("touchstart", function(event) { 
			scrollStartPos=this.scrollTop+event.touches[0].pageY; 
		},false); 

		preview[i].addEventListener("touchmove", function(event) { 
			this.scrollTop=scrollStartPos-event.touches[0].pageY; 
		},false); 
	};


};

/*верхнее меню*/

/*запуск / остановка видео*/

function playVideo(video){
	document.getElementById('video_' + video).style.cssText="display:block;";
	document.getElementById('stop_video_' + video).style.cssText="display:block;";
	document.getElementById('video_' + video).play();
};	


function stopVideo(video){
	document.getElementById('video_' + video).pause();
	document.getElementById('video_' + video).style.cssText="display:none";
	document.getElementById('stop_video_' + video).style.cssText="display:none;";
};

	

/*счетчик колличества символов*/
function textareaLength(val){
	var maxLength = $('#comment' + val).attr('maxlength'); 
	$('#comment' + val).on('keyup', function() {
		var curLength = $('#comment' + val).val().length;
		$("#free_symbols" + val).text(maxLength - curLength);
	});

};


// /*отправка статистики*/
// var response_value = "",
// question_value = "",
// label_id = 0;
// function submitDataFlex(){
// 	ag.submit.data({
// 		unique: true,
// 		category: "CLM_Beauty_line_1cycle_2016",
// 		categoryId: label_id,
// 		label: question_value,
// 		value: response_value,
// 		valueType: "text",
// 		labelId: label_id,
// 		path: app.getPath()
// 	});
// 	console.log("label_id = " + label_id + ": " + question_value + ": " + response_value);
// };

// function submitData(val, question){
// 	ag.submit.data({
// 		unique: true,
// 		category: "CLM_VITA_line_1cycle_2016",
// 		categoryId: "CLM_VITA_line_1cycle_2016",
// 		label: question,
// 		value: val,
// 		valueType: "text",
// 		labelId: "Id",
// 		path: app.getPath()
// 	});
// 	console.log(val + ": "+ question);
// };

var response_value = "",
question_value = "",
label_id = 0;

function getValQuestionnaire(id, name, question, text) {
	label_id = '';
	response_value = '';
	question_value = '';

	label_id = id;
	$('input[name="'+name+'"]:checked').each(function() {

		response_value = response_value + this.value + ", ";
	});	
	question_value = question;
	if($('#checkbox_' + id).is(":checked")){
		console.log($('#' + text));
		response_value = response_value + $('#' + text).val();
	} 

	submitData();
}

/*отправка статистики*/

function submitData(){
	ag.submit.data({
		unique: true,
		category: "A CLM_Beauty_line_2cycle_2016",
		categoryId: label_id,
		label: question_value,
		value: response_value,
		valueType: "text",
		labelId: label_id,
		path: app.getPath()
	});
	alert("label_id = " + label_id + ": " + question_value + ": " + response_value);
};