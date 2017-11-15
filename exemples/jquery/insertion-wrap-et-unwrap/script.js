// Insertion : wrap et unwrap
$('.niveau-2').wrap('<div class="niveau-1"></div>');

// On utilise le sélecteur :last pour ne prendre que les .niveau-2
// de la seconde div.niveau-0, et on supprime la div.niveau-1 ajoutée avant
$('.niveau-0:last .niveau-2').unwrap();

// On utilise le sélecteur :first pour ne prendre que les .niveau-2
// de la première div.niveau-0. Mais la restriction avec le sélecteur
// fait que ça ne fait rien (les .niveau-2 n'ont pas de parent .niveau-99)
$('.niveau-0:first .niveau-2').unwrap('.niveau-99');