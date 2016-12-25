/*
 Version: 1.0
  Author: Mark Marzeotti
 Website: http://markmarzeotti.com/
    Docs: https://github.com/markmarzeotti/lightnav
    Repo: https://github.com/markmarzeotti/lightnav
  Issues: https://github.com/markmarzeotti/lightnav/issues
*/

+function ($) {
  	'use strict';

	$.fn.lightnav = function( options ) {

		// var defaults = {
		// 	navPosition: 'fixed'
	    // };

		// var settings = $.extend( {}, defaults, options );

		this.addClass('lightnav').css('display', 'block');

		// remove navigation so we can add button and wrappers
		var lightnavul = this.find('ul').first().parents().html();
		this.find('ul').first().remove();

		// set up lightnav button to open and close navigation
		this.prepend('<div class="lightnav-button"><div class="lightnav-line"></div></div><div class="lightnav-wrap"><div class="lightnav-outer"><div class="lightnav-inner"></div></div></div>');

		// set various variables for quick access later
		var $lightnav = $('.lightnav'),
			$lightnavOuter = $lightnav.find('.lightnav-outer'),
			$lightnavInner = $lightnav.find('.lightnav-inner'),
			$lightnavButton = $('.lightnav-button');

		$lightnavInner.html(lightnavul);

		var $lightnavUls = $('.lightnav ul ul');

		// switch ( settings.navPosition ) {
		//     case 'fixed':
		//         this.addClass('sleek-fixed');
		//         break;
		//
		//     case 'relative':
		//         this.addClass('sleek-relative');
		//         break;
		//
		//     default:
		//         this.addClass('sleek-fixed');
		// }

		// take all parents and append them above their children so users can still access parent links
		var parent;
		$lightnav.find('ul ul').each(function() {
			//store contents of parent li
			parent = $(this).parent('li').html();
			//prepend ul with its parent link
			$(this).prepend('<li class="menu-parent">' + parent + '</li>');
			//remove ul from contents of parent li
			$(this).children('li').first().children('ul').remove();
		});

		// add proper classes to all inner uls
		var ulCount = 1;
		$lightnavInner.find('ul').first().addClass('lightnav-main lightnav-active');
		$lightnavUls.each(function() {
			$(this).addClass('lightnav-collapse').attr('id', 'lightnav-collapse-' + ulCount);
			$(this).siblings('a').attr('data-toggle', 'lightnavcollapse').attr('data-parent', 'lightnav-menu-' + ulCount).attr('href', '#lightnav-collapse-' + ulCount);
			$(this).closest('li').attr('id', 'lightnav-menu-' + ulCount)
			ulCount++;
		});

		// toggle classes on button click
	    $('.lightnav-button').click(function() {
            $('.lightnav-active').removeClass('lightnav-active');
            $('.lightnav-main').addClass('lightnav-active');
	        $('.lightnav').toggleClass('lightnav-open');
	        $('body').toggleClass('lightnav-no-scroll');
	        $('.lightnav-collapse.in').each(function() {
	            $(this).siblings('a').click();
	        });
	    });

		// toggle classes on subnav parent click
	    $('li').click(function() {

            if ($(this).children('ul').length && !$(this).children('ul').hasClass('lightnav-active')) { // if li has subnav and it is not active
                $('.lightnav-active').removeClass('lightnav-active');
                $(this).children('ul').addClass('lightnav-active');
            } else { // close subnav and restore lightnav-active to parent
                $('.lightnav-active').removeClass('lightnav-active');
                $(this).parent('ul').addClass('lightnav-active');
            }

	        $(this).siblings().each(function() {
	            if ($(this).children('ul').hasClass('in')) { // if any sibling nav is open we close it
	                $(this).find('.lightnav-collapse.in').siblings('a').click();
	            }
	        });

			if (!$(this).children('ul').length) {
				$('.lightnav-button').click(); // close nav since there are no children
			}
	    });

	};

}(jQuery); // $(this).parent('ul').addClass('lightnav-active');

+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('lightnav')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var LightnavCollapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, LightnavCollapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="lightnavcollapse"][href="#' + element.id + '"],' +
                           '[data-toggle="lightnavcollapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndLightnavCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  LightnavCollapse.VERSION  = '3.3.7'

  LightnavCollapse.TRANSITION_DURATION = 300

  LightnavCollapse.DEFAULTS = {
    toggle: true
  }

  LightnavCollapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  LightnavCollapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .lightnav-collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      lnPlugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('lightnav-collapse')
      .addClass('lightnav-collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('lightnav-collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('lightnav-collapsing')
        .addClass('lightnav-collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(LightnavCollapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  LightnavCollapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('lightnav-collapsing')
      .removeClass('lightnav-collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('lightnav-collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('lightnav-collapsing')
        .addClass('lightnav-collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(LightnavCollapse.TRANSITION_DURATION)
  }

  LightnavCollapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  LightnavCollapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="lightnavcollapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndLightnavCollapsedClass(lnGetTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  LightnavCollapse.prototype.addAriaAndLightnavCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('lightnav-collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function lnGetTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function lnPlugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, LightnavCollapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new LightnavCollapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = lnPlugin
  $.fn.collapse.Constructor = LightnavCollapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="lightnavcollapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = lnGetTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    lnPlugin.call($target, option)
  })

}(jQuery);
