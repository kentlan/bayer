	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s2_9 = {
			elements: {
      		painContent: "#s1_2_9"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.prev('vis', 'vis_4', "s2_9");
				submitSlideEnter('s2_9', '2', 2, '2', 'A WH_Beauty_1_cycle_2015');
			},
			onExit:function(slideElement){
				util.removeClass(slide.element.painContent,'active');
				submitSlideExit('s2_9');
				
	
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