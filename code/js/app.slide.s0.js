document.addEventListener('presentationInit', function(){
    var slide = app.slide.s0 = {
        elements: {
            painContent: "#s0_0"
        },
        onEnter:function(slideElement){
            app.menu.hide();
            util.addClass(slide.element.painContent, 'active');
            presentetion.prev('empty');

        },
        onExit:function(slideElement){
            submitSlideExit('s0');
        }
    }

});
