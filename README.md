# JS Sandbox

Un "bac à sable" pour jouer avec HTML, CSS et surtout JavaScript.

## Installation

Pré-requis :

* (optionnel mais recommandé) [Git](https://git-scm.org) pour récupérer le dépôt
* [Node.js](https://nodejs.org) pour pouvoir exécuter le serveur de l'application

Deux options possibles pour utiliser cet outil :

* **Avec Git**. Il faut alors installer [Git](https://git-scm.org) pour pouvoir cloner le dépot.
* Alternativement, vous pouvez télécharger l'archive courante du dépôt en suivant [ce lien](https://github.com/bhubr/javascript-sandbox/archive/0.9.zip).

## Installation et paramétrage de Git

Avec l'installeur de Git, il suffit, **presque** à chaque étape, de faire "Next".

Sous Windows, une des étapes demande s'il faut ajouter Git au PATH, et il faut cocher cette option.

Git sera installé sous `C:\Program Files\Git`. Sous Git Bash, il devrait être directent accessible par la commande :
```
$ git
```

Si ce n'est pas le cas, il faudra saisir la commande :
```
$ export PATH=$PATH:"/c/Program Files/Git/bin"
```

Ensuite vous devrez, si vous comptez faire des *commits*, paramétrer Git, pour lui dire qui vous êtes (remplacer par vos vrais nom et email) :

```
$ git config --global user.name "John Doe"
$ git config --global user.email johndoe@example.com
```

## Installation de Node.js

Là aussi, l'installeur fait tout, les options par défaut doivent convenir. Node doit être installé sous `C:\Program Files\nodejs`.

Si, après l'avoir installé, vous obtenez une erreur en essayant de lancer `node` depuis Git Bash, c'est qu'il n'est pas accessible. Il faut l'ajouter au PATH comme pour Git :
```
$ export PATH=$PATH:"/c/Program Files/nodejs"
```

**Quand vous lancez `node` sans argument**, il est *normal* que cela semble tourner dans la vide et que vous ne récupériez pas le `$` qui vous invite à saisir des commandes dans le shell.

## Récupération de du dépôt ou de l'archive

Si vous utilisez Git, placez-vous dans le dossier où vous comptez placer la copie du dépôt.
Puis saisissez :
```
$ git clone https://github.com/bhubr/javascript-sandbox.git
$ cd javascript-sandbox
```

Si vous utilisez l'archive, il vous faudra aussi vous rendre dans le répertoire qui a été créé par la décompression de celle-ci.

## Installation des dépendances (modules)

Les applications Node utilisent souvent un certain nombre de modules existants. Celle-ci ne fait pas exception à la règle, et les dépendances doivent être installées en entrant :

```
$ npm install
```

## Lancement

```
$ npm install
```

Puis ouvrez votre navigateur et allez à : http://localhost:3000