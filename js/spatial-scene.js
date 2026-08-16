/**
 * HARSH BAJPAI — SPATIAL 3D BACKGROUND (THREE.JS)
 * Ambient floating geometric shapes, starry cyber particle field, and mouse parallax.
 * Mobile LOD optimization, battery conservation, and prefers-reduced-motion support.
 */

(function () {
  'use strict';

  // Check if Three.js is loaded
  if (typeof THREE === 'undefined') {
    console.warn('Three.js is not loaded. Spatial background skipped.');
    return;
  }

  const canvas = document.getElementById('spatial-canvas');
  if (!canvas) return;

  // Reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768 || ('ontouchstart' in window);

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  // Deep atmospheric fog
  scene.fog = new THREE.FogExp2(0x070913, 0.0018);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 28;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: !isMobile, // Disable MSAA on mobile for 60fps performance
    powerPreference: 'high-performance'
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  // Cap devicePixelRatio to 1.5 on mobile to prevent GPU thermal throttling
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x1e293b, 1.8);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x00f0ff, 3, 50);
  cyanLight.position.set(15, 12, 10);
  scene.add(cyanLight);

  const violetLight = new THREE.PointLight(0x8b5cf6, 3.5, 60);
  violetLight.position.set(-18, -10, 8);
  scene.add(violetLight);

  const emeraldLight = new THREE.PointLight(0x10b981, 2, 40);
  emeraldLight.position.set(0, 18, -5);
  scene.add(emeraldLight);

  // --- 1. Floating 3D Geometric Objects ---
  const floatingObjects = [];
  const group = new THREE.Group();
  scene.add(group);

  // Shape definitions
  const shapesData = [
    // Main Hero Wireframe Icosahedron
    {
      geometry: isMobile ? new THREE.IcosahedronGeometry(3.5, 0) : new THREE.IcosahedronGeometry(4, 1),
      material: new THREE.MeshPhongMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
        shininess: 90
      }),
      pos: { x: 12, y: 3, z: -2 },
      rotSpeed: { x: 0.003, y: 0.005, z: 0.002 }
    },
    // Core Solid Octahedron inside
    {
      geometry: new THREE.OctahedronGeometry(1.8, 0),
      material: new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        roughness: 0.2,
        metalness: 0.8,
        wireframe: false,
        transparent: true,
        opacity: 0.6
      }),
      pos: { x: 12, y: 3, z: -2 },
      rotSpeed: { x: -0.006, y: -0.004, z: 0.003 }
    },
    // Secondary Torus Knot
    {
      geometry: isMobile ? new THREE.TorusGeometry(2.5, 0.6, 8, 24) : new THREE.TorusKnotGeometry(2.2, 0.6, 64, 12),
      material: new THREE.MeshPhongMaterial({
        color: 0x6366f1,
        wireframe: true,
        transparent: true,
        opacity: 0.25
      }),
      pos: { x: -14, y: 6, z: -8 },
      rotSpeed: { x: 0.004, y: 0.002, z: -0.003 }
    },
    // Deep Floating Tetrahedron
    {
      geometry: new THREE.TetrahedronGeometry(2.5, 0),
      material: new THREE.MeshPhongMaterial({
        color: 0x10b981,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      }),
      pos: { x: -10, y: -12, z: -5 },
      rotSpeed: { x: 0.005, y: -0.003, z: 0.004 }
    },
    // Subtle Dodecahedron
    {
      geometry: new THREE.DodecahedronGeometry(2.8, 0),
      material: new THREE.MeshPhongMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.2
      }),
      pos: { x: 14, y: -14, z: -10 },
      rotSpeed: { x: -0.002, y: 0.004, z: 0.002 }
    }
  ];

  // If mobile, keep only 3 essential shapes to maximize battery life
  const activeShapes = isMobile ? shapesData.slice(0, 3) : shapesData;

  activeShapes.forEach(item => {
    const mesh = new THREE.Mesh(item.geometry, item.material);
    mesh.position.set(item.pos.x, item.pos.y, item.pos.z);
    mesh.userData = {
      basePos: { ...item.pos },
      rotSpeed: item.rotSpeed,
      floatOffset: Math.random() * Math.PI * 2
    };
    group.add(mesh);
    floatingObjects.push(mesh);
  });

  // --- 2. Cyber Starfield Particle Cloud ---
  const particleCount = isMobile ? 160 : 650;
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  const colorCyan = new THREE.Color(0x00f0ff);
  const colorViolet = new THREE.Color(0x8b5cf6);
  const colorWhite = new THREE.Color(0xffffff);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    // Spread in a large volume around camera
    particlePositions[i3] = (Math.random() - 0.5) * 80;
    particlePositions[i3 + 1] = (Math.random() - 0.5) * 70;
    particlePositions[i3 + 2] = (Math.random() - 0.5) * 60;

    // Pick color palette
    const rand = Math.random();
    const chosenColor = rand > 0.6 ? colorCyan : (rand > 0.25 ? colorViolet : colorWhite);
    particleColors[i3] = chosenColor.r;
    particleColors[i3 + 1] = chosenColor.g;
    particleColors[i3 + 2] = chosenColor.b;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  // Particle Material
  const particleMaterial = new THREE.PointsMaterial({
    size: isMobile ? 0.25 : 0.35,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);

  // --- 3. Interactive Mouse Parallax Tracking ---
  const mouse = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  };

  function onMouseMove(e) {
    // Normalized coordinates (-1 to 1)
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  if (!isMobile && !prefersReducedMotion) {
    window.addEventListener('mousemove', onMouseMove, { passive: true });
  }

  // Window Resize Handling
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 150);
  });

  // --- 4. Render Animation Loop ---
  let clock = new THREE.Clock();
  let isPageVisible = true;

  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
  });

  function animate() {
    requestAnimationFrame(animate);

    // Pause heavy computation if tab is hidden
    if (!isPageVisible) return;

    const elapsedTime = clock.getElapsedTime();

    if (!prefersReducedMotion) {
      // Smooth lerp for mouse parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Parallax effect on entire group & camera
      group.rotation.y = mouse.x * 0.25;
      group.rotation.x = -mouse.y * 0.2;

      camera.position.x = mouse.x * 2.5;
      camera.position.y = mouse.y * 2.5;
      camera.lookAt(scene.position);

      // Rotate individual floating objects
      floatingObjects.forEach((obj, idx) => {
        obj.rotation.x += obj.userData.rotSpeed.x;
        obj.rotation.y += obj.userData.rotSpeed.y;
        obj.rotation.z += obj.userData.rotSpeed.z;

        // Subtle vertical floating sine motion
        obj.position.y = obj.userData.basePos.y + Math.sin(elapsedTime * 1.2 + obj.userData.floatOffset) * 0.7;
      });

      // Slowly rotate particle field
      particleSystem.rotation.y = elapsedTime * 0.02 + mouse.x * 0.1;
      particleSystem.rotation.x = elapsedTime * 0.01 - mouse.y * 0.1;
    } else {
      // Static gentle view if reduced motion is preferred
      camera.position.set(0, 0, 28);
      camera.lookAt(scene.position);
    }

    renderer.render(scene, camera);
  }

  animate();
})();
