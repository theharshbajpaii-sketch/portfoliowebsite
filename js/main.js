/**
 * HARSH BAJPAI — PORTFOLIO MAIN CONTROLLER
 * Navigation, sticky header state, mobile drawer, and active section spy.
 */

(function () {
  'use strict';

  // --- 1. Sticky Header & Scroll Effects ---
  const header = document.getElementById('site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Header background blur intensification
    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Active Section Spy for Navigation Highlighting
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // --- 2. Mobile Drawer Navigation ---
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mobileToggle.classList.toggle('open');
      mobileDrawer.classList.toggle('open');
      mobileDrawer.setAttribute('aria-hidden', isExpanded);
    });

    // Close drawer when link clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.classList.remove('open');
        mobileDrawer.classList.remove('open');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      });
    });

    // Close drawer on click outside
    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('open') && 
          !mobileDrawer.contains(e.target) && 
          !mobileToggle.contains(e.target)) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.classList.remove('open');
        mobileDrawer.classList.remove('open');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // --- 3. Dynamic Console Greeting ---
  console.log(
    `%c🚀 Harsh Bajpai — AI & Automation Developer Portfolio\n%cBuilt with Three.js Spatial Engine, Vanilla CSS & Modern JS.`,
    'font-weight: bold; font-size: 14px; color: #00f0ff;',
    'font-size: 12px; color: #8b5cf6;'
  );

})();
