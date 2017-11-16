// Filtres de contenu

// : contains
$("#liste-films-sf li:contains('Star')")
.css('text-decoration', 'underline');

// :empty
$("#parent :empty").css('background', 'red');

// :has
$("#demo-filtre-has div:has('.gras')").addClass('avec-p-gras');
