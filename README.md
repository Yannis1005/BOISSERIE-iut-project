# Projet Node IUT

## Description 📝

Ce projet est une application Node.js permettant la gestion d'une bibliothèque de films. Parmi ses fonctionnalités, on retrouve :

### Fonctionnalités principales

- **Envoi d'e-mails** :
   - Envoi automatique d'un e-mail de bienvenue lors de la création d'un utilisateur.
   - Notifications par e-mail lors de l'ajout ou de la mise à jour d'un film (uniquement si le film est en favori pour ce dernier cas).


- **Gestion des films** :
   -  Gestion complète des films avec les informations suivantes : titre, réalisateur, date de sortie, genre et description.
   -  Administration des films par les utilisateurs disposant des droits adéquats (ajout, modification et suppression).
   -  Possibilité pour les utilisateurs d'avoir une liste de films en favoris.


- **Export des films** :
   -  Export des films au format CSV via un message broker, avec envoi du fichier par e-mail.
## Prérequis 🛠️

Pour exécuter cette application, vous aurez tout d'abord besoin des éléments suivants :

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## Installation 💻

1. En premier lieu clonez le dépôt GitHub :

   ```bash
   git clone https://github.com/Yannis1005/BOISSERIE-iut-project
   ```
   
2. Déplacez-vous dans le répertoire du projet :

   ```bash
   cd BOISSERIE-iut-project
   ```

2. Installez ensuite les dépendances du projet :

   ```bash
   npm install
   ```

3. Créez un fichier `.env` à la racine du projet et ajoutez-y les variables d'environnement suivantes :

   ```bash
   # Configuration pour Ethereal Email (utilisé pour les tests d'envoi d'e-mails)
   MAIL_HOST= # Adresse du serveur SMTP (smtp.ethereal.email)
   MAIL_PORT= # Numéro du port utilisé (587)
   MAIL_USER= # Identifiant pour l'authentification sur le serveur mail
   MAIL_PASS= # Mot de passe associé à l'identifiant
   MAIL_FROM= # Adresse e-mail de l'expéditeur
   ```

## Docker 🐳

Pour exécuter l'application, vous aurez besoin d'une base de données MySQL. Nous utilisons Docker pour lancer une instance de MySQL :

```bash
docker run -d --name hapi-mysql -p 3307:3306 -e MYSQL_ROOT_PASSWORD=hapi -e MYSQL_DATABASE=user mysql:8.0 --default-authentication-plugin=mysql_native_password
```

## Migrations 📅

Pour créer les tables nécessaires à l'application, exécutez les migrations avec la commande suivante :

```bash
npx knex migrate:latest
```

## Lancement de l'application 🚀

Pour démarrer l'application, utilisez la commande suivante :

```bash
npm start
```

Une fois l'application lancée, vous pouvez accéder à l'interface utilisateur à l'adresse suivante : [http://localhost:3000](http://localhost:3000).

La documentation de l'API est disponible à l'adresse suivante : [http://localhost:3000/documentation](http://localhost:3000/documentation).
C'est ici que vous pourrez tester les différentes routes de l'application.

## Tests 🧪

Enfin, pour exécuter les tests unitaires, utilisez la commande suivante :

```bash
npx lab
```