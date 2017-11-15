/**
 * ATTENTION le fichier sandboxApp.js est assez complexe.
 * Il sert à initialiser l'appli permettant d'avoir l'éditeur HTML&JavaScript en ligne
 */
var app = require('./sandboxApp');



/*-------------------------------------------------------*
 | Déclaration de gestionnaires pour les exemples AJAX
 *-------------------------------------------------------*
 |
 */

// 1er exemple: envoie du HTML généré dynamiquement.
// On utilise app.get pour attacher un gestionnaire à l'URL /ajax-example
// uniquement avec la méthode GET
app.get('/jquery/ajax/example-simple', function(req, res) {
  var date = new Date();
  var exampleHtml = '<p>Un peu de HTML retourné par le serveur.</p>' +
    '<p><em>Généré le: ' + date.toString() + '</em></p>';
  res.send(exampleHtml);
});

// 2ème exemple : envoi formulaire par méthode GET
// Notez bien d'où on extrait les paramètres passé par le client (req.query)
app.get('/jquery/ajax/form-get', function(req, res) {
  var name = req.query.name;
  var birthdate = req.query.birthdate;
  var exampleHtml = '<p>Salutations, <em>' + name +
    '</em>, né(e) le <em>' + birthdate + '</em>.</p>';
  res.send(exampleHtml);
});

// 3ème exemple : envoi formulaire par méthode POST
// Ici les paramètres viennent de req.body
app.post('/jquery/ajax/form-post', function(req, res) {
  var title = req.body.title;
  var text = req.body.text;
  var exampleHtml = '<h2>' + title + '</h2>' +
    '<p>' + text + '</p>';
  res.send(exampleHtml);
});


/**
 * Création d'un tableau vide où on va stocker les utilisateurs
 */
var userList = [];
var userId = 1;

/**
 * Création d'un utilisateur : on le stocke dans le tableau userList
 * ATTENTION ! Dans la "vraie vie", on utiliserait une base de données !
 */
function createNewUser(user) {

  // On vérifie que les données de l'utilisateur sont renseignées
  // Si non, on renvoie false
  if(! user || ! user.username || ! user.email || ! user.password) {
    return false;
  }

  // L'étape de vérification a réussi, on insère l'utilisateur dans le tableau
  // On crée un faux "id" pour simuler une insertion SQL. En SQL les "id" sont
  // incrémentés à chaque insertion. On simule cela en incrémentant un compteur
  // "userId" à chaque insertion
  userList.push({
    id: userId++,
    username: user.username,
    email:    user.email,
    password: user.password
  });
  return true;
}


app.post('/jquery/ajax/login', function(req, res) {

  // Récupérer email et password
  var identifiants = req.body;
  if(! identifiants.email || ! identifiants.password) {
    return res.status(400).json({
      message: 'paramètre requis manquant'
    });
  }

  for(var i = 0 ; i < userList.length ; i++) {
    var user = userList[i];

    if(identifiants.email == user.email) {


      if(identifiants.password == user.password) {
        return res.json({
          message: 'Vous avez été identifié',
        });
      }
      else {
        return res.status(401).json({
          message: 'Mot de passe incorrect'
        });
      }

    }

  }
  return res.status(404).json({
    message: 'Utilisateur non trouvé'
  });

});


/**
 * Ce code va gérer la requête POST vers l'URL /register de notre micro-serveur
 */
app.post('/jquery/ajax/register', function(req, res) {

  // Les données envoyées par le client (navigateur) sont dans la propriété "body"
  // de l'objet req (pour request)
  var user = req.body;

  // createNewUser() va nous renvoyer true ou false
  var success = createNewUser(user);

  if(success) {
    // Envoyer un message sur la console du serveur
    console.log('Utilisateur enregistré: ', user, '\nListe des utilisateurs', userList);
    res.json({ user: user });
  }
  else {
    res.status(400).json({ error: 'Champs manquants dans la requête' });
  }
});

app.get('/jquery/ajax/username-check', function(req, res) {
  var username = req.query.username;
  for(u = 0 ; u < userList.length ; u++) {
    if(username === userList[u].username) {
      return res.json({ success: false });
    }
  }
  res.json({ success: true });
});




console.log('Le serveur écoute sur le port 3000. Laissez cette console ouverte ! Avec votre navigateur, allez sur http://localhost:3000');
app.listen(3000);