/**
 * Author: Dmitry Sokolov
 * Date: 28.05.12
 * Time: 10:09
 * module for cross chapter navigation with visible transition (for slideshows)
 */


(function(){
	document.addEventListener('presentationInit', function(){
		document.addEventListener('slideEnter', function(){
			app.entered = true;
		});
		document.addEventListener('swipeleft', function(){
			if(app.json.storyboard.indexOf(app.slideshow.id) !== -1){
				var slideshowIndex = app.json.storyboard.indexOf(app.slideshow.id),
					currentSlideshow = app.json.storyboard[slideshowIndex],
					nextSlideshow = app.json.storyboard[slideshowIndex + 1],
					currentSlidesArray = app.json.structures[currentSlideshow].content,
					currentSlideIndex = app.json.structures[currentSlideshow].content.indexOf(app.slideshow.current);
				if(!app.entered || currentSlidesArray.length === 1){
					if(currentSlidesArray.length - 1 === currentSlideIndex && nextSlideshow){
						window.presentation.removeClass('right');
						window.presentation.removeClass('active');
						app.goTo(nextSlideshow);
						window.presentation.addClass('left');
						setTimeout(function(){
							window.presentation.addClass('active');
						}, 0);
					}
				}else{
					app.entered = false;
				}
			}
		});
		document.addEventListener('swiperight', function(){
			if(app.json.storyboard.indexOf(app.slideshow.id) !== -1){
				var slideshowIndex, currentSlideshow, previousSlideshow,
					slidesArrayLenght, previousSlide, currentSlidesArray, currentSlideIndex;
				slideshowIndex = app.json.storyboard.indexOf(app.slideshow.id);
				currentSlideshow = app.json.storyboard[slideshowIndex];
				previousSlideshow = app.json.storyboard[slideshowIndex - 1];
				if(previousSlideshow){
					slidesArrayLenght = app.json.structures[previousSlideshow].content.length;
					previousSlide = app.json.structures[previousSlideshow].content[slidesArrayLenght - 1];
					currentSlidesArray = app.json.structures[currentSlideshow].content;
					currentSlideIndex = app.json.structures[currentSlideshow].content.indexOf(app.slideshow.current);
					if(!app.entered || currentSlidesArray.length === 1){
						if(currentSlideIndex === 0 && previousSlideshow){
							window.presentation.removeClass('left');
							window.presentation.removeClass('active');
							app.goTo(previousSlideshow, previousSlide);
							window.presentation.addClass('right');
							document.getElementsByClassName('slideshow')[0].addClass('zerro-transition');
							setTimeout(function(){
								window.presentation.addClass('active');
								document.getElementsByClassName('slideshow')[0].removeClass('zerro-transition');
							}, 10);
						}
					}else{
						app.entered = false;
					}
				}
			}
		});
	});
})()