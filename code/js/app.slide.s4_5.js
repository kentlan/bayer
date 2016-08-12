	document.addEventListener('presentationInit', function(){
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