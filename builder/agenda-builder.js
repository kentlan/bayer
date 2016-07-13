(function(){
	'use strict';
	var builder = {},
		slidesMap = {
			s1s: ['s1s'],
			s2s: ['s2s'],
			s3s: ['s3s']

		},
		neededSlidesList, chaptersList, presentationName, builderSlideElement,
		wasTransfered = false;



	builder.checkIfNeedToLoadPresentation = function(){
		var params = window.location.search,
			puidReg = /puid=([0-9]+)/,
			id, presentation;

		if(params && puidReg.test(params)){
			id = parseInt(puidReg.exec(params)[1], 10);
			presentation = getPresentation(id);
			app.slideshows['s1s'].content = app.slideshows['s1s'].content.slice(0, 1).concat(presentation.map);
		}
	};


	window.builder = builder;
})();