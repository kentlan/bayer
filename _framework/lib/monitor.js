/**
 * monitor.js
 *
 * A JavaScript microlibrary for monitoring Agnitio presentation data.
 * Will monitor data on the web (+ localStorage) or in Agnitio iPlanner app.
 *
 * @author     Stefan Liden
 * @version    0.1
 * @copyright  Copyright 2011 Stefan Liden
 * @license    
 */
 
(function () {
    
  // Is script running on iOS device?
  var ua = navigator.userAgent,
     // From: http://davidwalsh.name/detect-ipad
     isiPad = /iPad/i.test(ua) || /iPhone OS 3_1_2/i.test(ua) || /iPhone OS 3_2_2/i.test(ua),
     isSafari = ua.match(/Safari/i) != null,
     isiPlanner = isiPad && !isSafari;
    
    // Test device and browser 
//  alert('Is iPad? ' + isiPad);
//  alert('Is Safari? ' + isSafari);
//  alert('Is iPlanner? ' + isiPlanner);
  
  // Make sure JSON methods are available
  if (!isiPad && !window.JSON) {
    // TODO: replace with loading of json2.js
    throw new Error('JSON methods are not available, please add json2.js');
  }
  
  // TODO: create Object.create if it is not available
  if (typeof Object.create !== 'function') {
    Object.prototype.create = function(obj) {
      console.log('Create a clone of the object and return it.');
    };
  }
  
  window.monitor = {
  
   // Monitoring is enabled by default
   isEnabled: true,
   
   dataTemplate: {
     type: "system",
     categoryId: null,
     category: undefined,
     labelId: undefined,
     label: undefined,
     valueId: undefined,
     value: undefined,
     valueType: undefined,
     time: undefined,
     slideIndex: undefined,
     parentSlideName:undefined,
     parentOfParentSlideName: undefined
   },
   
   // An object for the current slide
   current: {
     slideId: null,
     slideName: null,
     slideIndex: null,
     slideParent: null,
     slideGrandparent: null
   },
   
   // Set save method depending on environment
   init: function () {
     if (isiPlanner) {
       this.save = this.saveForiPlanner;
     }
     else {
       //TODO: Create the necessary objects that are normally created by iPlanner
     }
   },
   
   // Get current time in seconds
   timestamp: function () {
     return Math.floor((new Date().getTime()) / 1000);
   },
   
   // XHR for saving data async
   connect: function(callback, path, data) {
     var path, xhr;
     xhr = new XMLHttpRequest();
     xhr.open('GET', path, false);
     xhr.onreadystatechange = function() {
       if (xhr.readyState !== 4) {
         return;
       }
       if (xhr.status !== 0 && xhr.status !== 200) {
         if (xhr.status === 400) {
           alert("Could not locate " + path);
         } else {
           alert("monitor.connect " + path + " HTTP error: " + xhr.status);
         }
         return;
       }
       return callback();
     };
     xhr.send();
   },
   
   /* === PRIVATE SAVE METHODS === */
   
   // Default save method, used internally by API
   save: function (data) {
     var formattedData, beacon, url;
     if (this.isEnabled) {
       formattedData = JSON.stringify(data);
       console.log("Saving " + data.value + " data...");
//       console.log(data);
       // Save to localStorage
       
       // Save to server
     }
   },
   
   // Save function if viewed in iPlanner
   saveForiPlanner: function (data) {
     var formattedData, beacon, url;
     if (this.isEnabled) {
       var iFrame, invokeString;
       //alert('Catergory: ' + data.category + '\n' + 'Slide: ' + data.time);
       formattedData = JSON.stringify(data);
       invokeString = "objc://iplanner/monitoringEvent?" + encodeURIComponent(formattedData);
       iFrame = document.createElement('iFrame');
       iFrame.setAttribute("src", invokeString);
       document.body.appendChild(iFrame);
       iFrame.parentNode.removeChild(iFrame);
       iFrame = null;
     }
     
     // Alternative trying to use a beacon, does not seem to work
//     if (this.isEnabled) {
//       formattedData = JSON.stringify(data);
//       url = "objc://iplanner/monitoringEvent?";
//       beacon = new Image();
//       beacon.src = url + encodeURIComponent(formattedData);
//     }
   },
   
   /* === MONITORING API METHODS === */
   
   // Turn of monitoring
   disable: function() {
     this.isEnabled = false;
   },
   
   // Monitor visited slides
   slide: function (slideId, slideName, slideIndex, parentOfSlide, grandparentOfSlide) {
   
     var data, now;
   
     now = this.timestamp();
     
     // Exit previous slide if there is one
     if (this.current.slideId) {
       this.slideExit(this.current.slideId);
     }
   
     // The data to be sent to database
     data = {
       type: "system",
       categoryId: null,
       category: "slideEnter",
       labelId: "id",
       label: "name",
       valueId: slideId,
       value: slideName,
       valueType: null,
       time: now,
       slideIndex: slideIndex,
       parentSlideName: parentOfSlide,
       parentOfParentSlideName: grandparentOfSlide
     };
     
     // Set the entered slide as the current one
     this.current.slideId = slideId;
     
     this.save(data);
     
   },
   
   // Monitor exiting of slide
   // Normally only called automatically from monitor.slide
   slideExit: function (slideId) {
   
     var data, now, self;
     
     // Backwards compatibility with submitSlideExit()
     self = this !== window.monitor ? window.monitor : this;
     
     if (!self.current.slideId) { return; }
     
     now = self.timestamp();
     
     //alert('Exiting slide: ' + slide + '\n' + 'Was current: ' + this.current.slideId);
     
     data = {
       type: "system",
       categoryId: null,
       category: "slideExit",
       labelId: "id",
       label: "name",
       valueId: self.current.slideId,
       value: undefined,
       valueType: undefined,
       time: now,
       slideIndex: undefined,
       parentSlideName:undefined,
       parentOfParentSlideName: undefined
     };
     
     // Set the entered slide as the current one
     self.current.slideId = null;
     
     self.save(data);
     
   },
   
   // Monitor opened documents
   document: function (documentId, documentName) {
   
     var data, now;
     
     now = this.timestamp();
  
     // The data to be sent to database
     data = {
       type: "system",
       categoryId: null,
       category: "documentOpen",
       labelId: "id",
       label: "name",
       valueId: documentId,
       value: documentName,
       valueType: null,
       time: now
     };
     
     this.save(data);
     
   },
   
   // Monitor opened references
   reference: function (referenceId, referenceName) {
   
     var data, now;
     
     now = this.timestamp();
     
     // The data to be sent to database
     data = {
       type: "system",
       categoryId: null,
       category: "referenceOpen",
       labelId: "id",
       label: "name",
       valueId: referenceId,
       value: referenceName,
       valueType: null,
       time: now
     };
     
     this.save(data);
     
   },
   
   // Monitor viewed popups
   popupEnter: function (category, name) {},

   popupExit: function (category, name) {},
   
   // Monitor viewed videos
   video: function (category, name) {},
   
   // Monitor input values
   input: function (category, inputElement, type, unique) {
     // TODO: read value from inputElement and save it
   },
   
   // Monitor clicked elements
   click: function (category, name, unique) {
     
     var data, now, isUnique;
     
     now = this.timestamp();
     
     isUnique = unique || true;
     
     data = {
       isUnique: isUnique,
       type: "custom",
       category: category,
       label: name,
       value: 'clicked',
       time: now
     }
     
     this.save(data);
   },
   
   // Monitor that something has been viewed
   view: function (category, name, unique) {
     
     var data, now, isUnique;
     
     now = this.timestamp();
     
     isUnique = unique || true;
     
     data = {
       isUnique: isUnique,
       type: "custom",
       category: category,
       label: name,
       value: 'viewed',
       time: now
     }
     
     this.save(data);
   },
   
   uniqueEvent: function (category, label, value, valueType) {
     
     var data, now;
     
     now = this.timestamp();
     
     data = {
       isUnique: true,
       type: "custom",
       category: category,
       label: label,
       value: value,
       time: now
     }
     
     this.save(data);
   },
   
   // Monitor everything else
   event: function (category, label, value, valueType) {
     
     var data, now;
     
     now = this.timestamp();
     
     data = {
       type: "custom",
       category: category,
       label: label,
       value: value,
       time: now
     }
     
     this.save(data);
     
   }
   
  };
  
  // Backwards compatibility
  window.submitSlideEnter = monitor.slide;
  window.submitSlideExit = monitor.slideExit;
  
  monitor.init();
 
 })();