// Gestion de l'évènement keyup
var ctrlSt  = $('#ctrl-status');
var shiftSt = $('#shift-status');
var altSt   = $('#alt-status');
var keyName = $('#key-name');

// Ici ça devient intéressant de se pencher sur le contenu de l'objet event
function onKeyChange(event) {
    ctrlSt.removeClass()
    .addClass(event.ctrlKey ? 'text-green' : 'text-red')
    .html(event.ctrlKey ? 'ON' : 'OFF');

    shiftSt.removeClass()
    .addClass(event.shiftKey ? 'text-green' : 'text-red')
    .html(event.shiftKey ? 'ON' : 'OFF');

    altSt.removeClass()
    .addClass(event.altKey ? 'text-green' : 'text-red')
    .html(event.altKey ? 'ON' : 'OFF');
    
    keyName.html(event.key);
}

$('#events3-text').keydown(onKeyChange);
$('#events3-text').keyup(onKeyChange);