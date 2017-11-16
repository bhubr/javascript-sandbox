// Insertion : wrap et unwrap
$('.niveau-2').wrap('<div class="niveau-1"></div>');

// On utilise le filtre :first pour ne prendre que les .niveau-2
// de la première div.niveau-0. Mais la restriction avec le sélecteur
// fait que ça ne fait rien (les .niveau-2 n'ont pas de parent .niveau-99)
$('.niveau-0:first .niveau-2').unwrap('.niveau-99');

// On utilise le filtre :eq(1) pour ne prendre que les .niveau-2
// de la seconde div.niveau-0, et on supprime la div.niveau-1 ajoutée avant
$('.niveau-0:eq(1) .niveau-2').unwrap();

// Exemple wrapAll. Filtre :eq(2) pour ne cibler que la troisième div.niveau-0
$('.niveau-0:eq(2) .niveau-3').wrapAll('<div class="niveau-2"></div>');

// Exemple wrapInner. Filtre :last pour ne cibler que la dernière div.niveau-0
$('.niveau-0:last .niveau-2').wrapInner('<div class="niveau-3"></div>');