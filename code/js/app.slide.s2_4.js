	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s2_4 = {
			elements: {
      		painContent: "#s1_2_4"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.prev('nviz2', 'nviz2', "s2_4");
				submitSlideEnter('s2_4', '2', 2, '2', 'A WH_Beauty_1_cycle_2015');

				$('#nv2_4-drag').draggable({
					revert: true
				});
				$('#nv2_4-drop').droppable({
					drop: function(){
						$('#nv2_4-drag').hide(1000);
						setTimeout(
							function () {
								app.slideshow.next()
							}
							, 1200)
					}
				});
			},
			onExit:function(slideElement){
				util.removeClass(slide.element.painContent,'active');
				submitSlideExit('s2_4');

				$('#nv2_4-drag').draggable('destroy').show(500);
				$('#nv2_4-drop').droppable('destroy');
	
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