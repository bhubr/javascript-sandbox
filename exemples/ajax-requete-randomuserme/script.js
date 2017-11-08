$('#requete-randomuser').click(function() {
   $.get('https://api.randomuser.me', function(data) {
     var user = data.results[0];
     var name = user.name;
     var loc = user.location;
     $('#user-name').html(name.first +
        ' ' + name.last);
     $('#email').html(user.email);
     $('#adresse').html(loc.city + ', ' +
        loc.postcode + ' ' + loc.state);
     $('#picture').prop('src', user.picture.large);
   });
});