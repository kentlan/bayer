	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s2_2 = {
			elements: {
      		painContent: "#s1_2_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.prev('nviz2', 'nviz2', "s2_2");
				submitSlideEnter('s2_1', '2', 2, '2', 'A WH_Beauty_1_cycle_2015');


				var sliderTooltip = function(event, ui) {
					var curValue = ui.value || 1;
					var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + curValue + '</div><div class="tooltip-arrow"></div></div>';

					$('.ui-slider-handle').html(tooltip);

					if(ui.value >= 10) {
						$('.nv2_2 .disease').hide();
						$('.nv2_2 .tissue').addClass("changed");
					} else if (ui.value >= 5) {
						$('.nv2_2 .disease').addClass("changed");
					} else {
						$('.nv2_2 .disease, .nv2_2 .tissue').show().removeClass("changed");
					}

				}

				$( "#nv2_2_slider" ).slider({
					value : 0,
					min : 0,
					max : 10,
					step : 1,
					range: 'min',
					create: sliderTooltip,
					slide: sliderTooltip
				});



				openPopup('.nv2_2 .button', '.nv2_2 .popup');

				openSource('.nv2_2 .info-btn', '.nv2_2 .source')



			},
			onExit:function(slideElement){
				submitSlideExit('s2_1');
				
	
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