	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s6_3 = {
			elements: {
      		painContent: "#s6_3_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTop("Mir");	
				presentetion.menuTopSelected("menu_top_2");
				presentetion.prev('nviz6', 'nviz6', "s6_3");
				//submitSlideEnter('s1_1', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');

				openSource('.rv3_3>.info-btn', '.rv3_3>.source');
				openSource('.rv3_3>.popup .info-btn', '.rv3_3>.popup .source');

				$('.rv3_3 .switch').click(
					function () {
						$(".rv3_3").toggleClass("changed");
					}
				);

				openPopup('.rv3_3 .button', ".rv3_3>.popup");
				openPopup('.rv3_3>.popup .button', ".rv3_3>.popup>.popup.synergy");

				$('.rv3_3>.popup>.popup.synergy .close-btn').click(
					function () {
						$('.rv3_3>.popup').show();
					}
				)
			},
			onExit:function(slideElement){
				submitSlideExit('s6_3');
				
				closePopup();
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