// Insertion : after, before, etc.
$('#milieu')
.before('<div id="presque-debut">Presque au début</div>');

$('<div id="tout-debut">Tout au début</div>')
.insertBefore('#presque-debut')
.css('background', '#afe');

$('#milieu')
.after('<div id="presque-fin">Presque à la fin</div>');

$('<div id="toute-fin">Tout à la fin</div>')
.insertAfter('#presque-fin')
.css('background', '#fea');