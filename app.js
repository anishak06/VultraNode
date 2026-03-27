// Setup Scene, Camera, and Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Wait, purely black background is set in CSS, we can use null so it's transparent, but setting it explicitly works too. Let's make it null so CSS gradient shows. Wait, I'll set renderer alpha to true.
scene.background = null; 

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 20;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// --- 3D VULTRA NODE LOGO / CRYPTO COIN ---
const logoGroup = new THREE.Group();
scene.add(logoGroup);

// --- 1. Central Crypto Coin ---
const coinGroup = new THREE.Group();

// Coin basic cylinder body (stands up flat)
const coinGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.3, 32);
const coinMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
const coinMesh = new THREE.Mesh(coinGeo, coinMat);
coinMesh.rotation.x = Math.PI / 2; // Stand the coin up facing the camera
coinGroup.add(coinMesh);

// Coin glowing teal edges
const coinEdgesGeo = new THREE.EdgesGeometry(coinGeo);
const coinEdgesMat = new THREE.LineBasicMaterial({
    color: 0x00E5D4,
    linewidth: 2,
    transparent: true,
    opacity: 1.0
});
const coinEdgesMesh = new THREE.LineSegments(coinEdgesGeo, coinEdgesMat);
coinEdgesMesh.rotation.x = Math.PI / 2;
coinGroup.add(coinEdgesMesh);

// "VN" Text on the coin faces using Canvas Texture
const coinCanvas = document.createElement('canvas');
coinCanvas.width = 256;
coinCanvas.height = 256;
const coinCtx = coinCanvas.getContext('2d');
coinCtx.textAlign = 'center';
coinCtx.textBaseline = 'middle';
coinCtx.shadowColor = '#009C91';
coinCtx.shadowBlur = 25;
coinCtx.fillStyle = '#00E5D4';
coinCtx.font = 'bold 150px "Space Grotesk", sans-serif';
coinCtx.fillText('VN', 128, 128); // "VN" Node Impression

const coinTexture = new THREE.CanvasTexture(coinCanvas);
coinTexture.minFilter = THREE.LinearFilter;

// Texture mapped to a plane so it sticks perfectly to the 3D coin face when rotating
const textPlaneGeo = new THREE.PlaneGeometry(3.0, 3.0);

// Front Face
const coinTextMatFront = new THREE.MeshBasicMaterial({ map: coinTexture, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
const coinTextFront = new THREE.Mesh(textPlaneGeo, coinTextMatFront);
coinTextFront.position.z = 0.16; // Pop off face slightly to avoid z-fighting
coinGroup.add(coinTextFront);

// Back Face (rotated 180 degrees so it faces outwards backwards)
const coinTextMatBack = new THREE.MeshBasicMaterial({ map: coinTexture, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
const coinTextBack = new THREE.Mesh(textPlaneGeo, coinTextMatBack);
coinTextBack.rotation.y = Math.PI;
coinTextBack.position.z = -0.16;
coinGroup.add(coinTextBack);

logoGroup.add(coinGroup);

// --- 2. Outer Node Shells (Wireframes to surround the coin) ---
const nodeShellGeo = new THREE.IcosahedronGeometry(3.0, 1);

// Inner complex wireframe for depth (surrounds the coin)
const innerMat = new THREE.MeshBasicMaterial({ 
    color: 0x00E5D4, // Brighter neon teal to stand out
    wireframe: true, 
    transparent: true, 
    opacity: 0.5, // Bolder opacity
    blending: THREE.AdditiveBlending 
});
const innerMesh = new THREE.Mesh(nodeShellGeo, innerMat);
logoGroup.add(innerMesh);

// Glowing Teal Edges (Larger boundary)
const outerGeo = new THREE.IcosahedronGeometry(3.5, 0);
const edgesGeo = new THREE.EdgesGeometry(outerGeo);
const edgesMat = new THREE.LineBasicMaterial({ 
    color: 0x00E5D4, 
    linewidth: 3, 
    transparent: true, 
    opacity: 1.0 // Fully opaque for maximum boldness
});
const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
logoGroup.add(edgesMesh);

// Adding slight sub-layers to artificially "bold" the lines in WebGL
const edgesMesh2 = new THREE.LineSegments(edgesGeo, edgesMat);
edgesMesh2.scale.set(1.008, 1.008, 1.008);
logoGroup.add(edgesMesh2);

const edgesMesh3 = new THREE.LineSegments(edgesGeo, edgesMat);
edgesMesh3.scale.set(0.992, 0.992, 0.992);
logoGroup.add(edgesMesh3);

// --- ORBITING CRYPTO SYMBOLS ---
const numbersGroup = new THREE.Group();
scene.add(numbersGroup);
const sprites = [];

const cryptoSymbols = ['₿', 'Ξ', 'Ł', '₮', 'Ð', '◈', '⟠', 'ADA', 'SOL', 'XRP', 'UNI', 'LINK', 'AAVE'];

// Create 100 crypto sprites
for(let i = 0; i < 100; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // Randomize symbol selection
    const symbol = cryptoSymbols[Math.floor(Math.random() * cryptoSymbols.length)];
    
    // Setup text styling with a heavier glow
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#00E5D4'; // Brighter neon glow
    ctx.shadowBlur = 25; // Bigger blur
    ctx.fillStyle = '#00E5D4';
    
    // Stroke layer for bolding in WebGL Canvas
    ctx.strokeStyle = '#00E5D4';
    ctx.lineWidth = 2; 
    
    // Scale text dynamically depending on the string length
    if(symbol.length > 1) {
        ctx.font = '900 40px "Space Grotesk", sans-serif';
    } else {
        ctx.font = '900 64px "Space Grotesk", sans-serif';
    }
    
    // Fill and stroke for maximum visual boldness
    ctx.fillText(symbol, 64, 64);
    ctx.strokeText(symbol, 64, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    
    const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: Math.random() * 0.5 + 0.3
    });
    
    const sprite = new THREE.Sprite(spriteMat);
    
    // Random orbital setup - spherical distribution
    const radius = 6 + Math.random() * 8; // Distance from center
    const theta = Math.random() * Math.PI * 2; // Angle around Y axis
    const phi = (Math.random() - 0.5) * 1.5; // Vertical spread angle
    
    // Map to 3D cartesian coordinates
    sprite.position.x = radius * Math.cos(theta) * Math.cos(phi);
    sprite.position.y = radius * Math.sin(phi);
    sprite.position.z = radius * Math.sin(theta) * Math.cos(phi);
    
    // Slightly randomize size to create depth
    const scale = 0.8 + Math.random() * 0.6;
    sprite.scale.set(scale, scale, 1);
    
    // Store animated variables locally
    sprite.userData = {
        radius: radius,
        angle: theta,
        phi: phi,
        speed: (Math.random() * 0.005) + 0.002 * (Math.random() > 0.5 ? 1 : -1), // Random directional speed
        baseY: sprite.position.y,
        bobSpeed: Math.random() * 0.02 + 0.01,
        bobOffset: Math.random() * Math.PI * 2
    };
    
    sprites.push(sprite);
    numbersGroup.add(sprite);
}

// --- MOUSE PARALLAX & RAYCASTER INTERACTION ---
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const baseScale = new THREE.Vector3(1, 1, 1);
const hoverScale = new THREE.Vector3(1.4, 1.4, 1.4);

document.addEventListener('mousemove', (event) => {
    // Normalize coordinates for camera parallax
    mouseX = (event.clientX - window.innerWidth / 2) * 0.003;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.003;
    
    // Normalize coordinates for exact 3D Raycasting (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // 1. Raycaster Logo Hover & Rotation Logic
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(logoGroup.children, true);
    
    if (intersects.length > 0) {
        // Enlarge explicitly and accurately follow mouse trace
        logoGroup.scale.lerp(hoverScale, 0.1);
        document.body.style.cursor = 'pointer';
        
        logoGroup.rotation.y += mouseX * 0.1;
        logoGroup.rotation.x += mouseY * 0.1;
    } else {
        // Normal rotating state
        logoGroup.scale.lerp(baseScale, 0.1);
        document.body.style.cursor = 'default';
        
        logoGroup.rotation.y += 0.005; // Slow smooth Y axis rotation
        logoGroup.rotation.x = Math.sin(time * 0.5) * 0.1; // Very subtle float/tilt
    }

    // 2. Animate Numbers
    sprites.forEach(sprite => {
        const data = sprite.userData;
        
        // Circular orbit
        data.angle += data.speed;
        sprite.position.x = data.radius * Math.cos(data.angle) * Math.cos(data.phi);
        sprite.position.z = data.radius * Math.sin(data.angle) * Math.cos(data.phi);
        
        // Vertical node drift
        sprite.position.y = data.baseY + Math.sin(time * data.bobSpeed + data.bobOffset) * 1.5;
        
        // Dynamic glow pulsing based on orbit angle & time
        sprite.material.opacity = 0.4 + Math.sin(time * 2 + data.angle) * 0.2;
    });

    // 3. Camera Depth Move (Parallax)
    targetX = mouseX * 3;
    targetY = mouseY * 3;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// Ensure responsiveness
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start loop
animate();
