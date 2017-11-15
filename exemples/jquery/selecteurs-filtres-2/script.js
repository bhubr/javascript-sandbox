// Attention ça se complique un peu...
// Un nouveau filtre :checked ET un nouveau sélecteur avec le +
// $( "input:checked" ) prendrait tous les checkbox cochés.
// :not(:checked) inverse le filtre.

// $( "selecteur1 + selecteur2" ) va sélectionner les éléments correspondant au selecteur2, UNIQUEMENT s'ils sont adjacents à un élément correspondant au selecteur1
// Donc ici seuls les span se trouvant après un checkbox non coché
// sont sélectionnés
$( "input:not(:checked) + span" ).css( "background-color", "yellow" );

// Sur tous les inputs on met l'attribut disabled => on ne peut plus
// les cocher ou les décocher
$( "#selecteurs-filtres2 input").attr( "disabled", "disabled" );
