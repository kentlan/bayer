	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s5_3 = {
			elements: {
      		painContent: "#s5_3_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTop("Mir");	
				presentetion.menuTopSelected("menu_top_2");
				presentetion.prev('nviz5', 'nviz5', "s5_3");
				//submitSlideEnter('s1_1', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');

				$('#rv2_3-drag').draggable({
					revert: true
				});
				$('#rv2_3-drop').droppable({
					drop: function(){
						$('#rv2_3-drag').hide(1000);
						setTimeout(
							function () {
								app.slideshow.next()
							}
							, 1200)
					}
				});
			},
			onExit:function(slideElement){
				submitSlideExit('s5_3');
				
	
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