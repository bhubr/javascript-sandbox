// Gestion de l'évènement change
$('#events2-change-text').change(function(e) {
    $('#events2-notification-text').html(
        'Nouvelle valeur : ' +
        $(this).val()
    );
});

$('input[type="radio"][name="events2-change-radio"]').change(function(e) {
    console.log($(this));
    $('#events2-notification-radio').html(
        'Vous avez choisi : ' + $(this).val()
    );
});