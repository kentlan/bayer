(function() {
	window.util = {
		bind: function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
		addClass: function(ele, classname) {
			if (!this.hasClass(ele, classname)) {
				ele.className += ' ' + classname;
			}
		},
		hasClass: function(ele, classname) {
			if (ele.className) {
				return ele.className.match(new RegExp('(\\s|^)' + classname + '(\\s|$)'));
			} else {
				return false;
			}
		},
		removeClass: function(ele, classname) {
			var cleaned = new RegExp(new RegExp('(\\s|^)' + classname + '(\\s|$)'));
			ele.className = ele.className.replace(cleaned, ' ');
		},
		swapClass: function(ele, classname1, classname2) {
			var cleaned = new RegExp(new RegExp('(\\s|^)' + classname1 + '(\\s|$)'));

			if (this.hasClass(ele, classname1)) {
				ele.className = ele.className.replace(cleaned, ' ');
				ele.className += ' ' + classname2;
			}
		},
		toggleClass: function(ele, classname) {
			if (this.hasClass(ele, classname)) {
				this.removeClass(ele, classname);
			}
			else {
				this.addClass(ele, classname);
			}
		},
		// Wrapper to the iPlanner openPDF function that will monitor clicks
		openPDF: function(doc) {
			var path = 'content/pdf/' + doc;
			openPDF(path);
			submitDocumentOpen(path, doc);
		},
		// PPK script for getting position of element
		// http://www.quirksmode.org/js/findpos.html
		getPosition: function(ele) {
			var curleft = 0;
			var curtop = 0;
			if (ele.offsetParent) {
				do {
					curleft += ele.offsetLeft;
					curtop += ele.offsetTop;
				} while (ele = ele.offsetParent);
			}
			return [curleft,curtop];
		}
	};
})();
window.addEventListener("contentLoad", function(){
	var pdfLinks = document.querySelectorAll('[data-ag-pdf]');
	pdfLinks.forEach(function(element){
		element.addEventListener(touchy.events.start, function(event){
			util.openPDF(this.getAttribute('data-ag-pdf'));
			event.stopPropagation();
		});
	});
});

