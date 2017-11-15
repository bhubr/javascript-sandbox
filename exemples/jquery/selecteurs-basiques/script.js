// Sélection par id
$('#ex1-button1').click(function() {
  $(this).toggleClass('red');
});

// Sélection par classe
$('.ex1-buttons').click(function() {
  var clickedButton = $(this);
  clickedButton.toggleClass('blue');
  var text = clickedButton.hasClass('blue') ?
    'Bleu' : 'Gris';
  clickedButton.html(text);
});

// Sélection par tag
$('a').click(function(e) {
  e.preventDefault(); // Empêche le lien de fonctionner
  $('a').removeClass('active');
  $(this).addClass('active');
});

// Envelopper un élément DOM
var button2 = document.getElementById('ex1-button2');
// Ici button2 n'est pas une chaîne de caractères
// mais un élément DOM
$(button2).click(function() {
  $(this).toggleClass('red');
});