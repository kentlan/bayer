	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s3_3 = {
			elements: {
      		painContent: "#s1_3_3"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTopSelected("menu_top_3");					
				presentetion.prev('nviz3', 'nviz3', "s3_3");
				submitSlideEnter('s3_1', '2', 2, '2', 'A WH_Beauty_1_cycle_2015');

				openSource('.nv3_3>.info-btn', '.nv3_3>.source');
				openSource('.nv3_3>.popup .info-btn', '.nv3_3>.popup .source');

				$('.nv3_3 .switch').click(
					function () {
						$(".nv3_3").toggleClass("changed");
					}
				);

				openPopup('.nv3_3 .button', ".nv3_3>.popup");
				openPopup('.nv3_3>.popup .button', ".nv3_3>.popup>.popup.synergy");

				$('.nv3_3>.popup>.popup.synergy .close-btn').click(
					function () {
						$('.nv3_3>.popup').show();
					}
				)
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