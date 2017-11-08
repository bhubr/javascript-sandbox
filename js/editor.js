$(document).ready(function() {

  var $editor        = $('#editor');
  var $editorJs      = $('#editor-javascript');
  var $editorHtml    = $('#editor-html');
  var $htmlContent   = $('#html-content');
  var $selectorNav   = $('#selector');
  var $fileSelect    = $('#file-select');
  var $addExampleBtn = $('#add-example-btn');
  var $exampleForm   = $('#add-example-form');
  var $exampleSave   = $('#add-example-save');
  var $exampleCancel = $('#add-example-cancel');
  var $saveChanges   = $('#save-changes');
  var $notification  = $('#notification');
  var $revertEditor  = $('#revert-editor');
  var $panelLeft     = $('.panel-left');
  var $panelRight    = $('.panel-right');
  var $window        = $(window);
  var activeMode     = 'html';
  var currentHash; 
  var editor;
  var editorStorage = new LocalStorageDraft();
  var saveTimeout1;
  var saveTimeout2;
  var exampleList;

  $panelLeft.resizable({
    handleSelector: ".splitter",
    resizeHeight: false,
    onDrag: function(e) {
      $editor.width($panelLeft.width());
    }
  });
  $window.resize(function() {
    $editor.width($panelLeft.width());
    $(".panel-container").height($(window).height());
  });
  $(".panel-container").height($(window).height());
  $editor.width($panelLeft.width());


  editor = ace.edit("editor");
  editor.setTheme("ace/theme/eclipse");
  editor.$blockScrolling = Infinity;
  editor.getSession().setUseWrapMode(true);

  function setCurrentHash(slug) {
    // console.log('setCurrentHash', slug)
    if(slug) {
      // console.log('save current hash', slug);
      window.location.hash = currentHash = slug;
    }
    else {
      currentHash = window.location.hash ?
          window.location.hash.substr(1) : undefined;
      // if(currentHash) console.log('restored current hash', currentHash);
    }
  }

  function setEditorMode(mode) {
    editor.getSession().setMode("ace/mode/" + mode);
  }

  function saveToLocalStorage() {
    var editorContent =  editor.getSession().getValue();
    // console.log('saveToLocalStorage', activeMode, editorContent.substr(0, 10) + '[...]');
    editorStorage.saveSource(activeMode, editorContent);
    saveTimeout = undefined;
  }

  function editorContentChanged() {
    // console.log('editorContent changed')
    if(saveTimeout1 || saveTimeout2) {
      clearTimeout(saveTimeout1);
      clearTimeout(saveTimeout2);
    }
    saveTimeout1 = setTimeout(saveToLocalStorage, 500);
    // saveTimeout2 = setTimeout(saveChanges, 1000);
  }

  editor.getSession().on('change', editorContentChanged);

  function setActiveTab(mode) {
    // console.log('setting mode', mode);
    var elementId = 'show-' + mode;
    $('#show-' + activeMode).removeClass('active');
    activeMode = mode;
    $('#' + elementId).addClass('active');
    var ed = $('#editor-' + mode);
    setEditorMode(mode);
    editor.getSession().off('change');
    editor.getSession().setValue(ed[0].innerHTML);
    editor.getSession().on('change', editorContentChanged);
  }

  $('#tabs button').click(function() {
    saveToLocalStorage();
    var mode = $(this).prop('id').substr(5);
    setActiveTab(mode);
  })

  function loadAsync(url, dataType) {
    return new Promise(function(resolve, reject) {
      $.ajax({
        type: 'GET',
        url: url,
        success: function(data) {
          resolve(data);
        },
        error: function(jqXHR) {
          reject(new Error(jqXHR.responseText));
        }
      }, dataType);
    });
  }

  function loadExample(exampleSlug) {
    // console.log('loadExample', exampleSlug);
    var serverPath = 'exemples/' + exampleSlug + '/';
    loadAsync(serverPath + 'script.js', 'text')
    .then(javascript => $editorJs.html(javascript))
    .then(() => loadAsync(serverPath + '/contenu.html', 'text'))
    .then(html => {
      $editorHtml.html(html);
      setHtmlContent(html);
      setActiveTab('html');
      setCurrentHash(exampleSlug);
      var sources = {
        html: $editorHtml.html(),
        javascript: $editorJs.html()
      };
      editorStorage.init(exampleSlug, sources);
      loadJS(serverPath + 'script.js');
    })
    .then(() => {
      var item = _.find(exampleList, { slug: exampleSlug });
      // console.log(item.test ? 'test' : 'no test');
      // loadJS('exemples/' + item.slug + '/test.js', function() {
      //   $('#tests').show();
      // });
    });

  }

  function addFileSelectItem(item) {
    $fileSelect.append(
      '<option value="' + item.slug + '">' +
        item.title +
      '</option>'
    );
  }

  function loadExampleList() {
    $.get('exemples/liste.json', function(_exampleList) {
      exampleList = _exampleList;
      var restoredDraft;
      exampleList.forEach(addFileSelectItem);
      if(currentHash) {
        $fileSelect.val(currentHash);
        var item = _.find(exampleList, { slug: currentHash });
        if( ! item) {
          return;
        }
        restoredDraft = editorStorage.restore(item.slug);
        if(! restoredDraft) {
          loadExample(item.slug);
        }
        else {
          $editorHtml.html(restoredDraft.sources.html);
          setHtmlContent(restoredDraft.sources.html);
          $editorJs.html(restoredDraft.sources.javascript);
          loadJS('exemples/' + item.slug + '/script.js');
          // if(item.test) {
          //   loadJS('exemples/' + item.slug + '/test.js', function() {
          //     $('#tests').show();
          //   });
          // }
          setActiveTab('html');
        }
      }

    }, 'json');
  }

  function setHtmlContent(html) {
    $htmlContent.empty();
    $htmlContent.html(html);
  }

  function notify(type, text) {
    $notification
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

  function toggleEditor() {
    $addExampleBtn.toggle();
    $selectorNav.toggle();
    $exampleForm.toggle();
  }

  function saveExample(e) {
    e.preventDefault();
    var title = $(this).find('input[name="title"]').val();
    $.ajax({
      type: 'POST',
      url: '/examples',
      data: JSON.stringify({ title }),
      success: function(newExample) {
        clearAndCloseEditor();
        addFileSelectItem(newExample);
        $fileSelect.val(newExample.slug);
        $fileSelect.trigger('change');
        notify('success', "Exemple créé !");
      },
      error: function(jqXHR, textStatus, errorThrown ) {
        notify('error', 'Erreur: ' + jqXHR.responseText);
      },
      contentType: 'application/json',
      dataType: 'json'
    });
  }

  function clearAndCloseEditor() {
    $exampleForm.find('input').val('');
    toggleEditor();
  }

  function revertEditor() {
    editorStorage.reset();
    location.reload();
  }

  function saveChanges() {
    var payload = editorStorage.getSources();

    $.ajax({
      type: 'PUT',
      url: '/examples/' + currentHash,
      data: JSON.stringify(payload),
      success: function(newExample) {
        notify('success', "Exemple sauvegardé !");
        loadExample(currentHash);
      },
      error: function(jqXHR, textStatus, errorThrown ) {
        notify('error', 'Erreur: ' + jqXHR.responseText);
      },
      contentType: 'application/json',
      dataType: 'json'
    });
  }

  setCurrentHash();

  $fileSelect.change(function() {
    loadExample($(this).val());
  });
  $addExampleBtn.click(toggleEditor);
  $exampleCancel.click(clearAndCloseEditor);
  $saveChanges.click(saveChanges);
  $exampleForm.submit(saveExample);
  $revertEditor.click(revertEditor);
  loadExampleList();
});
