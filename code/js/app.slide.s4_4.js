	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s4_4 = {
			elements: {
      		painContent: "#s4_4_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTop("Mir");	
				presentetion.menuTopSelected("menu_top_3");
				presentetion.prev('nviz4', 'nviz4', "s4_4");
				//submitSlideEnter('s1_1', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');

				$('#rv1_4-drag').draggable({
					revert: true
				});
				$('#rv1_4-drop').droppable({
					drop: function(){
						$('#rv1_4-drag').hide(1000);
						setTimeout(
							function () {
								app.slideshow.next()
							}
							, 1200)
					}
				});
			},
			onExit:function(slideElement){
				submitSlideExit('s4_4');
				$('#nv3_4-drag').draggable('destroy').show(500);
				$('#nv3_4-drop').droppable('destroy');
	
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