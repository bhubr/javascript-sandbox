$('#exo1-form').submit(function(e) {
    e.preventDefault();
    var form = $(this);
    var inputPass = form.find('input[type="password"]');
    var mdp = inputPass.val();
    if(mdp.length < 6) {
        $('#mdp-statut')
        .show()
        .addClass('text-red')
        .html('Mot de passe trop court (6 caractères minimum)');
    }
    var inputName = form.find('input[name="nom"]');
    var nom = inputName.val();
    if(! nom || (nom.split(' ').length < 2)) {
        $('#nom-statut')
        .show()
        .addClass('text-red')
        .html('Le nom doit être rempli et comporter un espace');
    }
    $('#result').html("Bienvenue " + inputName.val() +
    ", votre mot de passe contient " + mdp.length + " caractères");
});