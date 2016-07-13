	document.addEventListener('presentationInit', function(){
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
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/