document.addEventListener('presentationInit', function() {

  var slide = app.slide.s1_6 = {
  	elements: {
      painContent: "#s1_6_2"
    },
    onEnter: function(ele) {
     app.menu.show(); 
     util.addClass(slide.element.painContent, 'active');
     presentetion.prev('nviz1', 'nviz1', "s1_6");
     submitSlideEnter('s1_6', '6', 6, '6', 'A WH_Beauty_1_cycle_2015');


        $('.nv1_6 .info-btn').click(
            function () {
                $('.nv1_6 .source').show().click(
                    function () {
                        $('.nv1_6 .source').hide();
                    }
                )
            }
        );

        $('.nv1_6 .switch').click(
            function () {
                $(".nv1_6").toggleClass("changed");
            }
        );
   },
   onExit: function(ele) {
    submitSlideExit('s1_6');
  }
};


}); 

function openWindowSolo1_6(n) {
	var a = document.getElementById('window' + n);

	
	a.addClass('active');	
	
};
















































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