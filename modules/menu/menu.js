/**
 * AGNITIO FRAMEWORK MODULE - Menu
 * This is a slideshow/collection menu that will allow you to easily
 * link to all your slideshows, collections, and slides.
 * NOTE: There is no scrolling of menu currently included
 * @author - Stefan Liden, sli@agnitio.com
 */

(function () {

    var currentMenu = null;

    window.Menu = function (config) {
        this.version = '1.1';
        this.config = config || {};
        this.containerId = this.config.container || 'mainmenu';
        this.ele = app.elements.menu = document.getElementById(this.containerId);
        this.menuItems = this.config.links;
        this.attachTo = this.config.attachTo || [];
        this.offset = this.config.offset || 0;
        this.initialized = false;
        this._init();
    };

    Menu.prototype = {
        _init: function () {
            var self = this;
            // Initialize and/or insert menu when content is loaded

            document.addEventListener('contentLoad', function () {
                if (self.attachTo.indexOf(app.loaded.id) > -1 || self.attachTo.length === 0) {
                    currentMenu = self;
                    if (self.initialized) {
                        self._connect();
                        self._insert();
                    }
                    else {
                        self.content = (app.loaded.type === 'slideshow' ? app.slideshows[app.loaded.id] : app.collections[app.loaded.id]);
                        self._build();
                        self._insert();
                        self._connect();
                        self.initialized = true;
                    }
                    if (app.loaded.type === 'slideshow') {
                        document.addEventListener('slideEnter', self._setCurrent);
                    }
                    else {
                        document.addEventListener('sectionEnter', self._setCurrent);
                    }
                }
            });

            // If slideshow/collection specific menu, remove when content unloads
            document.addEventListener('contentUnload', function () {
                if (self.attachTo.indexOf(app.loaded.id) > -1) {
                    self._remove();
                    if (app.loaded.type === 'slideshow') {
                        document.removeEventListener('slideEnter', self._setCurrent);
                    }
                    else {
                        document.removeEventListener('sectionEnter', self._setCurrent);
                    }
                }
            });
        },

        // Create the HTML of the menu
        _build: function () {
            var self = this,
          markup = '';
            // markup = '<ul id="' + app.loaded.id + 'Menu" class="menu">';
            this.menuItems.forEach(function (item) {
                item.className = item.className || "";
                var li = '<li data-goto="' + item.goTo + '" class="' + item.className + '">' + item.title + '</li>';
                markup += li;
            });
            // markup += '</ul>';
            this.markup = markup;
        },

        // Add markup to index page
        _insert: function () {
            var list = document.createElement('ul'),
          scrollLimit = 0;
            list.id = app.loaded.id + 'Menu';
            list.setAttribute('class', 'menu');
            list.innerHTML = this.markup;
            this.ele.appendChild(list);
            this.list = list;

            this._getWidth();

            // Find scroll limit
            scrollLimit = app.dimensions[0] - this.menuWidth;

            this.scroller = new Draggy(list.id, { restrictY: true, limitsX: [scrollLimit, 0] });
            this.scroller.moveTo(this.offset, 0);
        },

        // Clean up if unloading
        _remove: function () {
            this.ele.removeEventListener('tap', this._navigate);
            this.ele.removeEventListener('swipeleft', touchy.stop);
            this.ele.removeEventListener('swiperight', touchy.stop);
            this.ele.removeChild(this.list);
        },

        // Get the width of each link item
        // Update width of menu (ul)
        _getWidth: function () {
            var links = this.ele.querySelectorAll('li');
            this.menuWidth = 0;
            for (var i = 0, len = links.length; i < len; i++) {
                var width = links[i].getBoundingClientRect().width;
                this.menuWidth += width;
            }
        },

        // Update menu item classes (remove and add .selected)
        // Break up data-goto attribute and use it to call app.goTo
        _navigate: function (event) {
            var ele = event.target;
            var prev, attr, linkArr, name, content, subcontent;
            if (ele.nodeType === 3) {
                ele = ele.parentNode;
            }
            prev = this.querySelector('.selected');
            attr = ele.getAttribute('data-goto');
            if (attr) {
                if (prev) { util.removeClass(prev, 'selected'); }
                linkArr = attr.split('.');
                name = linkArr[0];
                content = linkArr[1] || '';
                subcontent = linkArr[2] || '';
                util.addClass(ele, 'selected');
                app.goTo(name, content, subcontent);
            }
        },

        // Add internal event listeners
        _connect: function () {
            var self = this;
            this.ele.addEventListener('tap', this._navigate);
            this.ele.addEventListener('swipeleft', touchy.stop);
            this.ele.addEventListener('swiperight', touchy.stop);
        },

        // Called on 'slideEnter' or 'sectionEnter'
        _setCurrent: function () {
            var prev = currentMenu.list.querySelector('.selected'),
          query = '[data-goto="' + app.loaded.id + '.' + app.loaded.current + '"]';
            link = currentMenu.list.querySelector(query);
            if (prev) { util.removeClass(prev, 'selected'); }
            if (link) {
                util.addClass(link, 'selected');
                var pos = util.getPosition(link)[0] + currentMenu.offset;
                var wd = link.getBoundingClientRect().width;
                var rightPos = pos + wd;
                var toMove = 0;
                var defaultOffset = currentMenu.config.offset || 0;
                var absOffset = Math.abs(defaultOffset);
                var appWidth = app.dimensions[0];
                if (rightPos >= appWidth) {
                    toMove = (rightPos - appWidth) - currentMenu.offset;
                    currentMenu.list.style.webkitTransitionDuration = '0.5s';
                    currentMenu.list.style.webkitTransform = 'translate3d(-' + toMove + 'px, 0, 0)';
                    currentMenu.offset = -toMove;
                }
                else if (pos < 0) {
                    toMove = pos - currentMenu.offset;
                    currentMenu.list.style.webkitTransitionDuration = '0.5s';
                    currentMenu.list.style.webkitTransform = 'translate3d(-' + toMove + 'px, 0, 0)';
                    currentMenu.offset = -toMove;
                }
                else if (rightPos > absOffset && (rightPos + absOffset + wd) < appWidth) {
                    toMove = defaultOffset;
                    currentMenu.list.style.webkitTransitionDuration = '0.5s';
                    currentMenu.list.style.webkitTransform = 'translate3d(' + toMove + 'px, 0, 0)';
                    currentMenu.offset = toMove;
                }
            }
        }
    };

})();
