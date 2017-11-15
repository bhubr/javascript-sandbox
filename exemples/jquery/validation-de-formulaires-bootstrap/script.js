// Paramètres pour les envois par AJAX
$.ajaxSetup({
    headers: {
        'content-type': 'application/json'
    }
});

// Gestion des erreurs
$( document ).ajaxError(function(event, jqXHR,  ajaxSettings, thrownError) {
    var data = JSON.parse(jqXHR.responseText);
    console.log('parsed', data);
    $('#alert-box')
    .removeClass('hidden')
    .removeClass('alert-success')
    .addClass('alert-danger')
    .html(data.message);
});

$('#register-username')
.change(function(e) {
    var inputUsername = $(this);
    var username = inputUsername.val();
    var re = /^[A-Za-z][A-Za-z0-9_]+$/;
    var isUsernameValid = username.match(re);
    if(! isUsernameValid) {
        inputUsername
        .addClass('is-invalid')
        .removeClass('is-valid');
        return;
    }

    $.get(
        'http://localhost:3000/jquery/ajax/username-check?username=' + username,
        function(response) {
            console.log(response.success)
            if(response.success) {
                inputUsername
                .addClass('is-valid')
                .removeClass('is-invalid');
            }
            else {
                inputUsername
                .addClass('is-invalid')
                .removeClass('is-valid');
                return;
            }
        }
    );
});

// Soumission du formulaire d'inscription vers le serveur
$('#form-register').submit(function(e) {
    var username = $('#register-username').val();
    var email    = $('#register-email').val();
    var password = $('#register-password').val();
    var user = {
        username: username,
        email: email,
        password: password
    };
    var userJSON = JSON.stringify(user);
    console.log(user);
    console.log(userJSON);
    e.preventDefault();
    $(this).find('input').val('');
    $.post('/jquery/ajax/register', userJSON, 'json');
})


$('#form-login').submit(function(e) {
    var email    = $('#login-email').val();
    var password = $('#login-password').val();
    var user = {
        email: email,
        password: password
    };
    var userJSON = JSON.stringify(user);
    e.preventDefault();
    $(this).find('input').val('');
    $.post(
      '/jquery/ajax/login',
      userJSON,
      function(data) {
        $('#alert-box')
        .removeClass('alert-danger')
        .addClass('alert-success')
        .removeClass('hidden')
        .html(data.message);
      },
      'json'
    );
})





var onglets = $('#onglets li a');

onglets.click(function(e) {
    var link = $(this);
    onglets.removeClass('active');
    link.addClass('active');
    var idPanneau = link.data('tab-id');
    $('.tab').hide();
    $('#' + idPanneau).show();
});