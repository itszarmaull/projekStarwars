const fetchCharacter = async (id) => {
  try {
    const res = await axios.get(
      `https://swapi-node.vercel.app/api/people/${id}`
    );
    return res.data.fields;
  } catch {
    return null;
  }
};

const renderPeopleCards = async (searchTerm = "") => {
  const container = document.getElementById("peopleCards");
  container.innerHTML = "";

  for (let id = 1; id <= 20; id++) {
    const person = await fetchCharacter(id);
    if (!person) continue;
    if (
      searchTerm &&
      !person.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
      continue;

    const card = document.createElement("div");
    card.className =
      "bg-gray-800 p-5 rounded-xl shadow-md card-hover fade-in relative";
    card.innerHTML = `
      <h3 class="text-xl font-bold text-yellow-300 mb-2">${person.name}</h3>
      <p><strong>Gender:</strong> ${person.gender}</p>
      <p><strong>Tinggi:</strong> ${person.height} cm</p>
      <p><strong>Massa:</strong> ${person.mass} kg</p>
      <p><a href="https://swapi-node.vercel.app${person.url}" target="_blank" class="text-blue-400 underline">Detail &rarr;</a></p>
    `;
    container.appendChild(card);
  }
};

document.getElementById("searchCharBtn").addEventListener("click", () => {
  const term = document.getElementById("charInput").value;
  renderPeopleCards(term);
});

document.getElementById("charInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const term = document.getElementById("charInput").value;
    renderPeopleCards(term);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  renderPeopleCards();
});

// 3D Background
let scene,
  camera,
  renderer,
  objects = [];
let mouseX = 0,
  mouseY = 0,
  windowHalfX = window.innerWidth / 2,
  windowHalfY = window.innerHeight / 2;

function init3D() {
  scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xaaaaaa));
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 50;
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("bgCanvas"),
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const geometry = new THREE.SphereGeometry(0.5, 16, 16);
  const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });

  for (let i = 0; i < 50; i++) {
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(
      (Math.random() - 0.5) * 200,
      (Math.random() - 0.5) * 200,
      (Math.random() - 0.5) * 200
    );
    sphere.userData.rotationSpeed = Math.random() * 0.01;
    scene.add(sphere);
    objects.push(sphere);
  }

  document.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX - windowHalfX) * 0.05;
    mouseY = (e.clientY - windowHalfY) * 0.05;
  });

  window.addEventListener("resize", () => {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function animate3D() {
  requestAnimationFrame(animate3D);
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);
  objects.forEach((o) => {
    o.rotation.y += o.userData.rotationSpeed;
    o.rotation.x += o.userData.rotationSpeed * 0.5;
  });
  renderer.render(scene, camera);
}

window.onload = function () {
  init3D();
  animate3D();
};
