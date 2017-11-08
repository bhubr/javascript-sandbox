// Déjà vu : simple gestionnaire de click
$('#events1-btn1').click(function() {
    $(this).toggleClass('blue');
});

// Gestionnaire de submit
$('#events1-form1').submit(function(e) {
    // On empêche la soumission du formulaire à un serveur
    e.preventDefault();
    // On sauvegarde la référence au formulaire car on va s'en servir plusieurs fois
    var form = $(this);
    // Encore un sélecteur: input avec attribut ayant la valeur demandée
    var name = form.find('input[name="name"]').val();
    var inputEmail = form.find('input[name="email"]');
    var email = inputEmail.val();
    // Vérification TRES basique de l'email
    // Si elle échoue on affiche une erreur
    if(! email.includes('@') || ! email.includes('.')) {
        inputEmail.css('border', '1px solid red');
        form.find('input[name="email"] + div').show();
    }
    // Sinon, on remplit les résultats dans
    // la div prévue pour, on montre cette
    // div, et on cache le formulaire
    else {
        $('#result-name').html(name);
        $('#result-email').html(email);
        $('#events1-form1-resultat').show();
        form.hide();
    }
})