// Contains a modified version of Bootstrap's Carousel plugin.
// Integrates these pull requests:
// - https://github.com/twitter/bootstrap/pull/2190
// - https://github.com/twitter/bootstrap/pull/2404
(function () {
    /* ==========================================================
     * bootstrap-carousel.js v2.0.1
     * http://twitter.github.com/bootstrap/javascript.html#carousel
     * ==========================================================
     * Copyright 2012 Twitter, Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     * ========================================================== */


    !function( $ ){

      "use strict"

     /* CAROUSEL CLASS DEFINITION
      * ========================= */

      var Carousel = function (element, options) {
        this.$element = $(element)
        this.options = $.extend({}, $.fn.carousel.defaults, options)
        this.options.slide && this.slide(this.options.slide)
      }

      Carousel.prototype = {

        cycle: function () {
          this.interval = setInterval($.proxy(this.next, this), this.options.interval)
          return this
        }

      , to: function (pos) {
          var $active = this.$element.find('.active')
            , children = $active.parent().children()
            , activePos = children.index($active)
            , that = this

          if (pos > (children.length - 1) || pos < 0) return

          if (this.sliding) {
            return this.$element.one('slid', function () {
              that.to(pos)
            })
          }

          if (activePos == pos) {
            return this.pause().cycle()
          }

          return this.slide(pos > activePos ? 'next' : 'prev', $(children[pos]))
        }

      , pause: function () {
          clearInterval(this.interval)
          this.interval = null
          return this
        }

      , next: function () {
          if (this.sliding) return
          return this.slide('next')
        }

      , prev: function () {
          if (this.sliding) return
          return this.slide('prev')
        }

      , slide: function (type, next) {
          var $active = this.$element.find('.active')
            , $next = next || $active[type]()
            , isCycling = this.interval
            , direction = type == 'next' ? 'left' : 'right'
            , fallback  = type == 'next' ? 'first' : 'last'
            , that = this
            , fromIndex
            , toIndex

          if (!$next.length && !this.options.loop) return

          this.sliding = true

          isCycling && this.pause()

          $next = $next.length ? $next : this.$element.find('.item')[fallback]()

          fromIndex = $active.index();
          toIndex = $next.index();
          if (!$.support.transition && this.$element.hasClass('slide')) {
            this.$element.trigger('slide', [fromIndex, toIndex])
            $active.removeClass('active')
            $next.addClass('active')
            this.sliding = false
            this.$element.trigger('slid')
          } else {
            $next.addClass(type)
            $next[0].offsetWidth // force reflow
            $active.addClass(direction)
            $next.addClass(direction)
            this.$element.trigger('slide', [fromIndex, toIndex])
            this.$element.one($.support.transition.end, function () {
              $next.removeClass([type, direction].join(' ')).addClass('active')
              $active.removeClass(['active', direction].join(' '))
              that.sliding = false
              setTimeout(function () { that.$element.trigger('slid') }, 0)
            })
          }

          isCycling && this.cycle()

          return this
        }

      }


     /* CAROUSEL PLUGIN DEFINITION
      * ========================== */

      $.fn.carousel = function ( option ) {
        return this.each(function () {
          var $this = $(this)
            , data = $this.data('carousel')
            , options = typeof option == 'object' && option
          if (!data) $this.data('carousel', (data = new Carousel(this, options)))
          if (typeof option == 'number') data.to(option)
          else if (typeof option == 'string' || (option = options.slide)) data[option]()
          else data.cycle()
        })
      }

      $.fn.carousel.defaults = {
        interval: 5000
      }

      $.fn.carousel.Constructor = Carousel


     /* CAROUSEL DATA-API
      * ================= */

      $(function () {
        $('body').on('click.carousel.data-api', '[data-slide]', function ( e ) {
          var $this = $(this), href
            , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
            , options = !$target.data('modal') && $.extend({}, $target.data(), $this.data())
          $target.carousel(options)
          e.preventDefault()
        })
      })

    }( window.jQuery );
})();


function setupCarousel(carousel, startDelayMillisecs) {
    var DOT_ACTIVE = 'active';

    function start() {
        carousel.carousel({
            interval: 3000,
            loop: true
        });
    }

    // Right when transition starts, immediately highlight dot corresponding
    // to the image we're transitioning to.
    //
    // `fromIndex` and `toIndex` are provided by our customized Carousel
    // plugin.
    function onSlide(event, fromIndex, toIndex) {
        var dots = dotBox.find('a');
        dots.eq(fromIndex).removeClass(DOT_ACTIVE);
        dots.eq(toIndex).addClass(DOT_ACTIVE);
    }

    var dotBox = $('<div>', {
        'class': 'carousel-dots'
    });
    carousel.find('.item').each(function (i) {
        var item = $(this);
        var dot = $('<a>', {
            href: '#'
        });
        dot.click(function (event) {
            event.preventDefault();
            carousel.carousel(i);
        });
        dot.append('<span>');
        dotBox.append(dot);
    });
    dotBox.find(':first-child').addClass(DOT_ACTIVE);
    var header = carousel.prev('h4').wrap('<div class="header-bar"></div>');
    var headerBar = header.parent();
    headerBar.append(dotBox);
    carousel.on('slide', onSlide);
    setTimeout(start, startDelayMillisecs);
}

function setupCarousels() {
    $('.carousel').each(function (i) {
        setupCarousel($(this), i * 1500);
    });
}

function setupPhotoPopovers() {
    function getPlacement(tip, element) {
        element = $(element);
        var elementPos = element.offset();
        var elementCenterX = elementPos.left + element.width() / 2;
        var docCenterX = $(document).outerWidth() / 2;
        if (elementCenterX > docCenterX) {
            return 'left';
        }
        return 'right';
    }

    $('.photo[data-content!=""]').popover({
        placement: getPlacement
    });
}