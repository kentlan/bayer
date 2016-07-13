
(function () {

    window.Localisation = function (config) {
        this.version = '1.0';
        this.xml;
        this.config = config || {};
        this._init();
    };

    Localisation.prototype = {
        _init: function () {
            var baseUrl = "modules/localisation/languages/";
            if (window.location.href.indexOf('_ASK_Extensions') > -1) {
                baseUrl = "../../" + baseUrl;
            }
            if (window.location.href.indexOf('_framework') > -1) {
                baseUrl + "../" + baseUrl;
            }

            var self = this;
            $.ajax({
                type: "GET",
                url: baseUrl + language,
                dataType: "xml",
                async: false,
                success: function (xml) {
                    self.xml = xml;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Language xml file not found or is not valid, have you checked the case? " + jqXHR.status + "," + errorThrown);
                }
            });
        },

        getString: function (area, stringName) {
            var toReturn = '';
            $(this.xml).find("Content").each(function () {
                if ($(this).attr("area") == area) {
                    $(this).find("String").each(function () {
                        if ($(this).attr("name") == stringName) {
                            toReturn = $(this).text();
                            return false;
                        }
                    });
                }
            });
            return toReturn;
        },

        _insert: function () {

        },

        _remove: function () {

        }
    };

})();
