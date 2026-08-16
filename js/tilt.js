/**
 * HARSH BAJPAI — 3D PROJECT CARD TILT ENGINE
 * Mouse-tracked perspective tilt with dynamic specular glare on desktop.
 * Replaced with touch depth & scroll reveal effect on mobile devices.
 */

(function () {
  'use strict';

  const cards = document.querySelectorAll('.project-tilt-card');
  if (!cards.length) return;

  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) return;

  if (!isTouchDevice) {
    // --- DESKTOP: Mouse-Tracked 3D Tilt Transform ---
    cards.forEach(card => {
      const surface = card.querySelector('.tilt-card-surface');
      if (!surface) return;

      let bounds;

      function updateBounds() {
        bounds = card.getBoundingClientRect();
      }

      card.addEventListener('mouseenter', () => {
        updateBounds();
        surface.style.transition = 'transform 0.1s ease-out, box-shadow 0.25s ease-out';
      });

      card.addEventListener('mousemove', (e) => {
        if (!bounds) updateBounds();

        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        // Normalized offsets from center (-0.5 to 0.5)
        const percentX = (mouseX / bounds.width) - 0.5;
        const percentY = (mouseY / bounds.height) - 0.5;

        // Maximum rotation angles
        const maxRotation = 12; // degrees
        const rotateY = percentX * maxRotation;
        const rotateX = -percentY * maxRotation;

        // Specular glare position
        const glareX = `${(mouseX / bounds.width) * 100}%`;
        const glareY = `${(mouseY / bounds.height) * 100}%`;

        surface.style.setProperty('--glare-x', glareX);
        surface.style.setProperty('--glare-y', glareY);

        // Apply 3D perspective matrix transform
        surface.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;
      });

      card.addEventListener('mouseleave', () => {
        surface.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease';
        surface.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  } else {
    // --- MOBILE: Touch Depth & Scroll-Triggered Spatial Elevation ---
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.35
    };

    const mobileObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const surface = entry.target.querySelector('.tilt-card-surface');
        if (!surface) return;

        if (entry.isIntersecting) {
          surface.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease';
          surface.style.borderColor = 'rgba(0, 240, 255, 0.35)';
          surface.style.transform = 'translateY(-4px) scale(1.01)';
        } else {
          surface.style.borderColor = 'var(--border-subtle)';
          surface.style.transform = 'translateY(0) scale(1)';
        }
      });
    }, observerOptions);

    cards.forEach(card => {
      mobileObserver.observe(card);

      // Touch start/end subtle tap reaction
      card.addEventListener('touchstart', () => {
        const surface = card.querySelector('.tilt-card-surface');
        if (surface) {
          surface.style.transform = 'scale(0.985)';
        }
      }, { passive: true });

      card.addEventListener('touchend', () => {
        const surface = card.querySelector('.tilt-card-surface');
        if (surface) {
          surface.style.transform = 'translateY(-4px) scale(1.01)';
        }
      }, { passive: true });
    });
  }
})();
