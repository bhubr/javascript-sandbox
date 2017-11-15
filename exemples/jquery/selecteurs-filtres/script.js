// FILTRES :first et :last
// Ici un intérêt de find: sans find, on aurait écrit
// $('#filtres-table1 tr:first,#filtres-table1 tr:last')
// On a donc fait une première sélection (#filtres-table1)
// Puis une 2ème au sein de cette première
$('#filtres-table1')
.find('tr:first,tr:last')
.addClass('yellow');

// FILTRES :odd et :even
// Ici le 1er sélecteur :odd prend les lignes IMPAIRES:
// 1 et 3 donc, en comptant de zéro, les 2ème et 4ème lignes
// Puis dans chaque ligne de cette sélection il trouve la
// dernière cellule et la colore en rouge
$('#filtres-table1 tr:odd')
.find('td:last')
.css('color', '#f00');
// Même idée avec :even et 1ère cellule, color en bleu
$('#filtres-table1 tr:even')
.find('td:first')
.css('color', '#00f');


// FILTRE :eq(n) sélectionne l'élément à l'index n
$('#filtres-table1 tr:eq(2)')
.find('td:eq(1)')
.addClass('green');

// FILTRE :not() = négation
// Ici :not(.green) va sélectionner toutes les cellules
// n'ayant pas la classe green et les mettre en gras
$('#filtres-table1 td:not(.green)')
.removeClass()
.css('font-weight', 'bold');