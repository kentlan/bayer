        var openSource = function (button, sourceContainer) {
            $(button).click(
                function () {
                    $(sourceContainer).show().click(
                        function () {
                            $(sourceContainer).hide();
                        }
                    )
                }
            );
        };

        var openPopup = function (button, popUp) {
            $(button).click(
                function () {
                    $(popUp).show();
                    $(popUp + ' .close-btn').click(
                        function () {
                            $(popUp).hide();
                        }
                    )
                }
            );
        };