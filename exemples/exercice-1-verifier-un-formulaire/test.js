var form = $('#exo1-form');
var inputPass = form.find('input[type="password"]');
var inputName = form.find('input[name="nom"]');
var statusPass = $('#mdp-statut');
var statusName = $('#nom-statut');
QUnit.test( "Test résultat du formulaire", function( assert ) {
  var done = assert.async();
  inputPass.val('');
  form.trigger('submit');
  setTimeout(function() {
    assert.ok(statusPass.is(':visible'), "la div #mdp-statut doit être visible");
    assert.ok(statusPass.hasClass('text-red'), "la div #mdp-statut doit avoir la classe text-red");
    assert.equal(statusPass.html(), 'Mot de passe trop court (6 caractères minimum)', "la div #mdp-statut doit afficher 'Mot de passe trop court (6 caractères minimum)'");

    assert.ok(statusName.is(':visible'), "la div #nom-statut doit être visible");
    assert.ok(statusName.hasClass('text-red'), "la div #nom-statut doit avoir la classe text-red");
    assert.equal(statusName.html(), 'Le nom doit être rempli et comporter un espace', "la div #mdp-statut doit afficher 'Le nom doit être rempli et comporter un espace'");

    done();
    // var password = form.find('input[type="password"]').val();
    // assert.ok(password.length > 0, "Le mot de passe n'est pas vide");
    // assert.ok( 1 == "1", "Passed!" );
  }, 1000);
});