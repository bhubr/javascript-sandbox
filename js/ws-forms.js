"use strict";
(function($) {
  $(document).ready(function() {

  function checkPropsExist(obj, props) {
    if(typeof obj !== 'object' || ! props) {
      throw new Error('checkPropsExist was called with wrong arguments');
    }
    props = typeof props === 'string' ? [props] : props;
    for(let p = 0 ; p < props.length ; p++) {
      const prop = props[p];
      if(! obj[prop]) {
        throw new Error('obj does not have a `' + prop + '` parameter: please provide it.');
      }
    }
  }

  function makeFormView(elemId, options) {
    var callbacks = ['onSubmitAddPromise', 'onAddSuccess', 'onAddError'];
    // Fallback options & options.events
    checkPropsExist(options, callbacks)
    options.events = options.events || {};

    // Define events and optionally extend them with those
    // provided in options.events

    _ws.makeView(elemId, {

      init: function() {
        const self = this;
        this.$btn   = this.$elem.find('.add-btn');
        this.$form  = this.$elem.find('form');
        this.$input = this.$form.find('input[name="title"]');
        callbacks.forEach(function(cbName) {
          self[cbName] = options[cbName].bind(self);
        });
        if(options.postInit) {
          (options.postInit.bind(this))();
        }
      },

      reset: function() {
        this.$btn.addClass('in');
        this.$form.removeClass('in');
        this.$input.val('');
      },

      render: function() {
        this.$btn.removeClass('in');
        this.$form.addClass('in');
        this.$input.focus();
      },

      events: {
        'click .add-btn': function() {
          this.render();
        },

        'click .icon-cross': function() {
          this.$form.removeClass('in');
          this.$btn.addClass('in');
        },

        'submit form': function(e) {
          const self = this;
          e.preventDefault();
          if(this.cantSubmit) {
            this.$input
            .removeClass('input-success input-warning')
            .addClass('input-error');
            _ws.notify('error', this.cantSubmit);
            return;
          }
          var title = this.$input.val();
          // rp.post('/collections', { title: title })
          self.onSubmitAddPromise(title)
          .then(function(data) {
            self.onAddSuccess(data);
            self.reset();
          })
          .catch(function(err) {
            console.error(err);
            self.onAddError(err);
            self.reset();
          });
        }
      }

    });
  }

  makeFormView('add-repo', {
    onSubmitAddPromise: function(title) {
      return rp.post('/repos', { title: title });
    },
    onAddSuccess: function(repo) {
      _ws.repos.push(repo);
      _ws.ui.menuRepo.render({ repos: _ws.repos });
      _ws.notify('success', 'Collection créée: ' + repo.title);
      _ws.navigateTo('/' + repo.path);
    },
    onAddError: function(err) {
     _ws.notify('error', 'Impossible de créer la collection: ' + err.message); 
    }
  });

  makeFormView('add-example', {
    onSubmitAddPromise: function(title) {
      return rp.post('/' + _ws.repo.path + '/examples', { title: title });
    },
    onAddSuccess: function(example) {
      _ws.notify('success', 'Exemple crée: ' + example.title);
      _ws.navigateTo('/' + _ws.repo.path + '/' + example.slug);

      // console.log('##### addExample success', _ws, _ws.ui.menuExample.$elem.find('ul[data-id="' + example.category + '"]') )
      _ws.ui.menuExample.addExampleLink(example, '/' + _ws.repo.path + '/' + example.slug);
      _ws.ui.shortcutExample.addExampleLink(example, '/' + _ws.repo.path + '/' + example.slug);
    },
    onAddError: function(err) {
     _ws.notify('error', "Impossible de créer l'exemple: " + err.message); 
    }
  });


  makeFormView(
    'add-file',
    {
      onSubmitAddPromise: function(name) {
        return rp.post('/' + _ws.repo.path + '/examples/' + _ws.example.slug + '/files', { name: name });
      },

      onAddSuccess: function(file) {
        _ws.notify('success', 'Fichier crée: ' + file.name);
        _ws.files.push(file);
        _ws.ui.tabs.render({ files: _ws.files });
      },
      onAddError: function(err) {
       _ws.notify('error', "Impossible de créer le fichier: " + err.message); 
      },

      postInit: function() {
        function onKeyup(e) {
          var filename = this.$input.val();
          var bits = filename.split('.');
          var lastIdx = bits.length - 1;
          this.cantSubmit = '';

          // show warning if no extension has been provided
          if(bits.length < 2) {
            this.$input
            .removeClass('input-success input-error')
            .addClass('input-warning');
            this.cantSubmit = 'Impossible de valider: extension (.html/.js/.css) manquante';
            return;
          }
          // show error if provided extension is invalid
          else {
            var ext = (bits[lastIdx]).toLowerCase();

            if( ['html', 'js', 'css'].indexOf( ext ) === -1 ) {
              this.cantSubmit = 'Impossible de valider: extension ' + ext + ' invalide (autorisées: .html/.js/.css)';
            }
            else if(bits[0] === '') {
              this.cantSubmit = "Le premier caractère du nom de fichier doit être autre chose qu'un point";
            }
            if( this.cantSubmit ) {
              this.$input
              .removeClass('input-success input-warning')
              .addClass('input-error');
              return;
            }
          }
          this.$input.addClass('input-success');
          this.cantSubmit = undefined;
        }
        this.$input.on('keyup', onKeyup.bind(this));
      }
    }
  );

  });
})(jQuery);