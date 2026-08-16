/**
 * HARSH BAJPAI — WELCOME VIDEO COMPONENT & FALLBACK SYSTEM
 * Autoplay muted loop, unobtrusive sound toggle, intersection observer, and seamless static portrait fallback.
 */

(function () {
  'use strict';

  const video = document.getElementById('welcome-video');
  const fallbackOverlay = document.getElementById('video-fallback');
  const soundToggleBtn = document.getElementById('video-sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  const soundLabel = document.getElementById('sound-label');
  const mediaContainer = document.getElementById('media-container');

  if (!video || !fallbackOverlay) return;

  let isVideoPlaying = false;
  let isManuallyPaused = false;

  // Function to activate static fallback portrait gracefully
  function triggerFallback(reason) {
    console.info(`Video fallback activated (${reason || 'default'}). Displaying static portrait.`);
    fallbackOverlay.classList.add('active');
    video.style.display = 'none';
    if (soundToggleBtn) {
      soundToggleBtn.style.display = 'none';
    }
  }

  // Check for video load errors
  video.addEventListener('error', () => {
    triggerFallback('video source error or missing file');
  }, true);

  // Monitor playback start
  video.addEventListener('playing', () => {
    isVideoPlaying = true;
    fallbackOverlay.classList.remove('active');
    video.style.display = 'block';
  });

  // Autoplay handler with browser policy resilience
  function attemptAutoplay() {
    video.muted = true; // Required by modern browsers for autoplay
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        isVideoPlaying = true;
      }).catch(err => {
        console.warn('Autoplay prevented or video not yet ready:', err);
        // If file not found or actual error, activate fallback
        if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE || video.error) {
          triggerFallback('source unavailable');
        }
      });
    }
  }

  // Safety check: if video source fails completely, fallback gracefully
  video.addEventListener('stalled', () => {
    if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
      triggerFallback('network no source');
    }
  });

  // Sound Toggle Function
  function toggleSound(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!video) return;

    if (video.muted) {
      // Unmute & ensure playback is active
      video.muted = false;
      if (video.paused) {
        video.play().catch(err => console.warn('Playback error on unmute:', err));
      }
      if (soundIcon) soundIcon.className = 'fa-solid fa-volume-high text-cyan';
      if (soundLabel) soundLabel.textContent = 'Mute';
      if (soundToggleBtn) {
        soundToggleBtn.setAttribute('aria-label', 'Mute welcome video');
        soundToggleBtn.classList.add('unmuted');
      }
    } else {
      // Mute
      video.muted = true;
      if (soundIcon) soundIcon.className = 'fa-solid fa-volume-xmark';
      if (soundLabel) soundLabel.textContent = 'Unmute';
      if (soundToggleBtn) {
        soundToggleBtn.setAttribute('aria-label', 'Unmute welcome video');
        soundToggleBtn.classList.remove('unmuted');
      }
    }
  }

  // Bind sound toggle button
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', toggleSound);
  }

  // IntersectionObserver to pause video when scrolled away & resume when back in view
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          if (!video.paused) {
            video.pause();
          }
        } else {
          if (video.paused && !isManuallyPaused) {
            video.play().catch(err => console.warn('Resume playback prevented:', err));
          }
        }
      });
    }, { threshold: 0.2 });

    videoObserver.observe(video);
  }

  // Attempt autoplay immediately
  attemptAutoplay();
})();
