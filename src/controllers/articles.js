const Article = require('../models/article');

exports.getAll = (req, res) => {
  try {
    const filters = {
      categorie: req.query.categorie,
      auteur: req.query.auteur,
      date: req.query.date
    };
    const rows = Article.getAll(filters);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = (req, res) => {
  try {
    const row = Article.getById(req.params.id);
    if (!row) return res.status(404).json({ error: 'Article non trouvé' });
    res.status(200).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = (req, res) => {
  try {
    const { titre, contenu, auteur, categorie, tags } = req.body;
    if (!titre || !contenu || !auteur || !categorie)
      return res.status(400).json({ error: 'Champs obligatoires : titre, contenu, auteur, categorie' });
    const id = Article.create({ titre, contenu, auteur, categorie, tags });
    res.status(201).json({ message: 'Article créé avec succès', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = (req, res) => {
  try {
    const { titre, contenu, categorie, tags } = req.body;
    if (!titre || !contenu || !categorie)
      return res.status(400).json({ error: 'Champs obligatoires : titre, contenu, categorie' });
    const changes = Article.update(req.params.id, { titre, contenu, categorie, tags });
    if (!changes) return res.status(404).json({ error: 'Article non trouvé' });
    res.status(200).json({ message: 'Article modifié avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = (req, res) => {
  try {
    const changes = Article.delete(req.params.id);
    if (!changes) return res.status(404).json({ error: 'Article non trouvé' });
    res.status(200).json({ message: 'Article supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.search = (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Paramètre query requis' });
    const rows = Article.search(query);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};