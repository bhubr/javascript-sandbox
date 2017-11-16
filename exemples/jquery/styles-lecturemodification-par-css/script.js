// Styles : lecture/modification par css

var colorFirst = $('p:first').css('color');
$('p:first + div > span').html(colorFirst);

$('p:eq(1)').css('color', 'green');
var colorSecond = $('p:eq(1)').css('color');
$('p:eq(1) + div > span').html(colorSecond);

var properties = {
    color: 'red',
    backgroundColor: '#bbb',
    fontSize: '130%',
    padding: '10px',
    'font-weight': 'bold'
};
var thirdParagraph = $('p:eq(2)');
thirdParagraph.css(properties);
for( var key in properties ) {
    var value = thirdParagraph.css(key);
    console.log( key, value );
    var texte = '<div>Valeur de la propriété <code>' +
        key + '</code> après modification: <span></span></div>';
    var div = $( texte ).insertAfter( thirdParagraph );
    div.find('span').html( value );
}
