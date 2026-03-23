const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./blog.db', (err) => {
  if (err) console.error('Erreur connexion DB:', err.message);
  else console.log('Connecté à SQLite');
});

db.run(`
  CREATE TABLE IF NOT EXISTS articles (
    id        INTEGER PRIMARY KEY,
    titre     TEXT NOT NULL,
    contenu   TEXT NOT NULL,
    auteur    TEXT NOT NULL,
    categorie TEXT NOT NULL,
    tags      TEXT,
    date      TEXT DEFAULT (date('now'))
  )
`);

module.exports = db;