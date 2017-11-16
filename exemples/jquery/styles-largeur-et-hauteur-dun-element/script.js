// Styles : largeur et hauteur d'un élément
var divsInner = $('.inner');
divsInner.each(function() {
   var div = $(this);
   var functions = [
       'width', 'innerWidth', 'outerWidth',
       'height', 'innerHeight', 'outerHeight'
   ];
   // On va construire une liste précédée d'un titre
   var divTitle = div.html();
   // Tag d'ouverture de la liste
   var resultHtml = '<li>Div: ' + divTitle + '<ul>';
   functions.forEach( function( funcName ) {
       // A la 1ère itération, funcName vaut width, puis innerWidth à la 2nde...
       // On va se servir de ce funcName pour savoir quelle fonction appeler !
       var result = div[funcName]();
       resultHtml += '<li>.' + funcName + '() renvoie: '+ result + '</li>';
   });
   resultHtml += '</ul></li>'; // Ne pas oublier les tags de fermeture
   
   // On ajoute le tout à la div de résultats.
   $('#results').append(resultHtml);
});