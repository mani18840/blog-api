const Article = require('../models/article');

exports.getAll = (req, res) => {
  const filters = { categorie: req.query.categorie, auteur: req.query.auteur, date: req.query.date };
  Article.getAll(filters, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
};

exports.getById = (req, res) => {
  Article.getById(req.params.id, (err, row) => {
    if (err)  return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Article non trouvé' });
    res.status(200).json(row);
  });
};

exports.create = (req, res) => {
  const { titre, contenu, auteur, categorie, tags } = req.body;
  if (!titre || !contenu || !auteur || !categorie)
    return res.status(400).json({ error: 'Champs obligatoires : titre, contenu, auteur, categorie' });
  Article.create({ titre, contenu, auteur, categorie, tags }, (err, id) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Article créé avec succès', id });
  });
};

exports.update = (req, res) => {
  const { titre, contenu, categorie, tags } = req.body;
  if (!titre || !contenu || !categorie)
    return res.status(400).json({ error: 'Champs obligatoires : titre, contenu, categorie' });
  Article.update(req.params.id, { titre, contenu, categorie, tags }, (err, changes) => {
    if (err)      return res.status(500).json({ error: err.message });
    if (!changes) return res.status(404).json({ error: 'Article non trouvé' });
    res.status(200).json({ message: 'Article modifié avec succès' });
  });
};

exports.delete = (req, res) => {
  Article.delete(req.params.id, (err, changes) => {
    if (err)      return res.status(500).json({ error: err.message });
    if (!changes) return res.status(404).json({ error: 'Article non trouvé' });
    res.status(200).json({ message: 'Article supprimé avec succès' });
  });
};

exports.search = (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Paramètre query requis' });
  Article.search(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
};