	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s1_2 = {
			elements: {
      		painContent: "#s1_2_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.prev('qlaira', 'qlaira_2', "s1_2");
				submitSlideEnter('s1_2', '2', 2, '2', 'A WH_Beauty_1_cycle_2015');
				

				
			},
			onExit:function(slideElement){
				submitSlideExit('s1_2');
				
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