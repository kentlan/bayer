	document.addEventListener('presentationInit', function(){
		var slide = app.slide.s8_1 = {
			elements: {
				painContent: "#s1_8_1"
			},
			onEnter:function(slideElement){
				//app.menu.show(); 
				util.addClass(slide.element.painContent, 'active');
				submitSlideEnter('s8_1', '1', 1, '1', 'A WH_Beauty_1_cycle_2015');
				//previevs();	
				var text_survey_1 = ''; /*переменная зранения ответов*/
				var question_survey_1 = 'Какие интернет-сообщества вы посещаете?'; /*переменная вопроса*/
				var comment_val = ''; 

				/*отмечаем чекбоксы*/
				$('.survey_1').bind('click', function(event) {
					text_survey_1 = '';
					$('.survey_1').each(function() {
						if ($(this).prop('checked')) 
						{
							text_survey_1 = text_survey_1 + $(this).attr('data-title') + ' ' ;
						}


						if ($(".survey_nothing").is(":checked"))
						{	
							$('.survey_site').removeAttr("checked");
							$('.survey_site').removeClass("active");
						} else {
							$('.survey_site').addClass("active");
						};

						if ($(".survey_other").is(":checked"))
						{
							$('#comment')	.removeAttr("readonly")
														.css("color","#000")
														.addClass("active");
							comment_val = $('#comment').val();
						} else {
							$('#comment')	.attr("readonly", true)
														.css("color","#ddd")
							 							.removeClass("active");
						};

						if(text_survey_1 === '') {
							$('#sent_survey_1').removeClass('active');
						} else {
							$('#sent_survey_1').addClass('active');
						}
					});
				});
				

				/*работаем с полем для пункта ДАЛЕЕ*/
				$('#comment').on('focus', function (){
					var maxLength = $('#comment').attr('maxlength'); 
					$('#comment').on('keyup', function() {
						var curLength = $('#comment').val().length;
						comment_val = $('#comment').val();
						$("#free_symbols").text(maxLength - curLength);
					});

				});									

				$('#comment').on('blur', function (){
					if ($(".survey_other").is(":checked")) {
						text_survey_1 = text_survey_1 + comment_val;
					}
					comment_val = '';
											
				});

				/*отправляем результат опроса*/
				$('#sent_survey_1').on(ev, function() {
					if(text_survey_1 !== '') {
						$('#transmission_report_1').addClass('active');
						submitData(text_survey_1, question_survey_1)
					};
				}); 

				/*закрываем окно с отчетом об отправке*/
				$('#sent_survey_1_btn').on(ev, function() {
					$('#transmission_report_1').removeClass('active');
					app.goTo('s8_2s', 's8_2');
				});

			},
			onExit:function(slideElement){
				submitSlideExit('s8_1');
				

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