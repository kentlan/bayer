	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s3_31 = {
			elements: {
      		painContent: "#s1_3_31"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');

				slide.thumb_s1_7 = new Draggy('thumb_s1_7', {restrictY: true, limitsX: [0, 920], onChange:slide.movethumb_s1_7});
		
        app.addEvent('tap', slide.showEighty, slide.element.menArea);
        app.addEvent('onDrop', slide.monitorSlider, document);
        app.addEvent('swipeup', touchy.stop, slide.element.handlePrevent);
        app.addEvent('swipedown', touchy.stop, slide.element.handlePrevent);				

				document.getElementById('s1_7_menstruation').addEventListener('touchend', function() {event.stopPropagation();});



				presentetion.menuTopSelected("menu_top_9");
				presentetion.prev('flex', 'flex_9', "s3_31");
				submitSlideEnter('s3_31', '2', 2, '2', 'A WH_Beauty_1_cycle_2015');
			},
			onExit:function(slideElement){
				/*util.removeClass(slide.element.painContent,'active');*/
				submitSlideExit('s3_31');
				
	
			},

	    movethumb_s1_7: function(x) {
	    var currentNumber29 = Math.round(x/92),
			slider_s1_7 = "0px";
			question_value = "Какому % женщин от всех принимающих КОК вы назначаете КОК в пролонгированном режиме?";
			label_id = "s3_31";
			switch (currentNumber29) {
				case 0:
				{	slider_s1_7 = '42px',
					response_value = 0};
			break	
				case 1:
				{	slider_s1_7 = '135px',
					response_value = 10};
			break
				case  2:
				{	slider_s1_7 = '226px',
					response_value = 20};
			break
				case  3:
				{ slider_s1_7 = '317px',
					response_value = 30};
			break
				case  4:
				{ slider_s1_7 = '410px',
					response_value = 40};
			break
				case  5:
				{ slider_s1_7 = '500px',
					response_value = 50};
			break
				case  6:
				{ slider_s1_7 = '592px',
					response_value = 60};
			break
				case  7:
				{ slider_s1_7 = '684px',
					response_value = 70};
			break
				case  8:
				{ slider_s1_7 = '775px',
					response_value = 80};
			break
				case  9:
				{ slider_s1_7 = '867px',
					response_value = 90};
			break
				case  10:
				{ slider_s1_7 = '958px',
					response_value = 100};
			break
			
			};
			$('#slider_s1_7').css("left" , slider_s1_7);	
			
		},

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