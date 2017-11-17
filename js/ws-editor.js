/* global window,$,ace,setTimeout,rp,_ws */
"use strict";
$(document).ready(function() {
  // console.log('ws: init editor');

  var $editorWrapper = $('#editor-wrapper');
  var $editor        = $('#editor');


  var $saveChanges   = $('#save-changes');

  var $revertEditor  = $('#revert-editor');
  var $panelLeft     = $('.panel-left');
  // var $panelRight    = $('.panel-right');
  // var $panelWrap     = $('.panel-container');
  var $tabItems      = $('#tabs li');
  var $detailsRepo   = $('#details-repo');
  var $detailsExmp   = $('#details-example');
  var $window        = $(window);
  var activeMode     = 'html';
  var currentFileIdx;

  var editor;
  var editorSession;
  var editorStorage = new LocalStorageDraft();
  // var saveTimeout1;
  // var saveTimeout2;
  var mapTypes = {
    html: 'html', js: 'javascript', css: 'css'
  }

  _ws.events.on('navToRoot', function() {
    $editorWrapper.hide();
    $detailsRepo.hide();
    $detailsExmp.hide();
  });

  _ws.events.on('navToRepo', function(repoSlug) {
    $editorWrapper.hide();
    $detailsRepo.show();
    $detailsExmp.hide();

  });

// https://stackoverflow.com/questions/93695/best-cross-browser-method-to-capture-ctrls-with-jquery#answer-14180949
  $(window).bind('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
      switch (String.fromCharCode(event.which).toLowerCase()) {
      case 's':
        event.preventDefault();
        (onSaveChanges.bind(_ws.ui.tabs))();
        break;
      }
    }
  });

  // /**
  //  * Make the left panel resizable
  //  */
  $panelLeft.resizable({
    handleSelector: ".splitter",
    resizeHeight: false,
    onDrag: function(e) {
      $editor.width($panelLeft.width());
    }
  });


  function setDefaultEditorContent() {
    if(_ws.files.length > 0) {
      editorSession.setMode("ace/mode/html");
      var firstHtml = _ws.files.find(f => (f.type === 'html'));
      _ws.ui.tabs.setActiveTab(firstHtml);
      editorSession.setValue(firstHtml.content);
    }
  }


  function initEditor() {
    editor = ace.edit("editor");
    editorSession = editor.getSession();
    editor.setTheme("ace/theme/eclipse");
    editor.$blockScrolling = Infinity;
    editorSession.setUseWrapMode(true);
    editorSession.setOptions({
        tabSize: 2,
        useSoftTabs: true
    });
    setDefaultEditorContent();
  }


  function onTabClicked(e) {
    var clickedItem = $(e.target);
    var activeTab = _ws.ui.tabs.getActiveTab();
    if(activeTab[0] === clickedItem[0] || clickedItem[0].tagName === 'SPAN') {
      return true;
    }
    if(activeTab.hasClass('dirty')) {
      var proceed = window.confirm("Vos changements sur " + activeTab.data('name') +
        " seront perdus si vous changez de fichier. Continuer tout de même ?");
      if(! proceed) {
        return;
      }
      activeTab.removeClass('dirty');
    }
    var type = clickedItem.data('type');
    editorSession.setMode("ace/mode/" + mapTypes[type]);
    var name = clickedItem.data('name');
    var file = _ws.files.find(f => (f.name === name));
    _ws.ui.tabs.setActiveTab(file);

    editor.getSession().off('change', _ws.ui.editor.contentChanged);
    editorSession.setValue(file.content);
    editor.getSession().on('change', _ws.ui.editor.contentChanged);


    // saveToLocalStorage();
    // var mode = $(this).prop('id').substr(5);
    // console.log( .html() );
    // setActiveTab(mode);
  }

  function setFirstActiveTab() {
    var firstHtml = _ws.files.find(f => (f.type === 'html'));
    this.setActiveTab(firstHtml);
  }


  _ws.makeView('tabs', {
    setActiveTab: function(file) {
      this.file = _ws.files.find(f => (f.name === file.name));
      if(this.activeTab) {
        this.activeTab.removeClass('bold');
      }
      var idx = this.fileIdx = _ws.files.indexOf(this.file);
      this.activeTab = this.$elem.find('li:eq(' + idx + ')');
      this.activeTab.addClass('bold');
    },
    setFirstActiveTab: setFirstActiveTab,
    afterRender: setFirstActiveTab,
    getActiveTab: function() {
      return this.activeTab;
    },
    events: {
      'click li[data-type]': onTabClicked,
      'click li[data-type] span': onSaveChanges
    }
  })

  initEditor();


  _ws.makeView('editor', {
    aceEditor: editor,
    aceSession: editor.getSession(),

    init: function() {
      this.aceSession.on('change', this.contentChanged);
    },

    /**
     * React to changes in editor by saving a copy
     */
    contentChanged: function() {
      // console.log('content changed handler', editorSession.getValue());
      _ws.ui.tabs.getActiveTab()
      .addClass('dirty');
      // if(saveTimeout1 || saveTimeout2) {
      //   clearTimeout(saveTimeout1);
      //   clearTimeout(saveTimeout2);
      // }
      // saveTimeout1 = setTimeout(saveToLocalStorage, 500);
      // // saveTimeout2 = setTimeout(saveChanges, 1000);
    },

    render: function() {
      // console.log('render editor', this);
      setDefaultEditorContent();
      $editorWrapper.show();
      this.$elem.removeClass('hidden');
    }
  });

  _ws.makeView('sandbox-iframe', {
    reload: function() {
      var src = this.$elem.prop('src');
      this.$elem.prop('src', '/empty.html');
      this.$elem.prop('src', src);
    },
    render: function(src) {
      this.$elem.prop('src', src);
    }
  });



  // /**
  //  * Set editor mode (html, javascript, css)
  //  */
  // function setEditorMode(mode) {
  //   editor.getSession().setMode("ace/mode/" + mode);
  // }


  // /**
  //  * Save a copy in localStorage
  //  */
  // function saveToLocalStorage() {
  //   var editorContent =  editor.getSession().getValue();
  //   editorStorage.saveSource(activeMode, editorContent);
  //   saveTimeout1 = undefined;
  // }





  // function revertEditor() {
  //   editorStorage.reset();
  //   location.reload();
  // }

  function onSaveChanges() {
    // console.log('Saving', this.file, editorSession.getValue())
    var filename = this.file.name;
    // var payload = editorStorage.getSources();
    var payload = {
      content: editorSession.getValue()
    };

    // Submit the new file content to server
    rp.put('/' + _ws.repo.path + '/examples/' + _ws.example.slug + '/files/' + filename, payload)
    .then(function(updatedFile) {

      // notify
      _ws.notify('success', "Fichier " + filename + " sauvegardé !");

      // remove the dirty state on current editor tab
      _ws.ui.tabs.getActiveTab().removeClass('dirty');

      // replace content with the updated one in _ws.files
      var originalFile = _ws.files.find(f => (f.name === updatedFile.name));
      var index = _ws.files.indexOf(originalFile);
      _ws.files[index].content = updatedFile.content;

      // reload sandbox iframe
      _ws.ui.sandboxIframe.reload();
    })
    .catch(function(err) {
      // console.error(err);
      _ws.notify('error', 'Erreur: ' + err.message);
    });
  }

  // $fileSelect.change(function() {
  //   loadExample($(this).val());
  // });
  // $saveChanges.click(saveChanges);
  // $revertEditor.click(revertEditor);
  // $.get('/menu', menu => $('#site-menu').html(menu), 'html');
  // loadExampleList();

});
