# 🚀 SkillShare

SkillShare est une application web fullstack (Monorepo) permettant aux utilisateurs de proposer et d'acheter des services en utilisant un système de jetons (balance virtuelle).

Ce projet est divisé en deux parties principales :
* **Client** : Une interface utilisateur moderne construite avec React, Vite et TailwindCSS.
* **Serveur** : Une API robuste développée avec Node.js, Express et adossée à une base de données PostgreSQL hébergée sur Supabase.

## ✨ Fonctionnalités

### Gestion des utilisateurs :
* Inscription avec validation stricte du mot de passe (complexité requise) et filtrage des pseudonymes via une liste noire.
* Connexion sécurisée avec hashage des mots de passe (Bcrypt) et authentification par Token (JWT).
* Déconnexion sécurisée via l'invalidation des tokens (système de Blacklist en mémoire).

### Place de marché de services :
* Consultation des services disponibles.
* Achat de services avec vérification des fonds et transfert de jetons entre l'acheteur et le vendeur.
* Enregistrement complet des transactions.

### Espace Compte :
* Consultation du profil et de la balance de jetons en temps réel.

### Sécurité :
* Protection contre les attaques de force brute (Rate Limiting).
* Sécurisation des en-têtes HTTP via Helmet.

## 🛠️ Technologies Utilisées

### Frontend (Client)
* **React 19** & **React Router DOM** pour la navigation.
* **Vite** pour un build et un rechargement à chaud ultra-rapides.
* **TailwindCSS 4** pour le style.
* **Lucide React** pour les icônes.

### Backend (Serveur)
* **Node.js** & **Express**.
* **Supabase (PostgreSQL)** pour la base de données.
* **Bcrypt** & **JSON Web Token (JWT)** pour l'authentification.
* **Vitest** pour les tests unitaires.

## 📁 Structure du Projet

```text
SkillShare/
├── client/                 # Application React / Vite
│   ├── src/                # Code source front-end (Composants, Pages...)
│   └── package.json        # Dépendances front-end
├── server/                 # API Express
│   ├── middleware/         # Middlewares (Auth...)
│   ├── router/             # Définition des routes API
│   ├── db_manager.js       # Fonctions d'interaction avec Supabase
│   ├── utils.js            # Utilitaires (Sécurité, validation)
│   └── package.json        # Dépendances back-end
├── Doc/                    # Documentation (Diagrammes MCD / MLD)
├── test/                   # Collection Insomnia pour tester l'API
└── package.json            # Configuration du monorepo (Workspaces)
```
## 🚀 Installation et Démarrage local

### 1. Prérequis
* Node.js (Version 20 recommandée).
* Un projet Supabase configuré avec les tables nécessaires (`users`, `services`, `transactions`).

### 2. Installation des dépendances
Clonez le dépôt, puis installez les dépendances à la racine du projet (cela installera automatiquement les dépendances du client et du serveur grâce aux workspaces npm) :

```bash
git clone <votre-repo-url>
cd SkillShare
npm install
```

### 3. Configuration de l'environnement
Dans le dossier server, créez un fichier .env en vous basant sur le fichier .env.example fourni :

# server/.env
SUPABASE_URL=[https://votre-id-projet.supabase.co](https://votre-id-projet.supabase.co)
SUPABASE_API_ANON_PUBLIC=votre-clef-api-publique
JWT_SECRET=votre_clef_secrete_super_secure # (Optionnel, par défaut configuré dans le code)

### 4. Lancer l'application
Grâce à concurrently configuré à la racine, vous pouvez lancer le frontend et le backend avec une seule commande :
npm run dev

* **Le Frontend sera accessible sur http://localhost:5173**
* **Le Backend (API) tournera sur http://localhost:3000**

## 🧪 Tests
### Tests de l'API avec Insomnia
Le projet inclut une collection prête à l'emploi pour tester facilement les routes d'authentification (/register et /login) et observer les différentes validations de sécurité (mot de passe trop court, absence de majuscule, etc.).

* **Téléchargez et installez Insomnia.**

* **Importez le fichier ./test/insomnia_collection.yaml.**

* **Assurez-vous que la variable d'environnement Insomnia base_url est configurée sur http://localhost:3000.**

### Tests Unitaires
Les règles de gestion (validation de la robustesse des mots de passe, liste noire des pseudos) sont testées avec Vitest. Pour exécuter les tests :
```bash
npm run test
```
## 🛡️ Intégration Continue (CI)
Le projet utilise GitHub Actions (.github/workflows/ci.yml). À chaque push ou pull_request sur la branche main :

* **Le code serveur est audité pour ses vulnérabilités de sécurité (npm audit --audit-level=high) et les tests unitaires sont exécutés.**
* **Le code client est linté (ESLint) et un test de build est effectué.**
