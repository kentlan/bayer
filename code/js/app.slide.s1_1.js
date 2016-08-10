	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s1_1 = {
			elements: {
      		painContent: "#s1_1_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');

				presentetion.bgStyle('nv1', 'nv1_', 7);
				presentetion.prev('qlaira', 'qlaira_1', "s1_1");					
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
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/