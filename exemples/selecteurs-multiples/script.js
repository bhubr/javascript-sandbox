// Cliquer sur ces boutons enlève leur classe:
// removeClass() sans argument enlève tout!
$('.cyan,.magenta').click(function() {
    $(this).removeClass();
});

// Cliquer sur ces boutons n'enlève que leur classe yellow ou orange mais garde underline-text:
// removeClass() peut prendre plusieurs classes comme arguments
$('.yellow,.orange').click(function() {
    $(this).removeClass('yellow orange');
})