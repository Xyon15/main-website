// Met à jour l'année du footer et applique le thème fixe
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // Thème forcé: couleurs fixes
    applyTheme({ from: '#7c3aed', to: '#06b6d4', accent: '#7c3aed', theme: '#0b1020' });
    
    // Debug: Vérifier que l'animation des projets fonctionne
    console.log('🔍 Vérification de l\'animation...');
    const projectScroller = document.querySelector('.project-scroller');
    const projectNames = document.querySelectorAll('.project-name');
    
    if (projectScroller) {
      console.log('✅ Conteneur project-scroller trouvé');
      console.log('📊 Nombre de projets:', projectNames.length);
      
      // Forcer le style en cas de problème CSS
      projectScroller.style.position = 'relative';
      projectScroller.style.overflow = 'hidden';
      projectScroller.style.height = '1.2em';
      projectScroller.style.width = '150px';
      
      projectNames.forEach((name, index) => {
        console.log(`🏷️ Projet ${index + 1}: ${name.textContent}`);
        // Forcer les styles d'animation si nécessaire
        name.style.position = 'absolute';
        name.style.top = '0';
        name.style.left = '0';
        name.style.width = '100%';
        name.style.animation = `scroll-up 8s infinite`;
        name.style.animationDelay = `${index * 2}s`;
      });
      
      console.log('✅ Animation initialisée');
    } else {
      console.error('❌ Conteneur project-scroller non trouvé');
    }

    // Configuration des particules
    function setupParticles() {
      if (window.particlesJS) {
        particlesJS('particles-js', {
          particles: {
            number: { value: 30, density: { enable: true, value_area: 800 } },
            color: { value: "#9aa3b2" },
            opacity: { value: 0.3, random: false },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#6b7280", opacity: 0.2, width: 1 },
            move: { enable: true, speed: 1, direction: "none", random: true, out_mode: "out" }
          },
          interactivity: { detect_on: "canvas", events: { onhover: { enable: true, mode: "grab" } } }
        });
      }
    }

    setupParticles();
    
    // Animation au scroll
    setupScrollAnimations();
  });

  // Fonction pour gérer les animations au scroll
  function setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observer tous les éléments avec la classe fade-in-section
    const fadeElements = document.querySelectorAll('.fade-in-section');
    fadeElements.forEach(el => observer.observe(el));

    // Animation séquentielle des cartes de projets
    const cards = document.querySelectorAll('.card');
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, observerOptions);

    cards.forEach(card => {
      card.style.animationPlayState = 'paused';
      cardObserver.observe(card);
    });
  }

  function applyTheme({ from, to, accent, theme }) {
    const root = document.documentElement;
    if (from) root.style.setProperty('--gradient-from', from);
    if (to) root.style.setProperty('--gradient-to', to);
    if (accent) root.style.setProperty('--accent', accent);

    // Définir meta theme-color pour les navigateurs mobiles
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && theme) meta.setAttribute('content', theme);
  }
})();