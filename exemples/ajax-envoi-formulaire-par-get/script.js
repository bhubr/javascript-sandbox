$('#ajax-form-get').submit(function(e) {
    e.preventDefault();
    var form = $(this);
    var name = form.find('input[name="name"]').val();
    var birthdate = form.find('input[name="birthdate"]').val();
    $.ajax({
        method: 'GET',
        url: form.prop('action'),
        data: {
            name: name, birthdate: birthdate
        },
        success: function(data) {
            $('#ajax-html').html(data);
        },
        dataType: 'html'
    });
});