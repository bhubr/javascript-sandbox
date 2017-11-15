// Insertion : append et appendTo

// Si on ne souhaite rien faire sur le nouvel élément pour l' instant
$('#cible').append('<p>2ème paragraphe</p>');
$('<p>3ème paragraphe</p>').appendTo('#cible');

// Si on souhaite au contraire le manipuler directement
// a) manipulation directe
$('<p>4ème paragraphe</p>').appendTo('#cible').css('color', '#67bdba');
// b) stockage dans une variable et manipulation, pratique si on veut
//    garder cette variable pour agir dessus plus tard
var p = $('<p>5ème paragraphe</p>').appendTo('#cible');
p.css({ color: '#eae', backgroundColor: '#333', padding: '5px', borderRadius: '5px' });
