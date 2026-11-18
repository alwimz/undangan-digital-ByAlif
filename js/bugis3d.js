/**
 * ============================================================================
 * ANIMASI BACKGROUND 3D BERTEMA BUGIS-MAKASSAR (THREE.JS)
 * Menampilkan:
 * 1. Monumen 3D Saoraja Timpa Laja' 5 Tingkat Emas Melayang
 * 2. Belah Ketupat Kristal Emas & Zamrud (Motif Lipa' Sabbe Bugis)
 * 3. Cincin Mandala Ukiran Emas Khas Geno Ma'bule
 * 4. Partikel Serpihan Emas Baju Bodo & Kelopak Bunga Melati 3D
 * 5. Efek Interaktif Parallax Kursor & Scroll Halaman
 * ============================================================================
 */

(function () {
  'use strict';

  // Pastikan Three.js tersedia
  if (typeof THREE === 'undefined') {
    console.warn('Three.js belum dimuat. Background 3D dilewati.');
    return;
  }

  const canvas = document.getElementById('bugis3dCanvas');
  if (!canvas) return;

  // 1. Inisialisasi Renderer, Scene, Camera
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x1a0205, 0.0018);

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(0, 0, 320);

  // 2. Pencahayaan Megah Bernuansa Emas & Merah Beludru Adat
  const ambientLight = new THREE.AmbientLight(0x7a1020, 0.85);
  scene.add(ambientLight);

  // Cahaya Emas Utama (Key Gold Light)
  const goldLight = new THREE.PointLight(0xffdf78, 2.4, 800);
  goldLight.position.set(80, 120, 180);
  scene.add(goldLight);

  // Cahaya Zamrud & Rose Pengisi (Fill Lights)
  const roseLight = new THREE.PointLight(0xbe123c, 1.8, 700);
  roseLight.position.set(-100, -80, 100);
  scene.add(roseLight);

  const emeraldLight = new THREE.PointLight(0x10b981, 0.9, 600);
  emeraldLight.position.set(0, -150, 120);
  scene.add(emeraldLight);

  // Directional Light untuk kemilau tepi (Specular Rim Light)
  const dirLight = new THREE.DirectionalLight(0xfff7c2, 1.2);
  dirLight.position.set(0, 200, 100);
  scene.add(dirLight);

  // Material Berstandar Emas Kemilau Bugis
  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.28,
    metalness: 0.92,
    envMapIntensity: 1.5
  });

  const goldWireMaterial = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
    wireframe: true,
    transparent: true,
    opacity: 0.55
  });

  const velvetRubyMaterial = new THREE.MeshStandardMaterial({
    color: 0x800a16,
    roughness: 0.35,
    metalness: 0.75
  });

  const emeraldMaterial = new THREE.MeshStandardMaterial({
    color: 0x065f46,
    roughness: 0.3,
    metalness: 0.85
  });

  // Grup Utama Seluruh Objek 3D
  const worldGroup = new THREE.Group();
  scene.add(worldGroup);

  // ==========================================================================
  // 3. OBJEK 1: MONUMEN 3D SAORAJA TIMPA LAJA' (BUBUNGAN RUMAH ADAT BUGIS)
  // ==========================================================================
  const saorajaGroup = new THREE.Group();

  // 5 Tingkat Kehormatan Adat Saoraja (Tingkat Segitiga Prisma 3D)
  const tierCount = 5;
  const tiers = [];

  for (let i = 0; i < tierCount; i++) {
    const scale = 1 + i * 0.45;
    const width = 18 * scale;
    const height = 9 * scale;
    const depth = 12 * scale;

    // Bentuk Prisma Segitiga (Prismatic Gable)
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, -height / 2);
    shape.lineTo(width / 2, -height / 2);
    shape.lineTo(0, height / 2);
    shape.closePath();

    const extrudeSettings = {
      depth: depth,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.8,
      bevelThickness: 0.8
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();

    // Paduan Mesh Solid Beludru Marun + Garis Tepi Emas Kemilau
    const mesh = new THREE.Mesh(geom, i % 2 === 0 ? velvetRubyMaterial : goldMaterial);
    const wire = new THREE.Mesh(geom, goldWireMaterial);

    const tierGroup = new THREE.Group();
    tierGroup.add(mesh);
    tierGroup.add(wire);

    tierGroup.position.y = (tierCount - i) * 11 - 10;
    tierGroup.position.z = -15 + i * 4;
    saorajaGroup.add(tierGroup);
    tiers.push(tierGroup);
  }

  // Mahkota Puncak Saoraja (Mustaka Emas)
  const crownGeom = new THREE.ConeGeometry(5, 14, 5);
  const crownMesh = new THREE.Mesh(crownGeom, goldMaterial);
  crownMesh.position.y = (tierCount + 1) * 11 - 5;
  saorajaGroup.add(crownMesh);

  // Tanduk Sayap Ukiran Khas (Anjong Saoraja Kiri & Kanan)
  const hornCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(25, 20, 0),
    new THREE.Vector3(45, 10, 5),
    new THREE.Vector3(60, 35, 10)
  );
  const hornGeom = new THREE.TubeGeometry(hornCurve, 20, 1.8, 8, false);

  const leftHorn = new THREE.Mesh(hornGeom, goldMaterial);
  leftHorn.scale.set(0.65, 0.65, 0.65);
  leftHorn.position.set(-8, 30, 0);
  saorajaGroup.add(leftHorn);

  const rightHorn = leftHorn.clone();
  rightHorn.scale.set(-0.65, 0.65, 0.65);
  rightHorn.position.set(8, 30, 0);
  saorajaGroup.add(rightHorn);

  // Posisi Saoraja mengapung di latar belakang tengah agak ke atas
  saorajaGroup.position.set(0, 25, -60);
  saorajaGroup.scale.set(0.95, 0.95, 0.95);
  worldGroup.add(saorajaGroup);

  // ==========================================================================
  // 4. OBJEK 2: BELAH KETUPAT SUTERA BUGIS 3D (LIPA' SABBE LAGOSI GEMS)
  // ==========================================================================
  const gemsGroup = new THREE.Group();
  const gemList = [];
  const gemCount = 22;

  // Bentuk Oktahedron (Belah Ketupat 3D Kemilau)
  const diamondGeom = new THREE.OctahedronGeometry(6, 0);

  for (let i = 0; i < gemCount; i++) {
    let mat = goldMaterial;
    if (i % 3 === 1) mat = velvetRubyMaterial;
    if (i % 3 === 2) mat = emeraldMaterial;

    const gem = new THREE.Mesh(diamondGeom, mat);
    const gemWire = new THREE.Mesh(diamondGeom, goldWireMaterial);
    gem.add(gemWire);

    // Sebar melingkar di ruang 3D
    const angle = (i / gemCount) * Math.PI * 2;
    const radius = 110 + Math.random() * 90;
    const x = Math.cos(angle) * radius;
    const y = (Math.random() - 0.5) * 220;
    const z = Math.sin(angle) * radius - 30;

    gem.position.set(x, y, z);

    const s = 0.8 + Math.random() * 1.3;
    gem.scale.set(s, s * 1.6, s); // Agak lonjong khas belah ketupat Bugis

    gem.userData = {
      rotX: (Math.random() - 0.5) * 0.02,
      rotY: (Math.random() - 0.5) * 0.025,
      rotZ: (Math.random() - 0.5) * 0.015,
      floatSpeed: 0.8 + Math.random() * 1.2,
      floatOffset: Math.random() * Math.PI * 2,
      initialY: y
    };

    gemsGroup.add(gem);
    gemList.push(gem);
  }
  worldGroup.add(gemsGroup);

  // ==========================================================================
  // 5. OBJEK 3: CINCIN MANDALA UKIRAN EMAS (GENO MA'BULE & SALOKO RINGS)
  // ==========================================================================
  const ringsGroup = new THREE.Group();

  function createOrnamentRing(radius, tubeRadius, segments, colorHex) {
    const ringGeom = new THREE.TorusGeometry(radius, tubeRadius, 8, segments);
    const ringMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      metalness: 0.9,
      roughness: 0.25,
      wireframe: true
    });
    return new THREE.Mesh(ringGeom, ringMat);
  }

  const ring1 = createOrnamentRing(125, 1.2, 48, 0xd4af37);
  const ring2 = createOrnamentRing(95, 0.9, 36, 0xfcf6ba);
  const ring3 = createOrnamentRing(155, 0.7, 54, 0xaa771c);

  ring1.rotation.x = Math.PI * 0.35;
  ring2.rotation.x = Math.PI * 0.45;
  ring3.rotation.x = Math.PI * 0.25;

  ringsGroup.add(ring1);
  ringsGroup.add(ring2);
  ringsGroup.add(ring3);
  ringsGroup.position.set(0, 15, -70);
  worldGroup.add(ringsGroup);

  // ==========================================================================
  // 6. OBJEK 4: BADAI KEMILAU PARTIKEL SERPIHAN EMAS & KELOPAK MELATI 3D
  // ==========================================================================
  // Partikel Emas Kemilau (Gold Dust Sequins)
  const goldParticleCount = 420;
  const goldGeom = new THREE.BufferGeometry();
  const goldPositions = new Float32Array(goldParticleCount * 3);
  const goldScales = new Float32Array(goldParticleCount);
  const goldVelocities = [];

  for (let i = 0; i < goldParticleCount; i++) {
    goldPositions[i * 3] = (Math.random() - 0.5) * 450;
    goldPositions[i * 3 + 1] = (Math.random() - 0.5) * 450;
    goldPositions[i * 3 + 2] = (Math.random() - 0.5) * 350;

    goldScales[i] = Math.random() * 3 + 1.5;

    goldVelocities.push({
      vy: -(Math.random() * 0.35 + 0.15),
      vx: (Math.random() - 0.5) * 0.2,
      vz: (Math.random() - 0.5) * 0.15,
      sway: Math.random() * Math.PI * 2
    });
  }

  goldGeom.setAttribute('position', new THREE.BufferAttribute(goldPositions, 3));

  // Tekstur bulat bercahaya untuk serpihan emas
  function createParticleTexture(isPetal = false) {
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const ctx = pCanvas.getContext('2d');

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    if (!isPetal) {
      // Emas berkilau
      grad.addColorStop(0, 'rgba(255, 255, 230, 1)');
      grad.addColorStop(0.3, 'rgba(252, 246, 186, 0.9)');
      grad.addColorStop(0.65, 'rgba(212, 175, 55, 0.55)');
      grad.addColorStop(1, 'rgba(170, 119, 28, 0)');
    } else {
      // Kelopak Melati Pengantin Putih Lembut
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      grad.addColorStop(0.4, 'rgba(254, 243, 199, 0.7)');
      grad.addColorStop(0.8, 'rgba(252, 231, 243, 0.3)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(pCanvas);
  }

  const goldMat = new THREE.PointsMaterial({
    size: 4.8,
    map: createParticleTexture(false),
    transparent: true,
    opacity: 0.82,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const goldParticles = new THREE.Points(goldGeom, goldMat);
  worldGroup.add(goldParticles);

  // Kelopak Bunga Melati Melayang 3D (Jasmine Petals)
  const petalCount = 140;
  const petalGeom = new THREE.BufferGeometry();
  const petalPositions = new Float32Array(petalCount * 3);
  const petalVelocities = [];

  for (let i = 0; i < petalCount; i++) {
    petalPositions[i * 3] = (Math.random() - 0.5) * 400;
    petalPositions[i * 3 + 1] = (Math.random() - 0.5) * 400;
    petalPositions[i * 3 + 2] = (Math.random() - 0.5) * 250;

    petalVelocities.push({
      vy: -(Math.random() * 0.45 + 0.2),
      vx: (Math.random() - 0.5) * 0.3,
      vz: (Math.random() - 0.5) * 0.2,
      sway: Math.random() * Math.PI * 2
    });
  }

  petalGeom.setAttribute('position', new THREE.BufferAttribute(petalPositions, 3));

  const petalMat = new THREE.PointsMaterial({
    size: 7.5,
    map: createParticleTexture(true),
    transparent: true,
    opacity: 0.65,
    blending: THREE.NormalBlending,
    depthWrite: false
  });

  const petalParticles = new THREE.Points(petalGeom, petalMat);
  worldGroup.add(petalParticles);

  // ==========================================================================
  // 7. INTERAKSI: PARALLAX MOUSE & SCROLL POSITION
  // ==========================================================================
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  let scrollY = 0;
  let targetScrollY = 0;

  window.addEventListener('mousemove', function (e) {
    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;
    targetMouseX = (e.clientX - halfW) / halfW;
    targetMouseY = (e.clientY - halfH) / halfH;
  });

  window.addEventListener('touchmove', function (e) {
    if (e.touches.length > 0) {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      targetMouseX = (e.touches[0].clientX - halfW) / halfW;
      targetMouseY = (e.touches[0].clientY - halfH) / halfH;
    }
  }, { passive: true });

  window.addEventListener('scroll', function () {
    targetScrollY = window.pageYOffset || document.documentElement.scrollTop;
  }, { passive: true });

  // Responsive Resize
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // ==========================================================================
  // 8. RENDER LOOP (60 FPS)
  // ==========================================================================
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth Lerp untuk Kursor & Scroll
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;
    scrollY += (targetScrollY - scrollY) * 0.06;

    // 1. Gerakan Saoraja Timpa Laja' (Melayang Anggun)
    saorajaGroup.position.y = 25 + Math.sin(elapsedTime * 0.8) * 6;
    saorajaGroup.rotation.y = Math.sin(elapsedTime * 0.3) * 0.12 + mouseX * 0.2;
    saorajaGroup.rotation.x = Math.cos(elapsedTime * 0.4) * 0.06 - mouseY * 0.15;

    // Denyut halus tiap tingkat Saoraja
    tiers.forEach((t, idx) => {
      t.rotation.y = Math.sin(elapsedTime * 0.6 + idx * 0.4) * 0.04;
    });

    // 2. Rotasi Cincin Mandala Ukiran Emas
    ring1.rotation.z += 0.0035;
    ring2.rotation.z -= 0.0045;
    ring3.rotation.z += 0.002;

    // 3. Gerakan Belah Ketupat Emas & Zamrud (Lipa' Sabbe)
    gemList.forEach(gem => {
      gem.rotation.x += gem.userData.rotX;
      gem.rotation.y += gem.userData.rotY;
      gem.rotation.z += gem.userData.rotZ;

      gem.position.y =
        gem.userData.initialY +
        Math.sin(elapsedTime * gem.userData.floatSpeed + gem.userData.floatOffset) * 12;
    });
    gemsGroup.rotation.y = elapsedTime * 0.035;

    // 4. Update Partikel Emas 3D
    const gPos = goldGeom.attributes.position.array;
    for (let i = 0; i < goldParticleCount; i++) {
      const v = goldVelocities[i];
      gPos[i * 3 + 1] += v.vy;
      gPos[i * 3] += Math.sin(elapsedTime + v.sway) * 0.25 + v.vx;
      gPos[i * 3 + 2] += v.vz;

      // Reset jika jatuh melewati batas bawah
      if (gPos[i * 3 + 1] < -220) {
        gPos[i * 3 + 1] = 220;
        gPos[i * 3] = (Math.random() - 0.5) * 450;
      }
    }
    goldGeom.attributes.position.needsUpdate = true;

    // 5. Update Kelopak Melati 3D
    const pPos = petalGeom.attributes.position.array;
    for (let i = 0; i < petalCount; i++) {
      const v = petalVelocities[i];
      pPos[i * 3 + 1] += v.vy;
      pPos[i * 3] += Math.sin(elapsedTime * 0.8 + v.sway) * 0.35 + v.vx;
      pPos[i * 3 + 2] += v.vz;

      if (pPos[i * 3 + 1] < -220) {
        pPos[i * 3 + 1] = 220;
        pPos[i * 3] = (Math.random() - 0.5) * 400;
      }
    }
    petalGeom.attributes.position.needsUpdate = true;

    // 6. Gerakan Cahaya Dinamis (Orbiting Lights)
    goldLight.position.x = Math.sin(elapsedTime * 0.7) * 160;
    goldLight.position.y = Math.cos(elapsedTime * 0.5) * 120 + 20;

    // 7. Kamera Parallax (Mouse & Page Scroll)
    const scrollFactor = scrollY * 0.08;
    camera.position.x = mouseX * 28;
    camera.position.y = -mouseY * 20 - (scrollFactor % 180) + 15;
    camera.position.z = 320 + Math.sin(scrollFactor * 0.02) * 25;
    camera.lookAt(0, -scrollY * 0.03, -40);

    renderer.render(scene, camera);
  }

  animate();
})();
