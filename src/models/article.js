const db = require('../database');

function genererID() {
  const id = Math.floor(1000 + Math.random() * 9000);
  const existing = db.prepare('SELECT id FROM articles WHERE id = ?').get(id);
  if (existing) return genererID();
  return id;
}

const Article = {

  getAll: (filters) => {
    let query = 'SELECT * FROM articles WHERE 1=1';
    const params = [];
    if (filters.categorie) { query += ' AND categorie = ?'; params.push(filters.categorie); }
    if (filters.auteur)    { query += ' AND auteur = ?';    params.push(filters.auteur); }
    if (filters.date)      { query += ' AND date = ?';      params.push(filters.date); }
    return db.prepare(query).all(...params);
  },

  getById: (id) => {
    return db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
  },

  create: (data) => {
    const { titre, contenu, auteur, categorie, tags } = data;
    const id = genererID();
    db.prepare(
      'INSERT INTO articles (id, titre, contenu, auteur, categorie, tags) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(id, titre, contenu, auteur, categorie, tags || '');
    return id;
  },

  update: (id, data) => {
    const { titre, contenu, categorie, tags } = data;
    const result = db.prepare(
      'UPDATE articles SET titre=?, contenu=?, categorie=?, tags=? WHERE id=?'
    ).run(titre, contenu, categorie, tags, id);
    return result.changes;
  },

  delete: (id) => {
    const result = db.prepare('DELETE FROM articles WHERE id = ?').run(id);
    return result.changes;
  },

  search: (query) => {
    return db.prepare(
      'SELECT * FROM articles WHERE titre LIKE ? OR contenu LIKE ?'
    ).all(`%${query}%`, `%${query}%`);
  }
};

module.exports = Article;