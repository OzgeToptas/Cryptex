// Modern Three.js Cryptex Bulmacası
class ModernCryptexPuzzle {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.rings = [];
        this.ringRotations = [0, 0, 0, 0, 0];
        this.targetCode = ['C', 'O', 'D', 'E', 'X'];
        this.currentCode = ['A', 'A', 'A', 'A', 'A'];
        this.isUnlocked = false;
        this.ringRadius = 3;
        this.ringThickness = 0.4;
        this.ringHeight = 0.6;
        this.ringSpacing = 0.8;
        this.letterOffset = 0.2;

        this.init();
        this.createRings();
        this.createControls();
        this.animate();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        this.scene.fog = new THREE.Fog(0x0a0a0a, 20, 100);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 8, 15);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        document.getElementById('container').appendChild(this.renderer.domElement);

        // Controls with restrictions
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2.2;
        this.controls.minPolarAngle = Math.PI / 6;
        this.controls.maxDistance = 25;
        this.controls.minDistance = 8;
        this.controls.enablePan = false;

        // Lighting
        this.setupAdvancedLighting();

        // Event listeners
        window.addEventListener('resize', () => this.onWindowResize());
        this.renderer.domElement.addEventListener('mousedown', (event) => this.onMouseDown(event));
        this.renderer.domElement.addEventListener('mousemove', (event) => this.onMouseMove(event));
        this.renderer.domElement.addEventListener('mouseup', () => this.onMouseUp());

        this.isDragging = false;
        this.dragRing = null;
        this.dragStartY = 0;
    }

    setupAdvancedLighting() {
        // Ambient light for base illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);

        // Main directional light
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
        mainLight.position.set(10, 15, 10);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 4096;
        mainLight.shadow.mapSize.height = 4096;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 50;
        mainLight.shadow.camera.left = -15;
        mainLight.shadow.camera.right = 15;
        mainLight.shadow.camera.top = 15;
        mainLight.shadow.camera.bottom = -15;
        mainLight.shadow.bias = -0.0001;
        this.scene.add(mainLight);

        // Spotlights for dramatic effect
        const spotLight1 = new THREE.SpotLight(0x4CAF50, 0.8, 30, Math.PI / 6, 0.5);
        spotLight1.position.set(-8, 12, 8);
        spotLight1.target.position.set(0, 0, 0);
        spotLight1.castShadow = true;
        this.scene.add(spotLight1);
        this.scene.add(spotLight1.target);

        const spotLight2 = new THREE.SpotLight(0x2196F3, 0.6, 25, Math.PI / 6, 0.5);
        spotLight2.position.set(8, 10, -8);
        spotLight2.target.position.set(0, 0, 0);
        spotLight2.castShadow = true;
        this.scene.add(spotLight2);
        this.scene.add(spotLight2.target);

        // Rim light
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
        rimLight.position.set(-5, 5, -5);
        this.scene.add(rimLight);

        // Point lights for ambient glow
        const pointLight1 = new THREE.PointLight(0x4CAF50, 0.3, 20);
        pointLight1.position.set(-5, 3, 5);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x2196F3, 0.3, 20);
        pointLight2.position.set(5, 3, -5);
        this.scene.add(pointLight2);
    }

    createRings() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        for (let i = 0; i < 5; i++) {
            const ring = this.createRing(alphabet, i);
            this.rings.push(ring);
            this.scene.add(ring);
        }
    }

    createRing(alphabet, ringIndex) {
        const ringGroup = new THREE.Group();

        // Create torus geometry for realistic ring
        const ringGeometry = new THREE.TorusGeometry(
            this.ringRadius + ringIndex * 0.15,
            this.ringThickness,
            32,
            16
        );

        // Create metallic material with PBR-like properties
        const ringMaterial = new THREE.MeshPhongMaterial({
            color: 0x2c3e50,
            shininess: 100,
            specular: 0x444444,
            transparent: true,
            opacity: 0.95,
            reflectivity: 0.8
        });

        // Create the ring mesh
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        ringMesh.castShadow = true;
        ringMesh.receiveShadow = true;
        ringMesh.userData = { ringIndex: ringIndex, type: 'ring' };
        ringGroup.add(ringMesh);

        // Add inner cylinder for depth
        const innerGeometry = new THREE.CylinderGeometry(
            this.ringRadius + ringIndex * 0.15 - this.ringThickness * 0.8,
            this.ringRadius + ringIndex * 0.15 - this.ringThickness * 0.8,
            this.ringHeight,
            32
        );
        const innerMaterial = new THREE.MeshPhongMaterial({
            color: 0x1a1a1a,
            shininess: 50
        });
        const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
        innerMesh.castShadow = true;
        innerMesh.receiveShadow = true;
        ringGroup.add(innerMesh);

        // Add letters around the ring
        const letterRadius = this.ringRadius + ringIndex * 0.15 + this.letterOffset;

        alphabet.forEach((letter, letterIndex) => {
            const letterMesh = this.createExtrudedLetter(letter);
            const angle = (letterIndex / alphabet.length) * Math.PI * 2;

            letterMesh.position.set(
                Math.cos(angle) * letterRadius,
                0,
                Math.sin(angle) * letterRadius
            );
            letterMesh.rotation.y = angle + Math.PI / 2;

            ringGroup.add(letterMesh);
        });

        // Position the ring
        ringGroup.position.y = (2 - ringIndex) * this.ringSpacing;

        return ringGroup;
    }

    createExtrudedLetter(letter) {
        // Create canvas for text
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 128;

        // Set canvas background
        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.fillRect(0, 0, 128, 128);

        // Draw text with glow effect
        context.font = 'bold 64px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        // Add glow
        context.shadowColor = '#4CAF50';
        context.shadowBlur = 15;
        context.fillStyle = '#4CAF50';
        context.fillText(letter, 64, 64);

        // Add inner glow
        context.shadowBlur = 5;
        context.fillStyle = '#ffffff';
        context.fillText(letter, 64, 64);

        // Create texture
        const texture = new THREE.CanvasTexture(canvas);
        texture.encoding = THREE.sRGBEncoding;

        // Create extruded geometry
        const shape = new THREE.Shape();
        shape.moveTo(-0.15, -0.15);
        shape.lineTo(0.15, -0.15);
        shape.lineTo(0.15, 0.15);
        shape.lineTo(-0.15, 0.15);
        shape.lineTo(-0.15, -0.15);

        const extrudeSettings = {
            depth: 0.05,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.01,
            bevelSegments: 3
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        // Create material with emission for glow effect
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
            emissive: 0x4CAF50,
            emissiveIntensity: 0.2,
            shininess: 100
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh;
    }

    createControls() {
        const controlsContainer = document.getElementById('ring-controls');

        for (let i = 0; i < 5; i++) {
            const controlDiv = document.createElement('div');
            controlDiv.className = 'ring-control';

            const label = document.createElement('label');
            label.textContent = `Ring ${i + 1}`;

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = '0';
            slider.max = '25';
            slider.value = '0';
            slider.dataset.ringIndex = i;

            slider.addEventListener('input', (e) => {
                const ringIndex = parseInt(e.target.dataset.ringIndex);
                const value = parseInt(e.target.value);
                this.rotateRing(ringIndex, value);
            });

            // Make sliders more sensitive after unlock
            slider.addEventListener('change', (e) => {
                if (this.isUnlocked) {
                    // Set slider value more precisely
                    const ringIndex = parseInt(e.target.dataset.ringIndex);
                    const value = parseInt(e.target.value);
                    this.rotateRing(ringIndex, value);
                }
            });

            controlDiv.appendChild(label);
            controlDiv.appendChild(slider);
            controlsContainer.appendChild(controlDiv);
        }
    }

    rotateRing(ringIndex, value) {
        const ring = this.rings[ringIndex];
        const rotation = (value / 26) * Math.PI * 2;

        // Smooth rotation animation with slower speed after unlock
        const currentRotation = ring.rotation.y;
        const targetRotation = rotation;
        const rotationSpeed = this.isUnlocked ? 0.03 : 0.08; // Slower rotation after unlock

        const animateRotation = () => {
            const diff = targetRotation - currentRotation;
            if (Math.abs(diff) > 0.01) {
                ring.rotation.y += diff * rotationSpeed;
                requestAnimationFrame(animateRotation);
            } else {
                ring.rotation.y = targetRotation;
            }
        };

        animateRotation();

        this.ringRotations[ringIndex] = value;
        this.updateCurrentCode();
        this.checkUnlock();
    }

    updateCurrentCode() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        for (let i = 0; i < 5; i++) {
            const rotation = this.ringRotations[i];
            const letterIndex = (26 - rotation) % 26;
            this.currentCode[i] = alphabet[letterIndex];
        }

        const codeElement = document.getElementById('current-code');
        codeElement.textContent = this.currentCode.join(' ');

        // Update progress
        this.updateProgress();

        // Check if code is correct for visual feedback
        const isCorrect = this.currentCode.every((letter, index) => letter === this.targetCode[index]);
        if (isCorrect) {
            codeElement.classList.add('correct');
        } else {
            codeElement.classList.remove('correct');
        }
    }

    updateProgress() {
        let correctLetters = 0;
        for (let i = 0; i < 5; i++) {
            if (this.currentCode[i] === this.targetCode[i]) {
                correctLetters++;
            }
        }

        const progress = (correctLetters / 5) * 100;
        const progressFill = document.getElementById('progress-fill');
        progressFill.style.width = `${progress}%`;
    }

    checkUnlock() {
        const isCorrect = this.currentCode.every((letter, index) => letter === this.targetCode[index]);

        if (isCorrect && !this.isUnlocked) {
            this.isUnlocked = true;
            this.showUnlockMessage();
            this.playUnlockAnimation();

            // Slow down controls after unlock
            this.slowDownControls();
        }
    }

    slowDownControls() {
        // Make sliders more sensitive
        const sliders = document.querySelectorAll('input[type="range"]');
        sliders.forEach(slider => {
            slider.style.opacity = '0.7';
            slider.title = 'Unlocked! Rings now rotate slower';
        });

        // Show info message in UI
        const ui = document.getElementById('ui');
        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = `
            margin-top: 15px;
            padding: 10px;
            background: rgba(76, 175, 80, 0.2);
            border: 1px solid rgba(76, 175, 80, 0.4);
            border-radius: 8px;
            font-size: 12px;
            text-align: center;
            color: #4CAF50;
        `;
        infoDiv.textContent = '🎉 Unlocked! Rings now rotate slower';
        ui.appendChild(infoDiv);
    }

    showUnlockMessage() {
        const message = document.getElementById('unlock-message');
        message.classList.add('show');

        setTimeout(() => {
            message.classList.remove('show');
        }, 4000);
    }

    playUnlockAnimation() {
        // Create multiple particle systems
        this.createParticleExplosion();
        this.createRingGlowEffect();
        this.createCameraShake();
    }

    createParticleExplosion() {
        const particleCount = 200;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 15;
            positions[i + 1] = (Math.random() - 0.5) * 15;
            positions[i + 2] = (Math.random() - 0.5) * 15;

            colors[i] = Math.random() > 0.5 ? 0.3 : 1.0; // Green
            colors[i + 1] = 1.0; // Full green
            colors[i + 2] = Math.random() * 0.3; // Some blue

            sizes[i / 3] = Math.random() * 0.3 + 0.1;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 1,
            blending: THREE.AdditiveBlending
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        this.scene.add(particleSystem);

        // Animate particles
        const animateParticles = () => {
            particleSystem.rotation.y += 0.02;
            particleSystem.rotation.x += 0.01;

            const positions = particleSystem.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += (Math.random() - 0.5) * 0.1;
                positions[i + 1] += (Math.random() - 0.5) * 0.1;
                positions[i + 2] += (Math.random() - 0.5) * 0.1;
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;

            particleMaterial.opacity -= 0.01;

            if (particleMaterial.opacity > 0) {
                requestAnimationFrame(animateParticles);
            } else {
                this.scene.remove(particleSystem);
            }
        };

        animateParticles();
    }

    createRingGlowEffect() {
        this.rings.forEach((ring, index) => {
            const originalScale = ring.scale.clone();

            // Scale animation
            const scaleUp = () => {
                ring.scale.setScalar(1.1);
                setTimeout(() => {
                    ring.scale.copy(originalScale);
                }, 200);
            };

            setTimeout(scaleUp, index * 100);
        });
    }

    createCameraShake() {
        const originalPosition = this.camera.position.clone();
        let shakeCount = 0;
        const maxShakes = 10;

        const shake = () => {
            if (shakeCount < maxShakes) {
                this.camera.position.x = originalPosition.x + (Math.random() - 0.5) * 0.5;
                this.camera.position.y = originalPosition.y + (Math.random() - 0.5) * 0.5;
                this.camera.position.z = originalPosition.z + (Math.random() - 0.5) * 0.5;
                shakeCount++;
                setTimeout(shake, 50);
            } else {
                this.camera.position.copy(originalPosition);
            }
        };

        shake();
    }

    onMouseDown(event) {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        const intersects = raycaster.intersectObjects(this.rings, true);

        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            let ringGroup = intersectedObject;

            // Find the ring group
            while (ringGroup.parent && !ringGroup.userData.hasOwnProperty('ringIndex')) {
                ringGroup = ringGroup.parent;
            }

            if (ringGroup.userData.hasOwnProperty('ringIndex')) {
                this.isDragging = true;
                this.dragRing = ringGroup.userData.ringIndex;
                this.dragStartY = event.clientY;
            }
        }
    }

    onMouseMove(event) {
        if (this.isDragging && this.dragRing !== null) {
            const deltaY = event.clientY - this.dragStartY;
            // More sensitive control after unlock
            const sensitivity = this.isUnlocked ? 12 : 8;
            const rotationDelta = Math.floor(deltaY / sensitivity);

            const newValue = (this.ringRotations[this.dragRing] + rotationDelta) % 26;
            const clampedValue = newValue < 0 ? newValue + 26 : newValue;

            this.rotateRing(this.dragRing, clampedValue);

            // Update slider
            const slider = document.querySelector(`input[data-ring-index="${this.dragRing}"]`);
            if (slider) {
                slider.value = clampedValue;
            }

            this.dragStartY = event.clientY;
        }
    }

    onMouseUp() {
        this.isDragging = false;
        this.dragRing = null;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the puzzle when the page loads
window.addEventListener('load', () => {
    new ModernCryptexPuzzle();
}); 