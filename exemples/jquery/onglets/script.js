var onglets = $('#onglets li a');

onglets.click(function(e) {
    var link = $(this);
    onglets.removeClass('active');
    link.addClass('active');
    var idPanneau = link.data('panneau-id');
    $('.panneau').hide();
    $('#' + idPanneau).show();
});