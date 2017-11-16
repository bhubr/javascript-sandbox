// Manipulation d'attributs / propriétés
var theChoice = $('#the-choice');
var the2ndChoice = $('#the-2nd-choice');

// Similaire
console.log("theChoice.attr('id')", theChoice.attr('id')); // renvoie "the-choice"
console.log("theChoice.prop('id')", theChoice.prop('id')); // renvoie "the-choice"
// Différent
console.log("theChoice.attr('checked')", theChoice.attr('checked')); // renvoie "checked"
console.log("theChoice.prop('checked')", theChoice.prop('checked')); // renvoie true

// Différent
console.log("the2ndChoice.attr('checked')", the2ndChoice.attr('checked')); // renvoie undefined
console.log("the2ndChoice.prop('checked')", the2ndChoice.prop('checked')); // renvoie false

setTimeout(function() {
   var the3rdChoice = $('input[type="checkbox"]:eq(2)');
   the3rdChoice.attr('id', 'the-3rd-choice');
   the3rdChoice.prop('checked', true);
   the3rdChoice.after(' <label for="the-3rd-choice">J\'aime les pâtes</label>' );
   console.log("the3rdChoice.attr('id')", the3rdChoice.attr('id'));
}, 3000);