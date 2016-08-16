	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s4_2 = {
			elements: {
      		painContent: "#s4_2_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.menuTop("Mir");	
				presentetion.menuTopSelected("menu_top_2");
				presentetion.prev('nviz4', 'nviz4', "s4_2");

				var sliderTooltip = function(event, ui) {
					var curValue = ui.value || 1;
					var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + curValue + '</div><div class="tooltip-arrow"></div></div>';

					$('.ui-slider-handle').html(tooltip);

					if(ui.value == 200) {
						$('.rv1_2 .knee').removeClass("stage2").addClass("stage3");
					} else if (ui.value >= 100 && ui.value < 200) {
						$('.rv1_2 .knee').addClass("stage2").removeClass("stage3");
					} else if(ui.value < 100) {
						$('.rv1_2 .knee').removeClass("stage2").removeClass("stage3");
					}

				};

				$( "#rv1_2_slider" ).slider({
					value : 1,
					min : 1,
					max : 200,
					step : 1,
					range: 'min',
					create: sliderTooltip,
					slide: sliderTooltip
				});



				openPopup('.rv1_2 .button', '.rv1_2 .popup');

				openSource('.rv1_2 .info-btn', '.rv1_2 .source')
			},
			onExit:function(slideElement){
				submitSlideExit('s4_2');

				closePopup();
				$('.rv1_2 .knee').removeClass("stage2").removeClass("stage3");
				$('.tooltip-inner').html('1');
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