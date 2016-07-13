	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s1_28 = {
			elements: {
      		painContent: "#s1_28_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.prev('qlaira', 'qlaira_7', "s1_28");
				submitSlideEnter('s1_28', '28', 28, '28', 'A WH_Beauty_1_cycle_2015');
				
				
				function hiddenImg() {
					var a = document.getElementById('step1');
					a.addClass('activeHidden');
				};
				setTimeout(hiddenImg, 9000);

				

				
			},
			onExit:function(slideElement){
				submitSlideExit('s1_28');
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