window.onload = function()
{
	// Setup Scene, Camera, and Renderer
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// === Interaction system ===
	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();
	const interactables = [];
  const interactableByName = {};
  
  let hoveredObject = null; // Track currently hovered object

	const infoButton = document.getElementById('infoButton');
  const infoPanel = document.getElementById('infoPanel');
	const infoTitle = document.getElementById('infoTitle');
	const infoDescription = document.getElementById('infoDescription');
	const infoClose = document.getElementById('infoClose');
	infoClose.addEventListener('click', () =>
	{
		infoPanel.style.display = 'none';
    desiredTarget.copy(neutralTarget)
	});
  
  infoButton.addEventListener('click', () =>
  {
    displayInfo();
  });
	
  // Set World (Background) Color to Deep Blue
	scene.background = new THREE.Color(0x003388); // Deep blue background color

	// Set Depth Fog (Blue underwater effect)
	scene.fog = new THREE.FogExp2(0x003388, 0.75) // Subtle fog density

	// Add Ambient Light and Directional Light
	const ambientLight = new THREE.AmbientLight(0x404040, 1.0); // Increased ambient light intensity
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight.position.set(5, 5, 5).normalize();
	scene.add(directionalLight);

	// Add a Point Light above the water to simulate scattering
	const pointLight = new THREE.PointLight(0xffffff, 1, 100);
	pointLight.position.set(0, 20, 0); // Position above the water surface
	scene.add(pointLight);

	// Load the Coral Reef Model using GLTFLoader
	const loader = new THREE.GLTFLoader();

	function loadInteractable(
	{
		url,
		position = [0, 0, 0],
		scale = 1,
		rotation = [0, 0, 0],
		name,
		description
	})
	{
		loader.load(url, (gltf) =>
		{
			const model = gltf.scene;

			model.position.set(...position);
			model.rotation.set(...rotation);
			model.scale.setScalar(scale);
			model.name = name;
      interactableByName[name] = model;
			model.description = description;

			model.traverse((child) =>
			{
				if (child.isMesh)
				{
					child.userData.parent = model;
					interactables.push(child);
				}
			});
			scene.add(model);
		});
	}

	loader.load('models/reef.glb', function(gltf)
	{
		scene.add(gltf.scene);
		gltf.scene.scale.set(0.1, 0.1, 0.1); // Scale the model as needed
		gltf.scene.position.set(0, 0, 0); // Position model
	}, undefined, function(error)
	{
		console.error(error);
	});

	// === Interactable models ===
	loadInteractable(
	{
		url: 'models/parts/acropora_cervicornis.glb',
		position: [0.65, 0, 0],
		scale: 1.5,
		name: 'Acropora Cervicornis',
		description: "Called staghorn coral. Has thick, upright branches which can grow up to 6ft 5in and resembles the antlers of a stag, hence staghorn. It is about 2-8cm thick. Grows about 20m below sea level. Mostly found in the western atlantic ocean, near bahamas, florida, often near the gulf of mexico and around many caribbean islands. Made up of a type of calcium carbonate known as aragonite. Reproduces asexually and sexually."
	});

	loadInteractable(
	{
		url: 'models/parts/acropora_valenciennesi.glb',
		position: [0.33, 0.1, 0.33],
		scale: 1.5,
		name: 'Acropora Valenciennesi',
		description: "Called Acropora Valenciennesi or Giant Table Coral. Has thick, circular, smooth branches, but a hard surface. The skeleton is made up of rigid, aragonite (type of calcium carbonate) bones. It is about 3cm thick. Grows about 2-25m below sea level. Mostly found in the Indo-West Pacific region, like in Australia, Japan and French Polynesia but all the way to East Africa and the Red Sea. Reproduces through sexual reproduction as a hermaphroditic."
	});

	loadInteractable(
	{
		url: 'models/parts/astraea_fissicella_favistella.glb',
		position: [-0.65, 0.01, 0],
		scale: 1.5,
		name: 'Astraea Fissicella Favistella',
		description: "Called Goniastrea pectinata. Has massive, encrusting, submissive domes to protect, also has thick walls. It can reach sizes up to 30cm. The skeleton is made up of a type of calcium carbonite known as aragonite. Mostly found in the South Pacific Ocean, specifically Fiji but also in the Red Sea. No specific data on how deep it grows below sea level. Reproduces through sexual reproduction as a hermaphroditic."
	});

	loadInteractable(
	{
		url: 'models/parts/diploastrea_heliopora.glb',
		position: [-0.33, -0.05, 0.53],
		scale: 5,
		name: 'Diploastrea Heliopora',
		description: "Called Diploastrea Brain Coral or Honeycomb Coral. Has tightly packed individual walls, has a dome shaped colony that has a very smooth, extremely dense skeleton made up of a type of calcium carbonate known as aragonite. It can reach up to 6ft in height and up to 5+ meters wide, but the diameter is only 1cm thick. Mostly found in the Indo-West Pacific, Red Sea, Indian Ocean and many parts of West Africa. Grows about 0-30m below sea level. Reproduces both asexually and sexually."
	});
	loadInteractable(
	{
		url: 'models/parts/distichopora_violacea.glb',
		position: [0.45, 0.1, 0.5],
		scale: 1.5,
		name: 'Distichopora Violacea',
		description: "Called Lace Coral or Violet/Blue/Purple Lace Coral and even Sylaster Coral. Has a tree-shaped look with blunt-ended branches. Colour ranges from deep purple to violet, sometimes pink. The skeleton is made of a type of calcium carbonate known as aragonite. It can reach heights of 18.9mm to 25cm, 26.3cm to 20cm wide, and 4-5cm thick. Mostly found in the Indo-West Pacific Ocean but also in the Red Sea, and all the way to the Galapagos islands near Ecuador. Also found near Seychelles and the island of Réunion. Grows up to 122m below sea levels, mostly in dark caves."
	});
	loadInteractable(
	{
		url: 'models/parts/heliopora_coerulea.glb',
		position: [-0.45, 0, -0.45],
		scale: 1,
		name: 'Heliopora Coerulea',
		description: "Called Blue Coral. Has long white branches but blue shells after death. Mostly it is grey-brown, greenish-grey or tan. Feels like a pillow when feeling it. The skeleton is made of a type of calcium carbonate known as aragonite. It can reach heights of 70-90cm, 80-100cm wide and 15mm thick. Mostly found in the Indo-West Pacific Ocean, but also in the Red Sea, East Africa and across to the Great Barrier Reef (Australia), the Coral Sea, Samoa, Indonesia, Philippines and Japan. Grows around 0-3m below sea level. Reproduces both asexually and sexually."
	});
	loadInteractable(
	{
		url: 'models/parts/madrepora_humilis.glb',
		position: [0.35, 0, -0.15],
		scale: 2,
		name: 'Madrepora Humilis',
		description: "Called Madrepora coral. Has thin, delicate branching structures that form bushy or open colonies. The branches are fragile and can break easily. The skeleton is made of a type of calcium carbonate known as aragonite. Colonies are usually small to medium in size and grow in deeper reef areas. Mostly found in the Indo-West Pacific Ocean, including areas around Indonesia, the Philippines and the Great Barrier Reef. Grows at depths of around 10–50m below sea level. Reproduces both asexually through fragmentation and sexually by releasing eggs and sperm."
	});
	loadInteractable(
	{
		url: 'models/parts/merulina_rigida.glb',
		position: [0.65, 0, 0.65],
		scale: 1,
		name: 'Merulina Rigida',
		description: "Called Ridge Coral or Lettuce Coral. Has thin, rigid plates that form ridges and folds, giving it a wrinkled or leaf-like appearance. The surface is hard and rough, with sharp edges. The skeleton is made of aragonite (a type of calcium carbonate). Colonies can grow quite large, spreading outward rather than upward. Mostly found in the Indo-West Pacific region, including the Red Sea, Indian Ocean and parts of Southeast Asia. Grows at depths of about 1–25m below sea level. Reproduces mainly through sexual reproduction as a hermaphrodite."
	});
	loadInteractable(
	{
		url: 'models/parts/psammocora_columna.glb',
		position: [0, 0.1, 0.5],
		scale: 1,
		name: 'Psammocora Columna',
		description: "Called Column Coral. Has small, compact columns or mound-shaped colonies with tightly packed corallites. The surface appears rough and grainy. The skeleton is made of calcium carbonate in the form of aragonite. Colonies are usually low-growing and strong, helping them survive wave action. Mostly found in the Indo-West Pacific Ocean, including the Red Sea, East Africa, Australia and Japan. Grows in shallow reef environments around 1–20m below sea level. Reproduces through sexual reproduction and can also spread asexually."
	});
	loadInteractable(
	{
		url: 'models/parts/stylaster_brochi.glb',
		position: [-.33, 0, 0],
		scale: 2,
		name: 'Stylaster Brochi',
		description: "Called Lace Coral or Hydrocoral. Has delicate, branching structures that form lace-like or fan-shaped colonies. Colours range from pink to red or purple. Although it looks like a coral, it is actually a hydrozoan. The skeleton is made of calcium carbonate. Colonies are usually small but very detailed and fragile. Mostly found in deeper waters of the Atlantic Ocean and Mediterranean Sea. Grows at depths of around 20–150m below sea level. Reproduces sexually and asexually."
	});
  
  document.querySelectorAll('.coralBtn').forEach((btn) => {
    btn.addEventListener('click', () => {
        const name = btn.innerHTML;
        const coral = interactableByName[name]

        if (coral) {
            onInteract(coral)
        } else {
            console.warn('No coral found for:', name)
        }
    })
  })

	// Create a plane to represent the water surface
	const waterGeometry = new THREE.PlaneGeometry(500, 500, 64, 64);
	const waterMaterial = new THREE.MeshBasicMaterial(
	{
		color: 0x001166, // Deep blue color for water
		opacity: 0.4, // Transparency to simulate underwater
		transparent: true, // Make the water material transparent
		side: THREE.DoubleSide, // Allow the surface to be seen from both sides
	});

	const waterSurface = new THREE.Mesh(waterGeometry, waterMaterial);
	waterSurface.rotation.x = -Math.PI / 2; // Make it flat
	waterSurface.position.set(0, 0.85, 0); // Position above model
	scene.add(waterSurface);

	// Update water surface with wave animation
	function animateWater()
	{
		const vertices = waterSurface.geometry.attributes.position.array;
		const time = Date.now() * 0.002;

		for (let i = 0; i < vertices.length; i += 3)
		{
			vertices[i + 2] = Math.sin(vertices[i] * 0.1 + time) * 0.1; // Create wave effect
		}

		waterSurface.geometry.attributes.position.needsUpdate = true;
	}

	// Particle System for Bubbles
	const textureLoader = new THREE.TextureLoader();
	const bubbleTexture = textureLoader.load('img/bubble.png');

	const particleGeometry = new THREE.BufferGeometry();
	const particleCount = 500;
	const positions = new Float32Array(particleCount * 3);

	const range = 5;

	for (let i = 0; i < particleCount; i++)
	{
		positions[i * 3] = Math.random() * range - range / 2; // X position around 0
		positions[i * 3 + 1] = Math.random() * range - range / 2; // Y position around 0
		positions[i * 3 + 2] = Math.random() * range - range / 2; // Z position around 0
	}

	particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

	const particleMaterial = new THREE.PointsMaterial(
	{
		size: 0.05,
		map: bubbleTexture,
		transparent: true,
		opacity: 0.5,
	});

	const particles = new THREE.Points(particleGeometry, particleMaterial);
	scene.add(particles);

	// Animate Bubbles
	function animateParticles()
	{
		const positions = particles.geometry.attributes.position.array;
		const time = Date.now() * 0.001; // Use time for smooth animation

		// Set a sine wave animation for the Y position of each bubble
		for (let i = 0; i < positions.length; i += 3)
		{
			// Move each particle in a sine wave pattern to simulate bubbling motion
			positions[i + 1] += Math.sin(positions[i] * 0.01 + time) * Math.random() * 0.001; // Y-axis oscillation

			// Optionally, you can add some horizontal movement as well to make them more natural
			positions[i] += Math.sin(i * 0.001 + time) * 0.01; // X-axis slight movement
			positions[i + 2] += Math.cos(i * 0.001 + time) * 0.01; // Z-axis slight movement
		}

		particles.geometry.attributes.position.needsUpdate = true;
	}

	// Camera controls
	const controls = new THREE.OrbitControls(camera, renderer.domElement);
	camera.position.z = 5;
	camera.position.y = 1;
	controls.minDistance = 0.5; // how close you can zoom in
	controls.maxDistance = 1.5; // how far you can zoom out
	controls.minPolarAngle = 0; // straight up
	controls.maxPolarAngle = Math.PI / 2; // horizontal
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = false;
  controls.enableZoom = true;

 const neutralTarget = new THREE.Vector3(0, 0, 0)
  const animatedTarget = new THREE.Vector3()
  const desiredTarget = new THREE.Vector3()

  animatedTarget.copy(neutralTarget)
  desiredTarget.copy(neutralTarget)
  controls.target.copy(animatedTarget)

  controls.touches =
  {
    ONE:THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN
  }


	//Click Handler
	window.addEventListener('click', (event) =>
	{
    updatePointer(event.clientX,event.clientY);
    handlePick()
	});

  //Touch Handler

  window.addEventListener('touchstart', (event) => 
  {
    if (event.touches.length === 1) {
        const touch = event.touches[0]
        updatePointer(touch.clientX, touch.clientY)
        handlePick()
    }
  }, { passive: true })

	// Post-Processing Setup
	const composer = new THREE.EffectComposer(renderer);
	const renderPass = new THREE.RenderPass(scene, camera);
	composer.addPass(renderPass);

	// Add UnrealBloomPass for underwater glow effect
	const bloomPass = new THREE.UnrealBloomPass(
		new THREE.Vector2(window.innerWidth, window.innerHeight), // Resolution
		2.0, // Strength of bloom
		0.4, // Radius
		0.85 // Threshold
	);
	composer.addPass(bloomPass);

	// Optional: Add Film Pass for cinematic noise
	const filmPass = new THREE.FilmPass(0.35, 0.025, false, false);
	filmPass.renderToScreen = true;
	composer.addPass(filmPass);

	function onInteract(object)
	{
		infoTitle.textContent = object.name;
		infoDescription.textContent = object.description || '';
		infoPanel.style.display = 'block';
    
    object.getWorldPosition(desiredTarget)
	}

  function displayInfo()
  {
    infoTitle.textContent = "About Coral Reefs"
    infoDescription.textContent = "Coral reefs are found in warm, shallow oceans and are made from the hard skeletons of tiny animals called corals that build up over time. They are important because they provide homes and protection for many sea creatures, help supply food for people, and protect coastlines from strong waves. Coral reefs also attract tourists and are useful for scientific research. However, they are in danger from pollution, boats, and climate change, which makes the ocean too warm and acidic for corals to survive."
    infoPanel.style.display = 'block';
  }

	// Animation Loop
	function animate()
	{
		requestAnimationFrame(animate);
    updateAnimatedTarget()
		controls.update(); // Update camera controls
		animateWater(); // Animate water surface
		animateParticles(); // Animate bubble particles
		//updateViewportHover();
    directionalLight.position.x = Math.sin(Date.now() * 0.0002) * 5;
		composer.render(); // Use composer to render the scene with effects
	}

	animate();

	// Handle resizing of the window
	window.addEventListener('resize', () =>
	{
		renderer.setSize(window.innerWidth, window.innerHeight);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		composer.setSize(window.innerWidth, window.innerHeight); // Update composer size
	});

  window.addEventListener('mousemove', (event) => 
  {
    updateHoverFromPointer(event.clientX, event.clientY);
  });

  function updateViewportHover()
  {
    updateHoverFromPointer(window.innerWidth*0.5, window.innerHeight * 0.5);
  }

  function updatePointer(x, y) 
  {
    mouse.x = (x / window.innerWidth) * 2 - 1
    mouse.y = -(y / window.innerHeight) * 2 + 1
  }

  function handlePick() 
  {
    raycaster.setFromCamera(mouse, camera)
    const hits = raycaster.intersectObjects(interactables)

    document.body.style.cursor = hits.length ? 'pointer' : 'default'

    if (hits.length > 0) {
        onInteract(hits[0].object.userData.parent)
    }
  }

  
  function updateHoverFromPointer(x,y)
  {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactables);

    if (intersects.length > 0) 
    {
      const object = intersects[0].object.userData.parent;

      if (hoveredObject !== object) 
      {
            // Restore previous object's material
           if (hoveredObject) restoreMaterial(hoveredObject);

            // Highlight new object
            highlightObject(object);
            hoveredObject = object;
      }

        document.body.style.cursor = 'pointer';
    } 
    else 
    {
        // No object hovered
        if (hoveredObject) restoreMaterial(hoveredObject);
        hoveredObject = null;
        document.body.style.cursor = 'default';
    }
  };
  
  function updateAnimatedTarget() 
  {
    animatedTarget.lerp(desiredTarget, 0.08)
    controls.target.copy(animatedTarget)
  }

// === Helper functions ===
function highlightObject(object) 
{
    object.traverse((child) => 
    {
        if (child.isMesh) 
        {
            // Store original material for restoration
            if (!child.userData.originalMaterial) {
                child.userData.originalMaterial = child.material.clone();
            }

            // Example: change color or make it emissive
            child.material = child.material.clone();
            if (child.material.color) child.material.color.set(0xffff66); // yellow highlight
            if (child.material.emissive) child.material.emissive.set(0x222222); // subtle glow
        }
    });
  }

  function restoreMaterial(object) 
  {
    object.traverse((child) => 
    {
        if (child.isMesh && child.userData.originalMaterial) 
        {
            child.material.dispose();
            child.material = child.userData.originalMaterial;
            delete child.userData.originalMaterial;
        }
    });
  }
};
