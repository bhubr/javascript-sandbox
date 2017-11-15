(function($) {
  if(! $) {
    throw new Error('neither jQuery nor Zepto is loaded');
  }

  function getAsync(url, dataType) {
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

  function sendAsync(url, data, options) {
    if(['POST', 'PUT', 'PATCH'].indexOf(options.type) === -1) {
      throw new Error('sendAsync must be called with options.type set to POST or PUT');
    }
    if(typeof data === 'object') {
      data = JSON.stringify(data);
    }
    return new Promise(function(resolve, reject) {
      options = _.extend(options, {
        url: url,
        data: data,
        contentType: 'application/json',
        dataType: 'json',
        success: function(data) {
          resolve(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log('this should throw a bloody error', jqXHR.responseText);
          reject(new Error(errorThrown));
        }
      });
      $.ajax(options);
    });
  }

  function postAsync(url, data, options) {
    return sendAsync(url, data, _.extend(options, { type: 'POST' }));
  }

  function putAsync(url, data, options) {
    return sendAsync(url, data, _.extend(options, { type: 'PUT' }));
  }

  window.rp = {
    get: getAsync,
    post: postAsync,
    put: putAsync
  };
})(jQuery || Zepto);