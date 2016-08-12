document.addEventListener('presentationInit', function () {
    var slide = app.slide.s1_4 = {
        elements: {
            painContent: "#s1_4_2"
        },
        onEnter: function (slideElement) {
            app.menu.show();
            util.addClass(slide.element.painContent, 'active');
            presentetion.prev('nviz1', 'nviz1', "s1_4");
            submitSlideEnter('s1_4', '4', 4, '4', 'A WH_Beauty_1_cycle_2015');

            $('#nv1_4-drag').draggable({
                revert: true
            });
            $('#nv1_4-drop').droppable({
                drop: function(){
                    $('#nv1_4-drag').hide(1000);
                    setTimeout(
                        function () {
                            app.slideshow.next()
                        }
                        , 1200)
                }
            });


        },
        onExit: function (slideElement) {
            submitSlideExit('s1_4');

            presentetion.closePopup();

        }



    }


});




