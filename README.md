# 📝 Blog API — INF222 EC1

API REST backend pour la gestion des articles d'un blog, développée dans le cadre du cours **INF222 — Développement Backend** à l'Université de Yaoundé I.

---

## 🚀 Technologies utilisées

- **Node.js** — Environnement d'exécution JavaScript
- **Express.js** — Framework web pour Node.js
- **SQLite** — Base de données légère (via `sqlite3`)
- **Swagger UI** — Documentation interactive de l'API
- **HTML/CSS/JavaScript** — Interface web intégrée

---

## 📁 Structure du projet
```
blog-api/
├── src/
│   ├── server.js          ← Point d'entrée du serveur Express
│   ├── database.js        ← Connexion et initialisation SQLite
│   ├── routes/
│   │   └── articles.js    ← Définition des endpoints + doc Swagger
│   ├── controllers/
│   │   └── articles.js    ← Logique métier et validation
│   └── models/
│       └── article.js     ← Requêtes SQL (accès aux données)
├── public/
│   ├── index.html         ← Interface web
│   ├── style.css          ← Styles de l'interface
│   └── app.js             ← Appels fetch vers l'API
├── swagger.js             ← Configuration Swagger
├── .env                   ← Variables d'environnement
└── package.json
```

---

## ⚙️ Installation et lancement

### Prérequis
- Node.js (version 18 ou supérieure)
- npm

### Étapes
```bash
# 1. Cloner le dépôt
git clone https://github.com/mani18840/blog-api.git

# 2. Accéder au dossier
cd blog-api

# 3. Installer les dépendances
npm install

# 4. Lancer le serveur en développement
npm run dev
```

Le serveur démarre sur **http://localhost:3000**

---

## 🔌 Endpoints de l'API

| Méthode | Endpoint | Description | Code HTTP |
|---------|----------|-------------|-----------|
| `POST` | `/api/articles` | Créer un nouvel article | 201 |
| `GET` | `/api/articles` | Lister tous les articles | 200 |
| `GET` | `/api/articles?categorie=Tech` | Filtrer par catégorie | 200 |
| `GET` | `/api/articles?auteur=Jean` | Filtrer par auteur | 200 |
| `GET` | `/api/articles/:id` | Récupérer un article par ID | 200 / 404 |
| `PUT` | `/api/articles/:id` | Modifier un article | 200 / 404 |
| `DELETE` | `/api/articles/:id` | Supprimer un article | 200 / 404 |
| `GET` | `/api/articles/search?query=texte` | Rechercher dans titre/contenu | 200 |

---

## 📋 Exemples d'utilisation

### Créer un article
```json
POST /api/articles
Content-Type: application/json

{
  "titre": "Introduction à Node.js",
  "contenu": "Node.js est un environnement d'exécution JavaScript...",
  "auteur": "Igor MANI",
  "categorie": "Tech",
  "tags": "nodejs,javascript,backend"
}
```

**Réponse :**
```json
{
  "message": "Article créé avec succès",
  "id": 4782
}
```

### Récupérer tous les articles
```
GET /api/articles
```

**Réponse :**
```json
[
  {
    "id": 4782,
    "titre": "Introduction à Node.js",
    "contenu": "Node.js est un environnement...",
    "auteur": "Igor MANI",
    "categorie": "Tech",
    "tags": "nodejs,javascript,backend",
    "date": "2026-03-19"
  }
]
```

### Rechercher un article
```
GET /api/articles/search?query=nodejs
```

---

## ✅ Bonnes pratiques appliquées

- Validation des entrées (titre, auteur, catégorie obligatoires)
- Codes HTTP corrects : `200`, `201`, `400`, `404`, `500`
- ID unique aléatoire entre 1000 et 9999 pour chaque article
- Architecture MVC : séparation routes / contrôleurs / modèles
- Middleware global de gestion des erreurs 500
- CORS activé pour les appels depuis l'interface web

---

## 📖 Documentation Swagger

Une fois le serveur lancé, accède à la documentation interactive :
```
http://localhost:3000/api-docs
```

Tu peux y tester tous les endpoints directement depuis le navigateur.

---

## 🌐 Interface web

Une interface web complète est intégrée et accessible sur :
```
http://localhost:3000
```

Elle permet de créer, lister, modifier, supprimer et rechercher des articles sans utiliser Swagger.

---

## 👤 Auteur

**MANI AWONO ELOUNDOU Igor**
Filière : Informatique — Licence 2 (INFO L2)
UE : INF222 — Développement Backend
Université de Yaoundé I
