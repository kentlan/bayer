(function(){
	'use strict';
	function videoPopupsBuild(element){
		var videoSrc = element.getAttribute("data-video"), fragment,
			video, videoWrapper, videoContainer;
		if(videoSrc){
			element.addEventListener('click', function(event){
				event.stopPropagation();
				event.preventDefault();
				videoSrc = element.getAttribute("data-video");
				fragment = document.createDocumentFragment();
				videoWrapper = window.videoFullScreenWrapper;
				videoContainer = videoWrapper.getElementsByClassName('video-popup-wrapper')[0];
				if(videoContainer){
					videoWrapper.removeChild(videoContainer);
				}
				video = document.createElement('video');
				videoContainer = document.createElement('div');
				videoContainer.className = "video-popup-wrapper";
				video.setAttribute('src', videoSrc);
				video.setAttribute('width', "640");
				video.setAttribute('height', "480");
				video.setAttribute('controls', "");
				video.setAttribute('webkit-playsinline', "");
				videoContainer.appendChild(video);
				fragment.appendChild(videoContainer);
				videoWrapper.appendChild(fragment);
				videoWrapper.addClass('active');
				video.play();
				video.webkitEnterFullscreen();
			});
		}
	}
	function videoPopupsClose(){
		var videoWrapper = window.videoFullScreenWrapper,
			videoContainer;
		videoContainer = videoWrapper.getElementsByClassName('video-popup-wrapper')[0];
		if(videoContainer){
			videoWrapper.removeChild(videoContainer);
			videoWrapper.removeClass('active');
		}
	}
	document.addEventListener("contentLoad", function(){
		if(!window.videoFullScreenWrapper){
			var videoWrapper = document.createElement("div");
			videoWrapper.setAttribute("id", 'videoFullScreenWrapper');
			window.presentation.appendChild(videoWrapper);
			videoWrapper.addEventListener('click', videoPopupsClose);
		}
		document.getElementsByClassName('play').forEach(function(element){
			element.addEventListener("click", function(event){
				event.stopPropagation();
				event.preventDefault();
				element.removeClass('poster');
				element.previousElementSibling.play();
				if(element.hasClass('played')){
					element.previousElementSibling.pause();
					element.removeClass('played');
				}else{
					element.previousElementSibling.play();
					element.addClass('played');
				}
			});
		});
		document.querySelectorAll('[data-video]').forEach(function(element){
			videoPopupsBuild(element);
		});
		document.getElementsByTagName('video').forEach(function(video){
			video.addEventListener("ended", function() {
//				video.play();
				video.pause();
//				video.setTime = 1;
				if(video.nextElementSibling.hasClass('play')){
//					video.nextElementSibling.style.background = "url(" + video.getAttribute('poster') + ")";
					video.nextElementSibling.removeClass('played');
				}
			});
		});
		document.addEventListener('slideExit', function(){
			videoPopupsClose(window[app.slideshow.current]);
			window[app.slideshow.current].getElementsByTagName('video').forEach(function(video){
				video.pause();
				if(video.nextElementSibling.hasClass('play')){
					video.nextElementSibling.removeClass('played');
				}
			});
		});
	});
})();
