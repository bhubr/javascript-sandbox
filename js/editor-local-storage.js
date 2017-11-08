function LocalStorageDraft() {
  this.storageKey = 'ace_sandbox_draft';
  this.supportedTypes = ['html', 'javascript', 'css'];
}



LocalStorageDraft.prototype.init = function(slug, sources) {
  this.slug = slug;
  this.sources = sources || {};
}

LocalStorageDraft.prototype.getSources = function() {
  return this.sources;
}

LocalStorageDraft.prototype.getSource = function(key) {
  return this.sources[key];
}

LocalStorageDraft.prototype.hasSource = function(key) {
  return ! _.isEmpty(this.sources) && this.sources[key];
}

LocalStorageDraft.prototype.restore = function(slug) {
  var draft = this.unserialize();
  if(! draft) {
    // console.log('no draft found for slug `' + slug + '`');
    return false;
  }
  if(draft.slug !== slug) {
    // console.log('Saved draft id `' + draft.slug + '` differs from required `' + slug + '`');
    return false;
  }
  // console.log('restore', draft);
  this.init(draft.slug, draft.sources);
  return draft;
}

LocalStorageDraft.prototype.unserialize = function() {
  var draftJSON = localStorage.getItem(this.storageKey);
  var draft;
  if(! draftJSON) {
    return false;
  }
  try {
    draft = JSON.parse(draftJSON);
  }
  catch(e) {
    // console.log('could not unserialize!! ' + e.message);
    return false;
  }
  return draft;
}

LocalStorageDraft.prototype.reset = function() {
  this.slug = undefined;
  this.sources = undefined;
  localStorage.removeItem(this.storageKey);
}

LocalStorageDraft.prototype.serialize = function() {
  return JSON.stringify({
    slug: this.slug, sources: this.sources
  });
}


LocalStorageDraft.prototype.saveSource = function(type, source) {
  // console.log(this);
  if(this.supportedTypes.indexOf(type) === -1) {
    throw new Error('Unsupported type `' + type +
      '`, allowed types are: ' + this.supportedTypes.join(', '));
  }
  this.sources[type] = source;
  localStorage.setItem(this.storageKey, this.serialize());
}