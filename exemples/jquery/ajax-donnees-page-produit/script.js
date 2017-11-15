$.get('/produits.json', function(produits) {
   var divProduits = $('#produits');
   
    produits.forEach(function(produit) {
        divProduits.append('<div class="col-sm-12 col-md-6">' +
            '<img class="img-thumbnail" src="' +
                produit.image + '" />' +
            '<div>' + produit.titre + '</div>' +
        '</div>');
    });
}, 'json');

$('#produits').scroll(function(e) {
    console.log('scroll', e)
})