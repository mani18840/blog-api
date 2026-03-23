const API = 'http://localhost:3000/api/articles';

function showSection(id, btn) {
  document.querySelectorAll('main section').forEach(s => s.style.display = 'none');
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  document.getElementById(id).style.display = 'block';
  if (btn) btn.classList.add('active');
  if (id === 'liste') chargerArticles();
}

function carteArticle(a, actions = '') {
  return `
    <div class="article-card">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
        <h3>${a.titre}</h3>
        <span style="font-family:'Playfair Display',serif; font-size:1.4rem; color:var(--or); font-weight:700;">#${a.id}</span>
      </div>
      <div class="article-meta">
        <span class="badge badge-auteur">✍️ ${a.auteur}</span>
        <span class="badge badge-cat">📁 ${a.categorie}</span>
        <span class="badge badge-date">📅 ${a.date}</span>
        ${a.tags ? a.tags.split(',').map(t => `<span class="badge badge-tag">#${t.trim()}</span>`).join('') : ''}
      </div>
      <div class="article-contenu">${a.contenu}</div>
      ${actions}
    </div>`;
}

function afficherArticles(articles, conteneurId, avecActions = false) {
  const conteneur = document.getElementById(conteneurId);
  if (articles.length === 0) {
    conteneur.innerHTML = '<div class="vide">Aucun article trouvé.</div>';
    return;
  }
  conteneur.innerHTML = articles.map(a => {
    const actions = avecActions ? `
      <div class="article-actions">
        <button class="btn btn-danger" onclick="supprimerArticle(${a.id})">🗑 Supprimer</button>
      </div>` : '';
    return carteArticle(a, actions);
  }).join('');
}

// ── LISTE ──
async function chargerArticles() {
  const categorie = document.getElementById('filtreCategorie').value;
  const auteur    = document.getElementById('filtreAuteur').value;
  let url = API + '?';
  if (categorie) url += `categorie=${encodeURIComponent(categorie)}&`;
  if (auteur)    url += `auteur=${encodeURIComponent(auteur)}&`;
  try {
    const res  = await fetch(url);
    const data = await res.json();
    afficherArticles(data, 'listeArticles', true);
    document.getElementById('totalArticles').textContent = data.length;
    document.getElementById('totalCats').textContent     = new Set(data.map(a => a.categorie)).size;
    document.getElementById('totalAuteurs').textContent  = new Set(data.map(a => a.auteur)).size;
  } catch {
    document.getElementById('listeArticles').innerHTML =
      '<div class="message-erreur">Erreur de connexion à l\'API.</div>';
  }
}

function resetFiltres() {
  document.getElementById('filtreCategorie').value = '';
  document.getElementById('filtreAuteur').value    = '';
  chargerArticles();
}

// ── CRÉER ──
async function creerArticle() {
  const titre     = document.getElementById('titre').value.trim();
  const auteur    = document.getElementById('auteur').value.trim();
  const categorie = document.getElementById('categorie').value.trim();
  const tags      = document.getElementById('tags').value.trim();
  const contenu   = document.getElementById('contenu').value.trim();
  const msg       = document.getElementById('messageCreation');
  if (!titre || !auteur || !categorie || !contenu) {
    msg.innerHTML = '<div class="message-erreur">⚠️ Titre, auteur, catégorie et contenu sont obligatoires.</div>';
    return;
  }
  try {
    const res  = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titre, contenu, auteur, categorie, tags })
    });
    const data = await res.json();
    if (res.status === 201) {
      msg.innerHTML = `<div class="message-succes">✦ Article publié ! ID attribué : <strong>#${data.id}</strong></div>`;
      ['titre','auteur','categorie','tags','contenu'].forEach(id => document.getElementById(id).value = '');
    } else {
      msg.innerHTML = `<div class="message-erreur">❌ ${data.error}</div>`;
    }
  } catch {
    msg.innerHTML = '<div class="message-erreur">Erreur de connexion à l\'API.</div>';
  }
}

// ── CHERCHER PAR ID ──
async function chercherParId() {
  const id  = document.getElementById('searchId').value.trim();
  const div = document.getElementById('resultatId');
  if (!id) { div.innerHTML = '<div class="message-erreur">⚠️ Entrez un ID.</div>'; return; }
  try {
    const res = await fetch(`${API}/${id}`);
    if (res.status === 404) {
      div.innerHTML = `<div class="message-erreur">❌ Aucun article trouvé avec l'ID #${id}.</div>`;
      return;
    }
    const a = await res.json();
    div.innerHTML = carteArticle(a);
  } catch {
    div.innerHTML = '<div class="message-erreur">Erreur de connexion à l\'API.</div>';
  }
}

// ── MODIFIER ──
async function chargerPourModif() {
  const id  = document.getElementById('modifId').value.trim();
  const msg = document.getElementById('messageModif');
  const form = document.getElementById('formModif');
  if (!id) { msg.innerHTML = '<div class="message-erreur">⚠️ Entrez un ID.</div>'; return; }
  try {
    const res = await fetch(`${API}/${id}`);
    if (res.status === 404) {
      msg.innerHTML = `<div class="message-erreur">❌ Aucun article avec l'ID #${id}.</div>`;
      form.style.display = 'none';
      return;
    }
    const a = await res.json();
    document.getElementById('modifTitre').value    = a.titre;
    document.getElementById('modifCategorie').value = a.categorie;
    document.getElementById('modifTags').value     = a.tags || '';
    document.getElementById('modifContenu').value  = a.contenu;
    form.style.display = 'block';
    msg.innerHTML = `<div class="message-succes" style="margin-bottom:16px;">✦ Article #${a.id} — "${a.titre}" chargé.</div>`;
  } catch {
    msg.innerHTML = '<div class="message-erreur">Erreur de connexion à l\'API.</div>';
  }
}

async function modifierArticle() {
  const id        = document.getElementById('modifId').value.trim();
  const titre     = document.getElementById('modifTitre').value.trim();
  const categorie = document.getElementById('modifCategorie').value.trim();
  const tags      = document.getElementById('modifTags').value.trim();
  const contenu   = document.getElementById('modifContenu').value.trim();
  const msg       = document.getElementById('messageModif');
  if (!titre || !categorie || !contenu) {
    msg.innerHTML = '<div class="message-erreur">⚠️ Titre, catégorie et contenu sont obligatoires.</div>';
    return;
  }
  try {
    const res  = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titre, contenu, categorie, tags })
    });
    const data = await res.json();
    if (res.ok) {
      msg.innerHTML = `<div class="message-succes">✦ Article #${id} modifié avec succès !</div>`;
      document.getElementById('formModif').style.display = 'none';
      document.getElementById('modifId').value = '';
    } else {
      msg.innerHTML = `<div class="message-erreur">❌ ${data.error}</div>`;
    }
  } catch {
    msg.innerHTML = '<div class="message-erreur">Erreur de connexion à l\'API.</div>';
  }
}

// ── SUPPRIMER ──
async function chercherPourSupprimer() {
  const id  = document.getElementById('supprimerId').value.trim();
  const div = document.getElementById('aperçuSupprimer');
  const msg = document.getElementById('messageSupprimer');
  msg.innerHTML = '';
  if (!id) { div.innerHTML = '<div class="message-erreur">⚠️ Entrez un ID.</div>'; return; }
  try {
    const res = await fetch(`${API}/${id}`);
    if (res.status === 404) {
      div.innerHTML = `<div class="message-erreur">❌ Aucun article avec l'ID #${id}.</div>`;
      return;
    }
    const a = await res.json();
    div.innerHTML = carteArticle(a) + `
      <div style="margin-top:16px;">
        <button class="btn btn-danger" style="padding:12px 28px; font-size:14px;"
          onclick="confirmerSuppression(${a.id}, '${a.titre.replace(/'/g,"\\'")}')">
          🗑 Confirmer la suppression de cet article
        </button>
      </div>`;
  } catch {
    div.innerHTML = '<div class="message-erreur">Erreur de connexion à l\'API.</div>';
  }
}

async function confirmerSuppression(id, titre) {
  const msg = document.getElementById('messageSupprimer');
  try {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      document.getElementById('aperçuSupprimer').innerHTML = '';
      document.getElementById('supprimerId').value = '';
      msg.innerHTML = `<div class="message-succes">✦ Article "${titre}" supprimé avec succès.</div>`;
    }
  } catch {
    msg.innerHTML = '<div class="message-erreur">Erreur lors de la suppression.</div>';
  }
}

// ── RECHERCHE TEXTE ──
async function rechercherArticles() {
  const query = document.getElementById('searchQuery').value.trim();
  if (!query) return;
  try {
    const res  = await fetch(`${API}/search?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    afficherArticles(data, 'resultatsRecherche');
  } catch {
    document.getElementById('resultatsRecherche').innerHTML =
      '<div class="message-erreur">Erreur de connexion.</div>';
  }
}

// Démarrage
chargerArticles();