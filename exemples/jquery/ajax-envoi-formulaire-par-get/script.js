$('#ajax-form-get').submit(function(e) {
    e.preventDefault();
    var form = $(this);
    var name = form.find('input[name="name"]').val();
    var birthdate = form.find('input[name="birthdate"]').val();
    $.ajax({
        method: 'GET',
        // Notez l'utilisation de .prop() pour récupérer l'attribut action,
        // contenant l'URL vers laquelle le formulaire est sensé soumettre,
        // vers laquelle il serait envoyé sans e.preventDefault() ci-dessus.
        url: form.prop('action'),
        data: {
            name: name, birthdate: birthdate
        },
        success: function(data) {
            var message = "<p>Regardez l'onglet Network/Réseau "+
              "de la console de développement...</p>";
            $('#ajax-html').html(data);
            $( message ).appendTo( $('#ajax-html') )
            .css('color', '#b33');
        },
        dataType: 'html'
    });
});