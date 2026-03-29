const Database = require('better-sqlite3');

const db = new Database('./blog.db', (err) => {
  if (err) console.error('Erreur connexion DB:', err.message);
  else console.log('Connecté à SQLite');
});

db.exec(`
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

console.log('Connecté à SQLite');
module.exports = db;