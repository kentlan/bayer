	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s8_2 = {
			elements: {
				painContent: "#s1_8_2"
			},
			onEnter:function(slideElement){
				//app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				submitSlideEnter('s8_2', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');
				//previevs();	

				var text_survey_2 = ''; /*переменная зранения ответов*/
				var question_survey_2 = 'Смотрите ли вы вебинары?'; /*переменная вопроса*/

				/*отмечаем чекбоксы*/
				$('.survey_2').bind('click', function(event) {
					text_survey_2 = $('input[name=survey_2]:checked').val();
					if(text_survey_2 !== false) {
						$('#sent_survey_2').addClass('active');
					};
				});


				$('#sent_survey_2').on(ev, function() {
					if(text_survey_2 !== false) {
						$('#transmission_report_2').addClass('active');
						submitData(text_survey_2, question_survey_2);
					};
				});

				/*закрываем окно с отчетом об отправке*/
				$('#sent_survey_2_btn').on(ev, function() {
					$('#transmission_report_2').removeClass('active');
					app.goTo('s1s', 's1');
				});

			},
			onExit:function(slideElement){
				submitSlideExit('s8_2');
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