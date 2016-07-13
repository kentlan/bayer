	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s1 = {
			elements: {
      		painContent: "#s1_0"
    		},
			onEnter:function(slideElement){
				app.menu.hide();
				util.addClass(slide.element.painContent, 'active');
				presentetion.prev('empty');
		
				/*переход к разделам после прохождения опроса*/

				// nav_slide = 's8_1',
				// nav_dir = 's8_1s';

				// $('.nav_btn').on(ev, function() {
				// 	app.goTo(nav_dir, nav_slide);
				// 	nav_slide = $(this).attr('data-slide');
				// 	nav_dir = $(this).attr('data-dir');
				// 	console.log(nav_dir, nav_slide);
				// });


			},
			onExit:function(slideElement){
				submitSlideExit('s1');
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