	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s3_3 = {
			elements: {
      		painContent: "#s1_3_3"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTopSelected("menu_top_3");					
				presentetion.prev('flex', 'flex_3', "s3_3");			
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
setTimeout(function() { app.slideshow.scrollTo(link1) }, 500);*/