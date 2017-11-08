$.ajaxSetup({
    headers: {
        'content-type': 'application/x-www-form-urlencoded'
    }
});


$('#ajax-form-post').submit(function(e) {
    e.preventDefault();
    var form = $(this);
    var title = form.find('input[name="title"]').val();
    var text = form.find('textarea[name="text"]').val();
    $.ajax({
        method: 'POST',
        url: form.prop('action'),
        data: {
            title: title, text: text
        },
        success: function(data) {
            console.log('received', data);
            $('#ajax-html').html(data);
        },
        error: function(jqXHR) {
            console.log('received', jqXHR);
            $('#ajax-html').html(jqXHR);
        },
        dataType: 'html'
    });
});