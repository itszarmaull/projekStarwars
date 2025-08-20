const fetchData = async () => {
  const idInput = document.getElementById("charId").value;
  const type = document.getElementById("typeSelect").value;
  const result = document.getElementById("result");

  if (!idInput) {
    result.innerHTML = `<p class="text-red-500 font-bold">Masukkan ID dulu!</p>`;
    return;
  }

  try {
    const res = await axios.get(
      `https://swapi-node.vercel.app/api/${type}/${idInput}`
    );
    const data = res.data.fields;

    if (type === "planets") {
      result.innerHTML = `
        <h2 class="text-2xl font-bold text-yellow-400 mb-3">${data.name}</h2>
        <p><strong>Diameter:</strong> ${data.diameter}</p>
        <p><strong>Rotasi:</strong> ${data.rotation_period}</p>
        <p><strong>Iklim:</strong> ${data.climate}</p>
        <p><strong>Populasi:</strong> ${data.population}</p>
        <p><strong>URL:</strong> <a href="https://swapi-node.vercel.app${data.url}" target="_blank" class="text-blue-400 underline">${data.url}</a></p>
      `;
    } else {
      result.innerHTML = `
        <h2 class="text-2xl font-bold text-yellow-400 mb-3">${data.name}</h2>
        <p><strong>Gender:</strong> ${data.gender}</p>
        <p><strong>Tinggi:</strong> ${data.height} cm</p>
        <p><strong>Massa:</strong> ${data.mass} kg</p>
        <p><strong>URL:</strong> <a href="https://swapi-node.vercel.app${data.url}" target="_blank" class="text-blue-400 underline">${data.url}</a></p>
      `;
    }
  } catch (err) {
    console.error(err);
    result.innerHTML = `<p class="text-red-500 font-bold">${type} dengan ID ${idInput} tidak ditemukan!</p>`;
  }
};

const renderCards = async () => {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";
  for (let id = 1; id <= 10; id++) {
    try {
      const resPlanet = await axios.get(
        `https://swapi-node.vercel.app/api/planets/${id}`
      );
      const planet = resPlanet.data.fields;

      const card = document.createElement("div");
      card.className =
        "bg-gray-800 p-5 rounded-xl shadow-md card-hover fade-in relative";
      card.innerHTML = `
        <h3 class="text-xl font-bold text-yellow-300 mb-2">${planet.name}</h3>
        <p><strong>Iklim:</strong> ${planet.climate}</p>
        <p><strong>Medan:</strong> ${planet.terrain}</p>
        <p><strong>Populasi:</strong> ${planet.population}</p>
        <p><a href="https://swapi-node.vercel.app${planet.url}" target="_blank" class="text-blue-400 underline">Detail &rarr;</a></p>
      `;
      container.appendChild(card);
    } catch {}
  }

  for (let id = 1; id <= 10; id++) {
    try {
      const resPeople = await axios.get(
        `https://swapi-node.vercel.app/api/people/${id}`
      );
      const person = resPeople.data.fields;

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
    } catch {}
  }
};

document.addEventListener("DOMContentLoaded", () => {
  renderCards();
  document.getElementById("searchBtn").addEventListener("click", fetchData);
});

// Three.js Background
let scene,
  camera,
  renderer,
  objects = [];
let mouseX = 0,
  mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function init3D() {
  scene = new THREE.Scene();
  const light = new THREE.AmbientLight(0xaaaaaa);
  scene.add(light);

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

  objects.forEach((obj) => {
    obj.rotation.y += obj.userData.rotationSpeed;
    obj.rotation.x += obj.userData.rotationSpeed * 0.5;
  });

  renderer.render(scene, camera);
}

window.onload = function () {
  init3D();
  animate3D();
};
