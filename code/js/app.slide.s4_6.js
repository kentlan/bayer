	document.addEventListener('presentationInit', function(){
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