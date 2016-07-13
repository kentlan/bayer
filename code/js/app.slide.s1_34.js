	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s1_34 = {
			elements: {
      		painContent: "#s1_34_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				document.getElementById('popup_s1_34__1').addClass('active');	
				presentetion.prev('qlaira', 'qlaira_7', "s1_34");						
				submitSlideEnter('s1_34', '34', 34, '34', 'A WH_Beauty_1_cycle_2015');
				
			},
			onExit:function(slideElement){
				submitSlideExit('s1_34');
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