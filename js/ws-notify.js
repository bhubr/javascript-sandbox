"use strict";
(function($) {
  $(document).ready(function() {

    var $notification = $('#notification');

    _ws.notify = function(type, text) {
      $notification
      .removeClass('success error')
      .addClass(type)
      .addClass('active');
      $notification.html(text);
      setTimeout(function() {
        $notification.removeClass('active');
      }, 2000);
      setTimeout(function() {
        $notification.removeClass(type);
      }, 3000);
    }

  });
})(jQuery);