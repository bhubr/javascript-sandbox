// Manipulation d'attributs data

// Cela pourrait être récupéré d'un fichier JSON externe.
var translations = {
    "fr": {
        "the_title": "Questions essentielles",
        "the_subtitle": "Des questions que tout le monde se pose",
        "the_1st_paragraph": "Le 1er paragraphe explique des choses vitales à la compréhension de l'Univers.",
        "the_2nd_paragraph": "Le 2nd paragraphe explique plus modestement comment cuire des pois chiches."
    },
    "en": {
        "the_title": "Essential questions",
        "the_subtitle": "Questions everyone's asking oneself",
        "the_1st_paragraph": "1st paragraph explains things vital to the understanding of the Universe.",
        "the_2nd_paragraph": "2nd paragraphe more modestly explains how to cook chick peas."
    }    
};

$('#lang-selector a').click(function(e) {
    e.preventDefault();
    // Supprimer le # du début. Notez qu'ici on utise .attr() car on ne veut
    // pas l'URL absolue qui aurait été calculée avec .prop().
    var lang = $(this).attr('href').substr(1);
    // Démontre une autre fonction: .each()
    $('[data-translate]').each(function(index, elem) {
       var jqElem = $(this);
       var translateKey = jqElem.data('translate');
       jqElem.html( translations[lang][translateKey] );
    });
})