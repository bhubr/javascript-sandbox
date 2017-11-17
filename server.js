/**
 * ATTENTION le fichier sandboxApp.js est assez complexe.
 * Il sert à initialiser l'appli permettant d'avoir l'éditeur HTML&JavaScript en ligne
 */
const app      = require('./sandboxApp');
const db       = require('sqlite');
const Promise  = require('bluebird');
const qbuilder = require('./lib/queryBuilder');
const passwd   = require('./lib/passwd');
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
    return Promise.reject(new Error('Missing fields'));
  }

  const { username, email } = user;

  // L'étape de vérification a réussi, on insère l'utilisateur dans le tableau
  // On crée un faux "id" pour simuler une insertion SQL. En SQL les "id" sont
  // incrémentés à chaque insertion. On simule cela en incrémentant un compteur
  // "userId" à chaque insertion
  // userList.push();
  // return true;

  return passwd.hash(user.password)
  .then(password => qbuilder.insert('users', {
    username: user.username,
    email:    user.email,
    password
  }))
  .then(query => db.run(query))
  .then(() => qbuilder.selectWhere('users', { email }))
  .then(query => db.get(query));
}


app.post('/jquery/ajax/login', function(req, res) {

  // Récupérer email et password
  var identifiants = req.body;
  var identifier = identifiants.identifier;
  if(! identifiants.identifier || ! identifiants.password) {
    return res.status(400).json({
      message: 'paramètre requis manquant'
    });
  }
  var query = qbuilder.selectAll('users', "email='" + identifier + "' OR username='" + identifier + "'");
  console.log('requête SQL recherche user pour login', query);
  db.get(query)
  .then(existingUser => {
    console.log('résultat requête', existingUser);
    if(! existingUser) {
      return res.status(404).json({
        message: 'Utilisateur non trouvé'
      });
    }
    passwd.match(existingUser, identifiants.password)
    .then(() => res.json({ user: existingUser }))
    .catch(err => {
      console.error(err);
      return res.status(401).json({
        message: 'Mot de passe incorrect'
      });
    });
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
  createNewUser(user)
  .then(user => res.json({ user: user }))
  .catch(err => {
    if( err.code === 'SQLITE_CONSTRAINT' ) {
      return res.status(409).json({
        message: 'Un utilisateur existe déjà avec cet email ou cet identifiant'
      });
    }
    else if( err.message === 'Missing fields' ) {
      return res.status(400).json({ message: 'Champs manquants dans la requête' });
    }
    else {
      return res.status(500).json({ message: 'Erreur serveur inconnue: ' + err.message }); 
    }
  });
});

app.get('/jquery/ajax/username-check', function(req, res) {
  var username = req.query.username;
  var query = qbuilder.selectWhere('users', { username });
  db.get(query)
  .then(records => {
    // Si aucun user n'existe avec cet username, records vaut undefined
    // et on renvoie alors true
    res.json({ success: records === undefined });
  });
});

app.get('/jquery/ajax/email-check', function(req, res) {
  var email = req.query.email;
  var query = qbuilder.selectWhere('users', { email });
  db.get(query)
  .then(records => {
    // Si aucun user n'existe avec cet email, records vaut undefined
    // et on renvoie alors true
    res.json({ success: records === undefined });
  });

});

Promise.resolve()
  // First, try connect to the database
  .then(() => db.open('./example-database.sqlite', { Promise }))
  .then(() => db.migrate({})) //  force: 'last' 
  .catch(err => console.error(err.stack))
  // Finally, launch Node.js app
  .finally(() => {
    app.listen(3000);
    console.log('Le serveur écoute sur le port 3000. Laissez cette console ouverte ! Avec votre navigateur, allez sur http://localhost:3000');
  });
