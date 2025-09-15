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
  });

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