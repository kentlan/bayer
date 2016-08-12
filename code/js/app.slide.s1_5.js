	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s1_5 = {
			elements: {
      		painContent: "#s1_5_2"
    		},
			onEnter:function(slideElement){
				app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				presentetion.prev('nviz1', 'nviz1', "s1_5");
				submitSlideEnter('s1_5', '5', 5, '5', 'A WH_Beauty_1_cycle_2015');


				$('.nv1_5 .info-btn').click(
					function () {
						$('.nv1_5 .source').show().click(
							function () {
								$('.nv1_5 .source').hide();
							}
						)
					}
				);

				$('.nv1_5 .popup .switch').click(
					function () {
						$(".nv1_5 .popup .content ").toggleClass("changed");
					}
				);

				$('.nv1_5 .button').click(
					function () {
						$('.nv1_5 .popup').show();
						$('.nv1_5 .popup .close-btn').click(
							function () {
								$('.nv1_5 .popup').hide();
							}
						)
					}
				);
				
			},
			onExit:function(slideElement){
				submitSlideExit('s1_5');
			}
		}

	});
