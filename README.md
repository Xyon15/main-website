# Portfolio personnel - Lorenzo Pereira

Ce projet est un site web portfolio responsive mettant en valeur mes compétences et projets en développement web.

## Description

Ce site web est conçu comme une vitrine de présentation professionnelle avec un design moderne et interactif. Il respecte les standards d'accessibilité et offre une expérience utilisateur optimisée tant sur ordinateur que sur appareils mobiles.

## Technologies utilisées

- HTML5
- CSS3 (avec variables CSS, animations et media queries)
- JavaScript
- [Particles.js](https://vincentgarreau.com/particles.js/) pour le fond animé
- Polices Google Fonts (Inter)

## Fonctionnalités

- **Navigation fluide** - Défilement doux vers les sections avec animations
- **Fond animé** - Effet de particules interactif 
- **Thème visuel** - Dégradés et animations subtiles pour une interface moderne
- **Dropdown de contact** - Menu déroulant pour les coordonnées
- **Animation de projets** - Affichage dynamique de mes projets GitHub
- **Optimisations de performance** - Chargement différé, fallbacks et gestion des erreurs

## Structure du projet

```
main-website/
├── index.html           # Structure HTML principale
├── assets/
│   ├── script.js        # Scripts JavaScript
│   ├── styles.css       # Feuilles de style CSS
│   └── images/          # Dossier pour les images (si ajoutées)
└── README.md            # Documentation du projet
```

## Installation et utilisation

1. Cloner le dépôt:
	 ```
	 git clone https://github.com/Xyon15/main-website.git
	 ```

2. Ouvrir le fichier [`index.html`](index.html ) dans votre navigateur

## Personnalisation

### Modifier les couleurs du thème

Les variables CSS dans [`assets/styles.css`](assets/styles.css ) permettent de modifier facilement les couleurs:

```css
:root {
	--bg: #0b1020;
	--text: #e6e8ee;
	--muted: #9aa3b2;
	--card: #121a33;
	--accent: #7c3aed;
	--gradient-from: #7c3aed;
	--gradient-to: #06b6d4;
	/* ... */
}
```

### Ajouter des projets

Pour ajouter un nouveau projet, ajoutez une carte dans la section "Projets" dans [`index.html`](index.html ):

```html
<article class="card">
	<div class="card-body">
		<h3>Nom du projet</h3>
		<p>Description du projet.</p>
		<div class="card-actions">
			<a class="btn small ghost" href="lien-vers-code" target="_blank" rel="noopener">Code</a>
		</div>
	</div>
</article>
```

## Auteur

Développé par Lorenzo Pereira (Xyon15)

---

© 2025 Xyon