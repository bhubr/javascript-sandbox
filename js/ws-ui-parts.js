"use strict";
(function($) {
  $(document).ready(function() {
    // console.log('ws: init UI parts');


    /**
     * Initialize an empty object to be populated as follows:
     *   - key is an UI element's id
     *   - value associated is an obj containing: tmpl (the template) and $elem (jQueried target element)
     */
    _ws.ui = {};


    /**
     * Generic template-based rendering function
     */
    function viewDefaultRender(elemId) {
      return function(data) {
        if(! data) {
          throw new Error('WARNING! You should provide data for #' + elemId + "'s render()");
        }
        this.$elem.empty();
        this.$elem.html( Mustache.render( this.tmpl, data ) );
        this.$elem.removeClass('hidden');
        this.$elem.show();
        this.bindEvents();
        // call if an afterRender function was provided
        if(typeof this.afterRender === 'function') {
          this.afterRender();
        }
      }
    }

    /**
     * Wrapper around provided render function (show elem after render)
     */
    function viewRenderWrapper(data) {
      this._render(data);
      this.$elem.show();
    }



    /**
     * Bind events
     */
    function viewBindEvents() {
      var events = this.props.events;
      for(var descriptor in events) {
        var handler = events[descriptor];
        var bits = descriptor.split(' ');
        var evtName = bits.shift();
        var selector = bits.join(' ');
        var target = selector === '' ? this.$elem : this.$elem.find(selector);
        target.on(evtName, handler.bind(this));
      }
    }


    /**
     * Bind events: nop
     */
    function viewBindEventsNop() {}


    /**
     * Show view element
     */
    function viewElemShow() {
      this.$elem.removeClass('hidden');
      this.$elem.show();
    }


    /**
     * Hide view element
     */
    function hideElemShow() {
      this.$elem.addClass('hidden');
      this.$elem.hide();
    }


    /**
     * Build a view
     */
    _ws.makeView = function(elemId, props) {
      var v = {};
      v.props = props || {};

      v.$elem = $('#' + elemId);
      v.partName = _.camelCase(elemId);
      _ws.ui[v.partName] = v;

      // Bind the provided render function
      if(typeof v.props.render === 'function') {
        v._render = props.render.bind(v);
        v.render = viewRenderWrapper.bind(v);
      }
      // Otherwise assign the default render function
      else {
        var $tmplEl = $('script[data-tmpl-for="' + elemId + '"]');
        v.tmpl = $tmplEl.html();
        v.render = (viewDefaultRender(elemId)).bind(v);
      }

      // Set event handlers
      if(v.props.events) {
        v.bindEvents = viewBindEvents.bind(v);
        v.bindEvents();
      }
      else {
        v.bindEvents = viewBindEventsNop.bind(v);
      }

      // Pass arbitrary properties
      for(var p in props) {
        if(['render', 'events', 'init'].indexOf(p) !== -1) {
          continue;
        }
        var prop = props[p];
        v[p] = typeof prop !== 'function' ? prop : prop.bind(v);
      }

      v.show = viewElemShow.bind(v);
      v.hide = hideElemShow.bind(v);

      // Init if an init function was provided
      if(typeof v.props.init === 'function') {
        (v.props.init.bind(v))();
      }

    };


  });
})(jQuery);