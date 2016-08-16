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




				openSource('.nv1_5 .info-btn', '.nv1_5 .source');

				$('.nv1_5 .popup .switch').click(
					function () {
						$(".nv1_5 .popup .content ").toggleClass("changed");
					}
				);

				openPopup('.nv1_5 .button', '.nv1_5 .popup');
			},
			onExit:function(slideElement){
				submitSlideExit('s1_5');

				closePopup();
			}
		}

	});
