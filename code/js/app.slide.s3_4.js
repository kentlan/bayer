	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s3_4 = {
			elements: {
      		painContent: "#s1_3_4"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTopSelected("menu_top_4");					
				presentetion.prev('nviz3', 'nviz3', "s3_4");
				submitSlideEnter('s3_4', '2', 2, '2', 'A WH_Beauty_1_cycle_2015');

				openSource('.nv3_4 .info-btn', '.nv3_4 .source');

				$('.nv3_4 .switch').click(
					function () {
						$(".nv3_4").toggleClass("changed");
					}
				);
			},
			onExit:function(slideElement){
				util.removeClass(slide.element.painContent,'active');
				submitSlideExit('s3_4');
				
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