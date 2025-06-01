// Three.js 3D Models Module - New version with color fixes
// Using Three.js from CDN as fallback
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

class ThreeJSModels {
    constructor() {
        this.scenes = {};
        this.renderers = {};
        this.cameras = {};
        this.controls = {};
        this.models = {};
        this.isInitialized = false;
        this.debugMode = false; // Add debug mode flag
        console.log("🏗️ ThreeJSModels class instantiated");
    }

    // Helper method to toggle debug mode
    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        console.log(`🐞 Debug mode ${this.debugMode ? "enabled" : "disabled"}`);
        return this.debugMode;
    }

    // Debug log helper - only logs when debug mode is enabled
    debugLog(message, ...args) {
        if (this.debugMode) {
            console.log(`🔍 DEBUG: ${message}`, ...args);
        }
    }

    async init() {
        if (this.isInitialized) {
            console.log("⚠️ Three.js models already initialized");
            return;
        }

        console.log("🚀 Starting Three.js models initialization...");
        try {
            // Initialize CPU model
            console.log("🔧 Initializing CPU model...");
            await this.initModel("cpu", "cpu.glb");

            // Initialize RAM model
            console.log("🔧 Initializing RAM model...");
            await this.initModel("ram", "RAM.glb");

            // Initialize ROM model
            console.log("🔧 Initializing ROM model...");
            await this.initModel("rom", "ROM.glb");

            this.isInitialized = true;
            console.log("✅ Three.js models initialized successfully");
        } catch (error) {
            console.error("❌ Error initializing Three.js models:", error);
        }
    }

    async initModel(modelType, filename) {
        const canvas = document.getElementById(`${modelType}-canvas`);
        const loadingIndicator = canvas?.parentElement?.querySelector(".loading-indicator");

        if (!canvas) {
            console.warn(`Canvas for ${modelType} not found`);
            return;
        }

        // Show loading indicator
        if (loadingIndicator) {
            loadingIndicator.style.display = "flex";
        }

        try {
            // Create scene with neutral gray background
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x333333);

            // Create camera with good default position
            const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
            camera.position.set(0, 0, 5);

            // Enhanced renderer setup optimized for color accuracy
            const renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                antialias: true,
                preserveDrawingBuffer: true,
                alpha: false, // Disable alpha for better color fidelity
            });
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Better shadow quality

            // Optimized color settings
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.toneMapping = THREE.ACESFilmicToneMapping; // Better color balance
            renderer.toneMappingExposure = 1.2; // Slightly brighter
            renderer.gammaFactor = 2.2; // Standard gamma correction

            // Add balanced lighting
            this.addLighting(scene);

            // Add controls
            const controls = new OrbitControls(camera, canvas);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.enableZoom = true;
            controls.enablePan = false;
            controls.minDistance = 2;
            controls.maxDistance = 10;

            // Load model
            let model = await this.loadGLTFModel(`model/${filename}`);

            // If loading fails, use fallback models
            if (!model) {
                console.log(`⚠️ Using fallback model for ${modelType}`);
                switch (modelType) {
                    case "cpu":
                        model = this.createCPUModel();
                        break;
                    case "ram":
                        model = this.createRAMModel();
                        break;
                    case "rom":
                        model = this.createROMModel();
                        break;
                    default:
                        model = this.createSimpleCube();
                }
            }

            // Add model to scene
            scene.add(model);

            // Add automatic rotation
            if (model) {
                model.userData.rotationSpeed = {
                    x: Math.random() * 0.01,
                    y: 0.01,
                    z: Math.random() * 0.005,
                };
            }

            // Store references
            this.scenes[modelType] = scene;
            this.renderers[modelType] = renderer;
            this.cameras[modelType] = camera;
            this.controls[modelType] = controls;
            this.models[modelType] = model;

            // Setup model controls
            this.setupModelControls(modelType);

            // Start render loop
            this.animate(modelType);

            // Hide loading indicator
            if (loadingIndicator) {
                loadingIndicator.style.display = "none";
            }

            console.log(`✅ ${modelType.toUpperCase()} model loaded successfully`);
        } catch (error) {
            console.error(`❌ Error loading ${modelType} model:`, error);
            if (loadingIndicator) {
                loadingIndicator.innerHTML = `
                    <div style="color: #ff6b6b;">
                        <p>⚠️ Không thể tải mô hình ${modelType.toUpperCase()}</p>
                        <p style="font-size: 12px;">Đang hiển thị mô hình thay thế...</p>
                    </div>
                `;
            }

            // Create fallback model
            setTimeout(() => {
                this.createFallbackModel(modelType);
                if (loadingIndicator) {
                    loadingIndicator.style.display = "none";
                }
            }, 1000);
        }
    }

    // Add balanced lighting to scene
    addLighting(scene) {
        // Remove any existing lights first
        scene.children.filter((child) => child.isLight).forEach((light) => scene.remove(light));

        // Add ambient light for overall illumination (increased intensity)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
        scene.add(ambientLight);

        // Add directional light for shadows and definition
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024; // Higher resolution shadows
        directionalLight.shadow.mapSize.height = 1024;
        scene.add(directionalLight);

        // Add a fill light from the opposite direction
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
        fillLight.position.set(-5, 0, -5);
        scene.add(fillLight);

        // Add a top-down light for better shape definition
        const topLight = new THREE.DirectionalLight(0xffffff, 0.4);
        topLight.position.set(0, 10, 0);
        scene.add(topLight);

        // Add a subtle hemisphere light for natural look
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.35);
        scene.add(hemiLight);
    }

    // Load GLTF/GLB model
    async loadGLTFModel(path) {
        return new Promise((resolve, reject) => {
            console.log(`📁 Loading GLTF model from: ${path}`);
            const loader = new GLTFLoader();

            loader.load(
                path,
                (gltf) => {
                    console.log(`✅ GLTF model loaded successfully: ${path}`);
                    const model = gltf.scene;

                    // Auto-scale based on model size
                    const box = new THREE.Box3().setFromObject(model);
                    const size = box.getSize(new THREE.Vector3()).length();
                    const center = box.getCenter(new THREE.Vector3());

                    // Determine appropriate scale based on model type
                    let targetSize = 3.0;

                    // Prevent division by zero
                    const scale = size > 0.001 ? targetSize / size : 1.0;
                    model.scale.setScalar(scale);

                    // Center the model
                    model.position.copy(center).multiplyScalar(-scale);

                    console.log(`📏 Model auto-scaled: ${scale.toFixed(3)}x (original size: ${size.toFixed(2)})`);

                    // Fix issues with materials
                    this.fixMaterialsInModel(model, path);

                    resolve(model);
                },
                (xhr) => {
                    const percent = (xhr.loaded / xhr.total) * 100;
                    if (xhr.total > 0) {
                        console.log(`📊 Loading progress: ${percent.toFixed(0)}%`);
                    }
                },
                (error) => {
                    console.error(`❌ Error loading GLTF model from ${path}:`, error);
                    resolve(null); // Resolve with null instead of rejecting to allow fallbacks
                }
            );
        });
    }

    // Apply material fixes to model
    fixMaterialsInModel(model, modelPath) {
        console.log(`🔧 Fixing materials for model: ${modelPath}`);

        model.traverse((child) => {
            if (child.isMesh) {
                // Ensure the mesh has shadow properties
                child.castShadow = true;
                child.receiveShadow = true;

                // Check for materials
                if (child.material) {
                    const defaultColor = this.getDefaultColorForModel(modelPath);
                    console.log(`🎨 Default color for model: ${defaultColor.getHexString()}`);

                    // Handle arrays of materials
                    const materials = Array.isArray(child.material) ? child.material : [child.material];

                    materials.forEach((material, index) => {
                        // Log material info
                        this.debugLog(
                            `💠 Original material ${index}: Type=${
                                material.type
                            }, Has Color=${!!material.color}, Color Value=${
                                material.color ? "#" + material.color.getHexString() : "none"
                            }`
                        );

                        // Fix issues with missing colors
                        if (!material.color) {
                            material.color = defaultColor.clone();
                            this.debugLog(`  ➕ Added missing color: ${material.color.getHexString()}`);
                        }
                        // Fix black materials
                        else if (material.color.r === 0 && material.color.g === 0 && material.color.b === 0) {
                            material.color.copy(defaultColor);
                            this.debugLog(`  🔄 Replaced black color with default: ${material.color.getHexString()}`);
                        }

                        // Convert materials as needed for better lighting response
                        if (material.type === "MeshBasicMaterial") {
                            // Convert MeshBasicMaterial (no lighting) to MeshPhongMaterial (good lighting)
                            const originalColor = material.color.clone();
                            const newMaterial = new THREE.MeshPhongMaterial({
                                color: originalColor,
                                map: material.map,
                                transparent: material.transparent,
                                opacity: material.opacity,
                                shininess: 75,
                                specular: new THREE.Color(0x444444),
                            });

                            if (Array.isArray(child.material)) {
                                child.material[index] = newMaterial;
                            } else {
                                child.material = newMaterial;
                            }
                            console.log(`  🔄 Converted MeshBasicMaterial to MeshPhongMaterial`);
                            material = newMaterial;
                        }
                        // Enhance MeshStandardMaterial
                        else if (material.type === "MeshStandardMaterial") {
                            material.roughness = 0.5; // Medium roughness
                            material.metalness = 0.2; // Slight metalness
                            console.log(`  🔧 Enhanced MeshStandardMaterial properties`);
                        }
                        // Convert Lambert materials to Phong for better specular highlights
                        else if (material.type === "MeshLambertMaterial") {
                            const originalColor = material.color.clone();
                            const newMaterial = new THREE.MeshPhongMaterial({
                                color: originalColor,
                                map: material.map,
                                transparent: material.transparent,
                                opacity: material.opacity,
                                shininess: 60,
                                specular: new THREE.Color(0x444444),
                            });

                            if (Array.isArray(child.material)) {
                                child.material[index] = newMaterial;
                            } else {
                                child.material = newMaterial;
                            }
                            console.log(`  🔄 Converted MeshLambertMaterial to MeshPhongMaterial`);
                            material = newMaterial;
                        }

                        // Ensure material is updated
                        if (material.map) {
                            material.map.needsUpdate = true;
                        }
                        material.needsUpdate = true;
                    });
                } else {
                    // If no material exists, create a MeshPhongMaterial for better lighting response
                    console.log(`  ⚠️ Mesh missing material, creating default`);
                    child.material = new THREE.MeshPhongMaterial({
                        color: this.getDefaultColorForModel(modelPath),
                        shininess: 75,
                        specular: new THREE.Color(0x333333),
                    });
                }
            }
        });
    }

    // Get default color for each model type
    getDefaultColorForModel(modelPath) {
        if (modelPath.toLowerCase().includes("cpu")) {
            return new THREE.Color(0x2196f3); // Blue for CPU
        } else if (modelPath.toLowerCase().includes("ram")) {
            return new THREE.Color(0x4caf50); // Green for RAM
        } else if (modelPath.toLowerCase().includes("rom")) {
            return new THREE.Color(0x795548); // Brown for ROM
        } else {
            return new THREE.Color(0xcccccc); // Light gray as default
        }
    }

    // Create fallback model when loading fails
    createFallbackModel(modelType) {
        const canvas = document.getElementById(`${modelType}-canvas`);
        if (!canvas) return;

        // Create simple scene with fallback model
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x333333);

        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            preserveDrawingBuffer: true,
            alpha: false,
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        renderer.gammaFactor = 2.2;

        this.addLighting(scene);

        // Create appropriate fallback model
        let model;
        switch (modelType) {
            case "cpu":
                model = this.createCPUModel();
                break;
            case "ram":
                model = this.createRAMModel();
                break;
            case "rom":
                model = this.createROMModel();
                break;
            default:
                model = this.createSimpleCube();
        }

        scene.add(model);

        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;

        // Store references
        this.scenes[modelType] = scene;
        this.renderers[modelType] = renderer;
        this.cameras[modelType] = camera;
        this.controls[modelType] = controls;
        this.models[modelType] = model;

        // Add default rotation animation
        model.userData.rotationSpeed = {
            x: Math.random() * 0.01,
            y: 0.01,
            z: Math.random() * 0.005,
        };

        this.setupModelControls(modelType);
        this.animate(modelType);
    }

    // Create simple colored cube
    createSimpleCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
        const cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        cube.receiveShadow = true;
        return cube;
    }

    // Create CPU geometric model
    createCPUModel() {
        const group = new THREE.Group();

        // Main CPU body
        const cpuGeometry = new THREE.BoxGeometry(3, 0.4, 3);
        const cpuMaterial = new THREE.MeshPhongMaterial({
            color: 0x2196f3,
            shininess: 80,
            specular: 0x333333,
        });
        const cpuBody = new THREE.Mesh(cpuGeometry, cpuMaterial);
        cpuBody.castShadow = true;
        cpuBody.receiveShadow = true;
        group.add(cpuBody);

        // CPU pins
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (i === 0 || i === 9 || j === 0 || j === 9) {
                    const pinGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3);
                    const pinMaterial = new THREE.MeshPhongMaterial({
                        color: 0xffd700,
                        shininess: 100,
                    });
                    const pin = new THREE.Mesh(pinGeometry, pinMaterial);
                    pin.position.set((i - 4.5) * 0.25, -0.2, (j - 4.5) * 0.25);
                    pin.castShadow = true;
                    pin.receiveShadow = true;
                    group.add(pin);
                }
            }
        }

        // CPU lid
        const lidGeometry = new THREE.BoxGeometry(1.5, 0.05, 1.5);
        const lidMaterial = new THREE.MeshPhongMaterial({
            color: 0x64b5f6,
            shininess: 100,
        });
        const lid = new THREE.Mesh(lidGeometry, lidMaterial);
        lid.position.y = 0.2;
        lid.castShadow = true;
        lid.receiveShadow = true;
        group.add(lid);

        return group;
    }

    // Create RAM geometric model
    createRAMModel() {
        const group = new THREE.Group();

        // Main RAM body
        const ramGeometry = new THREE.BoxGeometry(0.3, 2, 0.8);
        const ramMaterial = new THREE.MeshPhongMaterial({
            color: 0x4caf50,
            shininess: 80,
        });
        const ramBody = new THREE.Mesh(ramGeometry, ramMaterial);
        ramBody.castShadow = true;
        ramBody.receiveShadow = true;
        group.add(ramBody);

        // RAM chips
        for (let i = 0; i < 8; i++) {
            const chipGeometry = new THREE.BoxGeometry(0.25, 0.2, 0.15);
            const chipMaterial = new THREE.MeshPhongMaterial({
                color: 0x333333,
                shininess: 50,
            });
            const chip = new THREE.Mesh(chipGeometry, chipMaterial);
            chip.position.set(0, -0.8 + i * 0.2, 0.25);
            chip.castShadow = true;
            chip.receiveShadow = true;
            group.add(chip);
        }

        // Gold contacts
        const contactGeometry = new THREE.BoxGeometry(0.32, 0.05, 0.1);
        const contactMaterial = new THREE.MeshPhongMaterial({
            color: 0xffd700,
            shininess: 150,
            specular: 0xffffcc,
        });
        const contact = new THREE.Mesh(contactGeometry, contactMaterial);
        contact.position.set(0, -1, -0.35);
        contact.castShadow = true;
        contact.receiveShadow = true;
        group.add(contact);

        return group;
    }

    // Create ROM geometric model
    createROMModel() {
        const group = new THREE.Group();

        // Main ROM body
        const romGeometry = new THREE.BoxGeometry(1.5, 0.3, 0.8);
        const romMaterial = new THREE.MeshPhongMaterial({
            color: 0x795548,
            shininess: 60,
        });
        const romBody = new THREE.Mesh(romGeometry, romMaterial);
        romBody.castShadow = true;
        romBody.receiveShadow = true;
        group.add(romBody);

        // ROM pins
        for (let i = 0; i < 14; i++) {
            // Left side pins
            const pinGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.15);
            const pinMaterial = new THREE.MeshPhongMaterial({
                color: 0xffd700,
                shininess: 100,
            });
            const pinLeft = new THREE.Mesh(pinGeometry, pinMaterial);
            pinLeft.position.set(-0.65, -0.22, -0.35 + i * 0.05);
            pinLeft.rotation.z = Math.PI / 2;
            pinLeft.castShadow = true;
            pinLeft.receiveShadow = true;
            group.add(pinLeft);

            // Right side pins
            const pinRight = new THREE.Mesh(pinGeometry, pinMaterial);
            pinRight.position.set(0.65, -0.22, -0.35 + i * 0.05);
            pinRight.rotation.z = Math.PI / 2;
            pinRight.castShadow = true;
            pinRight.receiveShadow = true;
            group.add(pinRight);
        }

        // ROM label
        const labelGeometry = new THREE.BoxGeometry(1.2, 0.01, 0.4);
        const labelMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shininess: 30,
        });
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.y = 0.16;
        label.castShadow = true;
        label.receiveShadow = true;
        group.add(label);

        return group;
    }

    // Setup model controls
    setupModelControls(modelType) {
        const controlButtons = document.querySelectorAll(`#${modelType}-panel .control-btn`);

        controlButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const action = button.getAttribute("data-action");
                this.handleControlAction(modelType, action);
            });
        });
    } // Handle control actions
    handleControlAction(modelType, action) {
        const model = this.models[modelType];
        const camera = this.cameras[modelType];
        const controls = this.controls[modelType];

        if (!model || !camera || !controls) return;

        switch (action) {
            case "rotate": {
                // Toggle rotation speed
                const speed = model.userData.rotationSpeed;
                if (speed.y > 0.005) {
                    speed.y = 0.0; // Stop rotation
                } else {
                    speed.y = 0.02; // Start/speed up rotation
                }
                break;
            }

            case "zoom": {
                // Zoom in/out with safe limits
                const currentDistance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
                if (currentDistance > 4) {
                    camera.position.multiplyScalar(0.7); // Zoom in
                } else if (currentDistance < 3) {
                    camera.position.multiplyScalar(1.5); // Zoom out
                } else {
                    // Toggle between close and far view
                    const targetDistance = currentDistance > 3.5 ? 2.5 : 5;
                    const direction = camera.position.clone().normalize();
                    camera.position.copy(direction.multiplyScalar(targetDistance));
                }
                break;
            }

            case "reset": {
                // Reset camera and rotation
                camera.position.set(0, 0, 5);
                model.rotation.set(0, 0, 0);
                model.userData.rotationSpeed = {
                    x: 0.002,
                    y: 0.01,
                    z: 0.001,
                };
                controls.reset();
                break;
            }
        }
    }

    // Animation loop
    animate(modelType) {
        const scene = this.scenes[modelType];
        const camera = this.cameras[modelType];
        const renderer = this.renderers[modelType];
        const controls = this.controls[modelType];
        const model = this.models[modelType];

        if (!scene || !camera || !renderer) return;

        const animate = () => {
            requestAnimationFrame(animate);

            // Update controls
            if (controls) {
                controls.update();
            }

            // Rotate model
            if (model && model.userData.rotationSpeed) {
                const speed = model.userData.rotationSpeed;
                model.rotation.x += speed.x;
                model.rotation.y += speed.y;
                model.rotation.z += speed.z;
            }

            // Render scene
            renderer.render(scene, camera);
        };

        animate();
    }

    // Handle window resize
    handleResize() {
        Object.keys(this.renderers).forEach((modelType) => {
            const canvas = document.getElementById(`${modelType}-canvas`);
            const camera = this.cameras[modelType];
            const renderer = this.renderers[modelType];

            if (canvas && camera && renderer) {
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            }
        });
    }

    // Fix all black materials in a specific model
    fixBlackMaterials(modelType) {
        const model = this.models[modelType];
        if (!model) {
            console.log(`❌ No model found for ${modelType}`);
            return false;
        }

        const defaultColor = this.getDefaultColorForModel(`model/${modelType}.glb`);
        let fixCount = 0;

        model.traverse((child) => {
            if (child.isMesh && child.material) {
                const materials = Array.isArray(child.material) ? child.material : [child.material];

                materials.forEach((material) => {
                    if (
                        !material.color ||
                        (material.color.r === 0 && material.color.g === 0 && material.color.b === 0)
                    ) {
                        material.color = defaultColor.clone();
                        material.needsUpdate = true;
                        fixCount++;
                    }
                });
            }
        });

        console.log(`🔧 Fixed ${fixCount} black materials in ${modelType} model`);
        this.renderers[modelType]?.render(this.scenes[modelType], this.cameras[modelType]);
        return fixCount > 0;
    }

    // Change lighting settings
    adjustLighting(intensity = 0.8) {
        Object.keys(this.scenes).forEach((modelType) => {
            const scene = this.scenes[modelType];

            scene.children
                .filter((child) => child.isLight)
                .forEach((light) => {
                    if (light.type === "AmbientLight") {
                        light.intensity = intensity;
                    }
                    if (light.type === "DirectionalLight") {
                        light.intensity = intensity;
                    }
                });

            console.log(`💡 Adjusted lighting for ${modelType} model to ${intensity}`);

            // Re-render
            this.renderers[modelType]?.render(scene, this.cameras[modelType]);
        });
    }

    // Analyze model colors - useful for debugging
    analyzeModelColors(modelType) {
        const model = this.models[modelType];
        if (!model) {
            console.log(`❌ No model found for ${modelType}`);
            return;
        }

        console.log(`🔍 Analyzing model colors for ${modelType}:`);
        let meshCount = 0;
        let colorMap = {};

        model.traverse((child) => {
            if (child.isMesh) {
                meshCount++;

                const materials = Array.isArray(child.material) ? child.material : [child.material];
                materials.forEach((material, index) => {
                    if (material && material.color) {
                        const colorHex = "#" + material.color.getHexString();
                        if (!colorMap[colorHex]) {
                            colorMap[colorHex] = 0;
                        }
                        colorMap[colorHex]++;
                    }
                });
            }
        });

        console.log(`📊 Found ${meshCount} meshes`);
        console.log("📊 Color distribution:");
        Object.entries(colorMap).forEach(([color, count]) => {
            console.log(`   ${color}: ${count} occurrences (${Math.round((count / meshCount) * 100)}%)`);
        });

        return { meshCount, colorMap };
    }
}

// Export and initialize
const threeJSModels = new ThreeJSModels();

// Handle window resize
window.addEventListener("resize", () => {
    threeJSModels.handleResize();
});

// Export for global access (for backward compatibility)
window.threeJSModels = threeJSModels;
