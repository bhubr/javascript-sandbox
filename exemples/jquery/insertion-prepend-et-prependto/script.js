// Insertion : prepend et prependTo

// Si on ne souhaite rien faire sur le nouvel élément pour l' instant
$('#exemple-prepend').prepend(
    '<li>Le premier élément ajouté (par .prepend), numéroté 4 à la fin</li>'
);
$('<li>Le deuxième élément ajouté (par .prependTo), numéroté 3 à la fin</li>')
.prependTo('#exemple-prepend');

// Si on souhaite au contraire le manipuler directement
// a) manipulation directe
$('<li>Le troisième élément ajouté, numéroté 2 à la fin</li>')
.prependTo('#exemple-prepend').css('color', '#67bdba');
// b) stockage dans une variable et manipulation, pratique si on veut
//    garder cette variable pour agir dessus plus tard
var p = $('<li>Le quatrième élément ajouté, numéroté 1 à la fin</li>')
.prependTo('#exemple-prepend');
p.css({ color: '#eae', backgroundColor: '#333', padding: '5px', borderRadius: '5px' });
