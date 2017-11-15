function timeoutAsync(cb, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      cb();
      resolve(true);
    }, delay);
  });
}

function delayAsync(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      resolve(true);
    }, delay);
  });
}


function getId() {
  return Date.now().toString(36);
}

(function($) {
  $(document).ready(function() {


    var $mainMenu    = $('#nav-menus');
    var $menuRepo    = $('#menu-repo');
    var $linkToRepo1 = $menuRepo.find('a:first');
    var $menuExample = $('#menu-example');
    var $menuBtn     = $('#menu-btn');
    var $homeLink    = $('#nav-back-home');
    var $editor      = $('#editor');
    var $editorTabs  = $('#tabs');


    QUnit.test( "hello test", function( assert ) {
      assert.ok( 1 == "1", "Passed!" );
    });


    QUnit.test( "initial state", function( assert ) {
      assert.equal( _ws.files.length, 0, "_ws.files should hold 0 file when app started from root" );
      assert.ok( $menuRepo.is(':visible'), "menu repo visible (though menu is hidden)" );
      assert.equal( ($menuRepo.find('a')).length, 2, "menu repo should contain 2 links" );
      assert.ok( $menuExample.is(':visible'), "menu example visible (though menu is hidden AND menu empty)" );
      assert.equal( ($menuExample.find('a')).length, 0, "menu example should contain 0 links" );
      assert.ok( ! $editor.is(':visible'), "editor invisible" );
      assert.ok( ! $editorTabs.is(':visible'), "editor tabs invisible" );
    });


    QUnit.test( "test menu toggle", function( assert ) {
      var done = assert.async();
      assert.equal( $mainMenu.width(), 0, "0. INIT width should be 0" );
      assert.ok( $mainMenu.is(':visible'), "0. INIT menu should NOT have class 'in'" );
      $menuBtn.trigger('click');
      assert.ok( $mainMenu.hasClass('in'), "1.AFTER CLICK menu should have class 'in'" );
      assert.ok( $mainMenu.is(':visible'), "1.AFTER CLICK menu should be visible" );
      timeoutAsync(() => {
        assert.notEqual( $mainMenu.width(), 0, "1.AFTER CLICK menu should have width > 0" );
        $menuBtn.trigger('click');
        assert.ok( ! $mainMenu.hasClass('in'), "2.AFTER 2ND CLICK menu should NOT have class 'in'" );
      }, 120)
      .then(() => timeoutAsync(() => {
        assert.equal( $mainMenu.width(), 0, "2.AFTER 2ND CLICK width should be 0" );
        done();
      }, 180));
    });


    QUnit.test( "test nav to repo", function( assert ) {
      var done = assert.async();
      assert.equal( window.location.pathname, '/', "location should be / at first" );
      $linkToRepo1.trigger('click');
      assert.equal( window.location.pathname, '/example-repo-1', "location should be /example-repo-1" );
      timeoutAsync(() => {
        assert.equal( ($menuExample.find('a')).length, 1, "menu example should contain 1 entry" );
        assert.equal( $menuExample.find('a:first').html(), "Test Example", "link to 1st example should be labelled 'Test Example'" );
        assert.ok( !! _ws.repo, "_ws.repo should not be undefined" );
        assert.equal( _ws.repo.title, "Example Repo 1", '_ws.repo.title is "Example Repo 1"' );
        done();
      }, 100);
    });


    QUnit.test( "test nav to example", function( assert ) {
      var done = assert.async();
      $linkToRepo1.trigger('click');
      assert.equal( window.location.pathname, '/example-repo-1', "location should be /example-repo-1" );
      assert.equal( ($menuExample.find('a')).length, 1, "menu example should contain 1 entry" );
      var $linkToExmp1 = $menuExample.find('a:first');
      $linkToExmp1.trigger('click');
      assert.equal( window.location.pathname, '/example-repo-1/repo1-example1', "location should be /example-repo-1/repo1-example1" );
      timeoutAsync(() => {
        assert.ok( $editor.is(':visible'), "editor visible" );
        assert.equal( _ws.files.length, 2, "_ws.files should hold 2 files" );
        done();
      }, 50);
    });


    QUnit.test( "test adding a collection", function( assert ) {
      var done = assert.async();
      var $addRepo = $('#add-repo');
      var $addRepoAddBtn = $addRepo.find('.add-btn');
      var $addRepoForm = $addRepo.find('form');
      assert.equal( $addRepo.length, 1, "there should be one #add-repo element" );
      assert.equal( $addRepoForm.length, 1, "#add-repo should contain one form element" );
      assert.ok( $addRepoForm.is(':visible'), "the form element shouldn't be visible before clicking the + btn" );
      $addRepoAddBtn.trigger( 'click' );
      assert.ok( $addRepoForm.is(':visible'), "clicking on the + btn should have made the form appear" );

      done();
    });

    QUnit.test( "test adding a file", function( assert ) {
      var done = assert.async();
      var $addFile = $('#add-file');
      var $addFileInput = $('#add-file').find('input[type="text"]');
      var $addFileAddBtn = $addFile.find('.add-btn');
      var $addFileForm = $addFile.find('form');
      $linkToRepo1.trigger('click');
      timeoutAsync(() => {
        var $linkToExmp1 = $menuExample.find('a:first');
        console.log('##### clicked on first example', $linkToExmp1.prop('href'));
        $linkToExmp1.trigger( 'click' );
      }, 50)
      .then(() => delayAsync(400))
      .then(() => {
        assert.equal( $addFile.length, 1, "there should be one #add-file element" );
        assert.equal( $addFileForm.length, 1, "#add-file should contain one form element" );
        // assert.ok( ! $addFileForm.is(':visible'), "the form element shouldn't be visible before clicking the + btn" );
        assert.ok( $addFileForm.width() === 0, "the form element shouldn't be visible before clicking the + btn" );
        $addFileAddBtn.trigger( 'click' );
      })
      .then(() => timeoutAsync(() => {
        console.log( $addFileForm );
        // assert.ok( $addFileForm.is(':visible'), "clicking on the + btn should have made the form appear" );
        assert.ok( $addFileForm.width() > 0, "clicking on the + btn should have made the form appear" );
        $addFileInput.val('script-' + getId() + '.js');
        $addFileForm.find('button[type="submit"]')
        .trigger( 'click' );
      }, 100))
      .then(() => delayAsync(400))
      .then(done);
    });


    QUnit.test( "test nav back to home", function( assert ) {
      var done = assert.async();
      $homeLink.trigger('click');
      assert.ok( window.location.pathname, '/', "location should be / when clicking app title" );
      timeoutAsync(() => {
        assert.equal( ($menuExample.find('a')).length, 0, "menu example should contain 0 entry" );
        done();
      }, 50);
    });


  });
})(jQuery);