/**
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



