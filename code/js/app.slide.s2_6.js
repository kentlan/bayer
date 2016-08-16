	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s2_6 = {
			elements: {
      		painContent: "#s1_2_6"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.prev('nviz2', 'nviz2', "s2_6");
				submitSlideEnter('s2_6', '2', 2, '2', 'A WH_Beauty_1_cycle_2015');

				openSource('.nv2_6 .info-btn', '.nv2_6 .source');

				$('.nv2_6 .switch').click(
					function () {
						$(".nv2_6").toggleClass("changed");
					}
				);
			},
			onExit:function(slideElement){
				util.removeClass(slide.element.painContent,'active');
				submitSlideExit('s2_6');
				
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