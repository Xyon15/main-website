// Met à jour l'année du footer et l'âge dynamique
(function () {
  // Configuration des particules (déclarée en premier pour être accessible partout)
  function setupParticles() {
    // Vérifier que l'élément particles-js existe
    const particlesContainer = document.getElementById('particles-js');
    if (!particlesContainer) {
      console.warn('Element particles-js not found');
      return false;
    }
    
    // Vérifier que la bibliothèque particles.js est chargée
    if (!window.particlesJS) {
      console.warn('particlesJS library not loaded');
      return false;
    }

    try {
      // Nettoyer le conteneur avant initialisation
      particlesContainer.innerHTML = '';
      
      // Réduire le nombre de particules sur mobile pour les performances
      const isMobile = window.innerWidth <= 768;
      const particleCount = isMobile ? 15 : 30;
      
      particlesJS('particles-js', {
        particles: {
          number: { value: particleCount, density: { enable: true, value_area: 600 } },
          color: { value: "#9aa3b2" },
          opacity: { value: isMobile ? 0.2 : 0.3, random: false },
          size: { value: 4, random: true },
          line_linked: { 
            enable: true, 
            distance: isMobile ? 120 : 150, 
            color: "#6b7280", 
            opacity: isMobile ? 0.15 : 0.2, 
            width: 1 
          },
          move: { 
            enable: true, 
            speed: isMobile ? 0.5 : 1, 
            direction: "none", 
            random: true, 
            out_mode: "out" 
          }
        },
        interactivity: { 
          detect_on: "canvas", 
          events: { 
            onhover: { enable: !isMobile, mode: "grab" } 
          } 
        }
      });
      
      console.log('Particles.js initialized successfully');
      return true;
      
    } catch (error) {
      console.error('Error initializing particles:', error);
      return false;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // Mettre à jour l'âge dynamiquement
    updateAge();

    // Configuration du dropdown de contact
    setupContactDropdown();

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
        // Ajuster la durée d'animation selon le nombre de projets
        const totalDuration = projectNames.length * 2;
        name.style.animation = `scroll-up ${totalDuration}s infinite`;
        name.style.animationDelay = `${index * 2}s`;
      });
      
      console.log('✅ Animation initialisée');
    } else {
      console.error('❌ Conteneur project-scroller non trouvé');
    }

    // Attendre que particles.js soit prêt avant d'initialiser
    function waitForParticlesAndInit() {
      if (window.particlesJSReady || window.particlesJS) {
        console.log('Initializing particles...');
        setupParticles();
      } else {
        console.log('Waiting for particles.js...');
        setTimeout(waitForParticlesAndInit, 100);
      }
    }
    
    waitForParticlesAndInit();
    
    // Animation au scroll
    setupScrollAnimations();
    
    // Animations pour les clics sur les liens de navigation
    setupNavigationAnimations();
    
    // Gestion des changements d'orientation et de taille d'écran
    setupResponsiveHandlers();
    
    // Initialisation différée des particules si la première tentative échoue
    setTimeout(() => {
      if (!window.pJSDom || !window.pJSDom[0]) {
        console.log('Retry particles initialization...');
        setupParticles();
      }
    }, 2000);
    
    // Initialisation encore plus différée en cas de problème persistant
    setTimeout(() => {
      if (!window.pJSDom || !window.pJSDom[0]) {
        console.log('Final retry particles initialization...');
        if (setupParticles()) {
          console.log('Particles finally initialized successfully');
        } else {
          console.log('Particles initialization failed - site will work without particles');
        }
      }
    }, 5000);
  });

  // Fonction pour gérer les animations de navigation
  function setupNavigationAnimations() {
    // Sélectionner TOUS les liens internes qui pointent vers des sections (pas seulement ceux de la nav)
    const internalLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    internalLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Animation du lien cliqué (seulement sur desktop)
          if (window.innerWidth > 768) {
            animateClickedLink(this);
          }
          
          // Scroll animé vers la section
          smoothScrollToSection(targetElement);
          
          // Animation de la section cible (seulement sur desktop)
          if (window.innerWidth > 768) {
            animateTargetSection(targetElement);
          }
          
          // Fermer le dropdown de contact s'il est ouvert
          const contactDropdown = document.querySelector('.contact-dropdown');
          if (contactDropdown) {
            contactDropdown.classList.remove('active');
          }
        }
      });
    });
  }

  // Animation du lien cliqué
  function animateClickedLink(link) {
    // Effet de pulsation
    link.style.transform = 'scale(1.1)';
    link.style.background = 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2))';
    
    setTimeout(() => {
      link.style.transform = '';
      link.style.background = '';
    }, 200);
  }

  // Scroll fluide vers la section
  function smoothScrollToSection(targetElement) {
    const headerHeight = document.querySelector('.site-header').offsetHeight;
    const targetPosition = targetElement.offsetTop - headerHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  // Animation de la section cible
  function animateTargetSection(targetElement) {
    // Ajouter une classe temporaire pour l'effet de surbrillance
    targetElement.classList.add('section-highlight');
    
    // Effet de surbrillance temporaire
    targetElement.style.transition = 'all 0.6s ease';
    targetElement.style.background = 'linear-gradient(135deg, rgba(124,58,237,0.05), rgba(6,182,212,0.03))';
    
    setTimeout(() => {
      targetElement.style.background = '';
      targetElement.classList.remove('section-highlight');
    }, 1500);
  }

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

  // Fonction pour calculer et mettre à jour l'âge dynamiquement
  function updateAge() {
    const birthDate = new Date(2009, 2, 22); // 22 mars 2009 (mois 0-indexé)
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Si on n'a pas encore atteint l'anniversaire cette année
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    const ageEl = document.getElementById('age');
    if (ageEl) {
      ageEl.textContent = String(age);
    }
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

  // Configuration du dropdown de contact
  function setupContactDropdown() {
    const dropdown = document.querySelector('.contact-dropdown');
    const button = document.getElementById('contactButton');
    const menu = document.getElementById('contactMenu');

    if (!dropdown || !button || !menu) return;

    // Toggle du dropdown
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle('active');
    });

    // Fermer le dropdown en cliquant ailleurs
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdown.classList.remove('active');
      }
    });

    // Gestion tactile pour mobile
    if ('ontouchstart' in window) {
      document.addEventListener('touchstart', (e) => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('active');
        }
      });
    }

    // Animation des éléments du menu
    const items = menu.querySelectorAll('.dropdown-item');
    items.forEach((item, index) => {
      item.style.transitionDelay = `${index * 50}ms`;
    });
  }
  
  // Gestion des changements d'orientation et responsive
  function setupResponsiveHandlers() {
    let resizeTimeout;
    
    function handleResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Réinitialiser les particules avec les nouveaux paramètres
        if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
          try {
            window.pJSDom[0].pJS.fn.vendors.destroypJS();
            document.getElementById('particles-js').innerHTML = '';
            console.log('Particles destroyed, reinitializing...');
          } catch (error) {
            console.warn('Error destroying particles:', error);
          }
        }
        
        // Réinitialiser les particules
        setupParticles();
        
        // Fermer le dropdown de contact si ouvert
        const contactDropdown = document.querySelector('.contact-dropdown');
        if (contactDropdown) {
          contactDropdown.classList.remove('active');
        }
      }, 200);
    }
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      setTimeout(handleResize, 100);
    });
  }
})();