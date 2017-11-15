// Gère la soumission du formulaire:
// récupère la valeur entrée et s'en sert pour interroger
// l'API de themoviedb.org
var form = $('#movie-title');
var apiKey;
var tmdbUrl;
var tmdbImageUrl = 'http://image.tmdb.org/t/p/w185/';
form.submit(function(evt) {
    evt.preventDefault();
    var inputTitle = form.find('input[name="title"]');
    var title = inputTitle.val();
    $.get(tmdbUrl + encodeURIComponent(title),
    function(data) {
          var movies = data.results;
          for(i=0; i<movies.length;i++) {
            var m = movies[i];
            $('#tmdb-results').append('<div style="border-bottom: 1px solid #ddd">' + 
                '<img style="float:right;" src="' + tmdbImageUrl + m.poster_path + '" />' +
                '<h3>' + m.title + '</h3>' +
                '<p>' + m.overview + '</p>' +
            '</div><div style="clear:both"></div>');  
          }
    });
})

// Charge la clé d'API
// (ne PAS la sauver dans Git)
$.get('/exemples/jquery/ajax-requete-themoviedborg/tmdb-key.json', function(data) {
    apiKey = data.key;
    tmdbUrl = 'http://api.themoviedb.org/3/search/movie?api_key=' + apiKey + '&include_adult=false&page=1&language=en-US&query=';
    form.find('button')
    .prop('disabled', false);
})
