
## Gestion des Heures Enseignants

### Description

Application de gestion des heures de travail des enseignants avec suivi des paiements. 
Le projet utilise :

- Frontend : React
- Backend : Node.js + Express
- Base de données : PostgreSQL
- Option de déploiement : Docker / Docker Compose

### Fonctionnalités

- Enregistrement des heures effectuées par enseignant
- Gestion des tarifs horaires
- Calcul automatique des montants à payer
- Suivi des paiements
- Interface utilisateur React
- API REST avec Express

### Prérequis

- Node.js
- npm
- PostgreSQL
- Docker Desktop (facultatif, recommandé pour exécuter l’ensemble)

### Installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/YankeyNwolle/gestion_heures_argent.git
   ```

2. Se placer dans le dossier du projet :
   ```bash
   cd gestion_heures_argent
   ```

3. Installer les dépendances :

   - Backend :
     ```bash
     cd backend
     npm install
     ```

   - Frontend :
     ```bash
     cd ../frontend
     npm install
     ```

4. Copier et configurer les variables d’environnement si nécessaire :
   - Exemple : `backend/.env`

### Lancer le projet

Option 1 : sans Docker

- Démarrer le backend :
  ```bash
  cd backend
  nodemon server.js
  ```

- Démarrer le frontend :
  ```bash
  cd frontend
  npm run dev
  ```

Option 2 : avec Docker

- Depuis la racine du projet :
  ```bash
  docker compose up --build
  ```

### Structure du projet

- `backend/` : code serveur Express
- `frontend/` : application React
- `docker-compose.yml` : configuration Docker pour le backend, le frontend et PostgreSQL
- `README.md` : documentation du projet

### Contribution

Les contributions sont les bienvenues :

1. Créer une branche dédiée
2. Ajouter ou modifier le code
3. Soumettre une pull request

### Auteur

Yankey N'wollé Ange Christian