"use strict";
(function($) {
  $(document).ready(function() {
    // console.log('ws: init menu');

    /**
     * Main menu
     */
    var $mainMenu = $('#nav-menus');


    /**
     * Main menu toggle button
     */
    var $menuBtn = $('#menu-btn');
    $menuBtn.click(toggleMainMenu);

    /**
     * Navigation state
     */
    var navState = parsePath();


    /**
     * Previous navigation state
     */
    var prevNavState;


    /**
     * Toggle main menu
     */
    function toggleMainMenu() {
      $mainMenu.toggleClass('in');
    };


    /**
     * Extract bits (repo&example slugs) from requested url path
     */
    function parsePath() {
      const path = window.location.pathname.substr(1);
      const bits = path.split('/');
      return {
        repo: bits[0],
        example: bits.length === 1 ? '' : bits[1]
      };
    }

    /**
     * Handle navigation
     */
    _ws.navigateTo = function(path) {
      $('#server-alert').remove();
      history.pushState({}, 'New path', path);
      prevNavState = navState;
      navState = parsePath();

      if(navState.repo !== prevNavState.repo) {
        if(navState.repo === '') {
          _ws.events.emit('navToRoot');
          _ws.ui.addExample.$btn.removeClass('in');
          _ws.ui.addExample.hide();
          _ws.ui.menuExample.render({ examples: [] });
          _ws.ui.shortcutRepo.render({ repos: _ws.repos, _: _ws._ });
          _ws.ui.shortcutExample.hide();
        }
        else {
          rp.get('/parts/' + navState.repo, 'json')
          .then(function(parts) {
            _ws.repo = parts.repo;
            _ws.ui.addExample.$btn.addClass('in');
            _ws.ui.addExample.show();
            _ws.ui.detailsRepo.render(parts);
            _ws.ui.menuExample.render(parts);
            _ws.ui.shortcutExample.render(parts);
            _ws.ui.shortcutRepo.hide();
            _ws.events.emit('navToRepo', navState.repo);
          });
        }
      }
      else if(navState.example !== prevNavState.example) {
        if(navState.example !== '') {
          rp.get('/parts/' + navState.repo + '/' + navState.example, 'json')
          .then(function(parts) {
            _ws.example = parts.example;
            _ws.files = parts.files;
            $('#editor-wrapper').show();
            _ws.ui.shortcutExample.hide();
            _ws.ui.detailsExample.render(parts);
            _ws.ui.editor.render(parts);
            _ws.ui.tabs.render(parts);
            _ws.ui.addFile.show();
            _ws.ui.sandboxIframe.render('/examples/' + navState.repo + '/' + navState.example);
          });
        }
        else {
          $('#editor-wrapper').hide();
          _ws.ui.shortcutExample.show();
          _ws.ui.editor.hide();
          _ws.ui.tabs.hide();
          _ws.ui.addFile.hide();
          _ws.ui.sandboxIframe.render('/html/start-iframe.html');
        }
      }
    }


    function menuItemClicked(e) {
      e.preventDefault();
      var $link = $(e.target);
      var originalColor = $link.css('backgroundColor');
      toggleMainMenu();
      $link.animate({
        backgroundColor: '#aaa',
      }, 70);
      $link.animate({
        backgroundColor: originalColor,
      }, 70);
      _ws.navigateTo($link.prop('href'));
    }

    function shortcutItemClicked(e) {
      e.preventDefault();
      var $link = $(e.target);
      _ws.navigateTo($link.prop('href'));
    }

    function addExampleLink(cb) {
      return function(example, href) {
        var $targetList = this.$elem.find('ul[data-id="' + example.category + '"]');
        var $newItem = $('<li><a href="' + href + '">' + example.title + '</a></li>').appendTo($targetList);
        $newItem.find('a').on('click', cb);
      }
    }

    /**
     * Initialize menu-example view
     */
    _ws.makeView('menu-example', {
      addExampleLink: addExampleLink(menuItemClicked),

      events: {
        'click a': menuItemClicked
      }
    });


    /**
     * Initialize menu-repo view
     */
    _ws.makeView('menu-repo', {
      events: {
        'click a': menuItemClicked
      }
    });


    /**
     * Initialize shortcut-repo view
     */
    _ws.makeView('shortcut-repo', {
      events: {
        'click a': shortcutItemClicked
      }
    });


    /**
     * Initialize shortcut-example view
     */
    _ws.makeView('shortcut-example', {
      addExampleLink: addExampleLink(shortcutItemClicked),

      events: {
        'click a': shortcutItemClicked
      }
    });


    /**
     * Handle click on links outside #menu-example
     */
    // $('#menu-repo a').click(menuItemClicked);
    $('#nav-back-home').click(function(e) {
      e.preventDefault();
      $mainMenu.removeClass('in');
      _ws.navigateTo('/');
    });


    /**
     * Initialize details-example view
     */
    _ws.makeView('details-example');


    /**
     * Initialize details-repo view
     */
    _ws.makeView('details-repo');


  });
})(jQuery);