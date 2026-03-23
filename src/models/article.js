const db = require('../database');

// Génère un ID aléatoire unique entre 1000 et 9999
function genererID(callback) {
  const id = Math.floor(1000 + Math.random() * 9000);
  db.get('SELECT id FROM articles WHERE id = ?', [id], (err, row) => {
    if (row) genererID(callback); // déjà utilisé, on réessaie
    else callback(id);
  });
}

const Article = {

  getAll: (filters, callback) => {
    let query = 'SELECT * FROM articles WHERE 1=1';
    const params = [];
    if (filters.categorie) { query += ' AND categorie = ?'; params.push(filters.categorie); }
    if (filters.auteur)    { query += ' AND auteur = ?';    params.push(filters.auteur); }
    if (filters.date)      { query += ' AND date = ?';      params.push(filters.date); }
    db.all(query, params, callback);
  },

  getById: (id, callback) => {
    db.get('SELECT * FROM articles WHERE id = ?', [id], callback);
  },

  create: (data, callback) => {
    const { titre, contenu, auteur, categorie, tags } = data;
    genererID((id) => {
      db.run(
        'INSERT INTO articles (id, titre, contenu, auteur, categorie, tags) VALUES (?, ?, ?, ?, ?, ?)',
        [id, titre, contenu, auteur, categorie, tags || ''],
        function(err) { callback(err, id); }
      );
    });
  },

  update: (id, data, callback) => {
    const { titre, contenu, categorie, tags } = data;
    db.run(
      'UPDATE articles SET titre=?, contenu=?, categorie=?, tags=? WHERE id=?',
      [titre, contenu, categorie, tags, id],
      function(err) { callback(err, this?.changes); }
    );
  },

  delete: (id, callback) => {
    db.run('DELETE FROM articles WHERE id = ?', [id],
      function(err) { callback(err, this?.changes); }
    );
  },

  search: (query, callback) => {
    db.all(
      'SELECT * FROM articles WHERE titre LIKE ? OR contenu LIKE ?',
      [`%${query}%`, `%${query}%`],
      callback
    );
  }
};

module.exports = Article;