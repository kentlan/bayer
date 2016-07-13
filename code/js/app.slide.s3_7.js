	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s3_7 = {
			elements: {
      		painContent: "#s1_3_7"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTopSelected("menu_top_5");					

				var 
				relative_x_start, 
				relative_x_stop,
				go_swipe = 1;	

				$('.btn_s1_8').on('click touchstart', function(){
					scroll_stop = false;
				});

				$('.popup_s1_8_close').on('click touchstart', function(){
					scroll_stop = true;	
				});	

				$('#swipe_slide').on('touchstart', function (event, a) {
					var touch = event.originalEvent.touches[0];
					relative_x_start = touch.pageX;
				});

				$('#swipe_slide').on('touchend', function (event, a) {
					var touch = event.originalEvent.changedTouches[0];
					relative_x_stop = touch.pageX;
					swipeStart();
				});				

				$(".btn_s1_8_1").on('touchstart',function(event) {
					event.stopPropagation();
					if(go_swipe >1) {
						go_swipe = go_swipe - 1;
						swipeSlide();
					};
					
				});

				$(".btn_s1_8_2").on('touchstart',function(event) {
					event.stopPropagation();
					if(go_swipe < 3) {
						go_swipe = go_swipe + 1;
						swipeSlide();
					};
				});
		

				function swipeStart() {
					if(relative_x_start < relative_x_stop) {
						if(go_swipe >1) {
							go_swipe = go_swipe-1;
						};
					};
					if(relative_x_start > relative_x_stop) {
						if(go_swipe < 3) {
							go_swipe = go_swipe+1;
						};
					};

					swipeSlide();					
				};		


				function swipeSlide() {
					$(".swipe_slide").removeClass('active');						
					$(".swipe_slide_" + go_swipe).addClass('active');

					if(go_swipe == 1) {
						$(".btn_s1_8_1").addClass('not_active')
					}
					else{
						$(".btn_s1_8_1").removeClass('not_active');	
					};

					if(go_swipe == 3) {
						$(".btn_s1_8_2").addClass('not_active')
					}
					else{
						$(".btn_s1_8_2").removeClass('not_active');	
					};

				};



				presentetion.prev('flex', 'flex_5', "s3_7");

			},
			onExit:function(slideElement){
				util.removeClass(slide.element.painContent,'active');
				submitSlideExit('s3_7');
				scroll_stop = true;
	
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