	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s1_3 = {
			elements: {
      		painContent: "#s1_3_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.prev('nviz1', 'nviz1', "s1_3");
				submitSlideEnter('s1_3', '3', 3, '3', 'A WH_Beauty_1_cycle_2015');

				$('#nv1_3-drag').draggable({
					revert: true
				});
				$('#nv1_3-drop').droppable({
					drop: function(){
						$('#nv1_3-drag').hide(1000);
						setTimeout(
							function () {
								app.slideshow.next()
							}
							, 1200)
					}
				});
			},
			onExit:function(slideElement){
				submitSlideExit('s1_3');

				$('#nv1_3-drag').draggable('destroy').show(500);
				$('#nv1_3-drop').droppable('destroy');
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