const professionals = [
  { name: "Javier Mena", role: "Técnico en computación", specialty: "Técnicos", city: "Quito · La Carolina", review: "Identidad revisada · Ejemplo", tone: "" },
  { name: "María Fernanda Ruiz", role: "Carpintera y ebanista", specialty: "Artesanos y oficios", city: "Quito · Cumbayá", review: "Experiencia validada · Ejemplo", tone: "tone-2" },
  { name: "Andrés Cedeño", role: "Electricista residencial", specialty: "Técnicos", city: "Guayaquil · Urdesa", review: "Identidad revisada · Ejemplo", tone: "tone-3" },
  { name: "Daniela Paredes", role: "Diseñadora gráfica", specialty: "Profesionales", city: "Cuenca · Centro", review: "Profesional evaluado · Ejemplo", tone: "tone-4" }
];

const profileGrid = document.querySelector("#professional-grid");
const categoryFilter = document.querySelector("#category-filter");
const emptyState = document.querySelector("#empty-state");
const toast = document.querySelector("#toast");
let searchTerm = "";
let locationTerm = "";
let toastTimeout;

function renderProfessionals() {
  const selectedCategory = categoryFilter.value;
  const filtered = professionals.filter((person) => {
    const matchesCategory = !selectedCategory || person.specialty === selectedCategory;
    const searchable = `${person.name} ${person.role} ${person.specialty} ${person.city}`.toLocaleLowerCase("es");
    const matchesSearch = !searchTerm || searchable.includes(searchTerm);
    const matchesLocation = !locationTerm || person.city.toLocaleLowerCase("es").includes(locationTerm);
    return matchesCategory && matchesSearch && matchesLocation;
  });

  profileGrid.replaceChildren(...filtered.map((person) => {
    const card = document.createElement("article");
    card.className = "professional-card";
    card.innerHTML = `
      <div class="profile-art ${person.tone}">
        <span class="profile-specialty">${person.specialty}</span>
        <span class="profile-head" aria-hidden="true"></span>
      </div>
      <div class="profile-content">
        <h3 class="profile-name">${person.name}</h3>
        <p class="profile-role">${person.role}</p>
        <p class="profile-location"><span aria-hidden="true">⌖</span>${person.city}</p>
        <div class="verification-tag demo-tag"><span aria-hidden="true">!</span>${person.review}</div>
        <button class="profile-contact" type="button" data-profile="${professionals.indexOf(person)}">Solicitar información <span aria-hidden="true">↗</span></button>
      </div>`;
    return card;
  }));
  emptyState.hidden = filtered.length !== 0;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 3800);
}

document.querySelector("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  searchTerm = document.querySelector("#service-search").value.trim().toLocaleLowerCase("es");
  locationTerm = document.querySelector("#location-search").value.trim().toLocaleLowerCase("es");
  categoryFilter.value = "";
  renderProfessionals();
  document.querySelector("#profesionales").scrollIntoView({ behavior: "smooth" });
});

categoryFilter.addEventListener("change", renderProfessionals);

document.querySelectorAll(".category-card").forEach((card) => {
  card.addEventListener("click", () => {
    categoryFilter.value = card.dataset.category;
    searchTerm = "";
    locationTerm = "";
    document.querySelector("#service-search").value = "";
    document.querySelector("#location-search").value = "";
    renderProfessionals();
    document.querySelector("#profesionales").scrollIntoView({ behavior: "smooth" });
  });
});

profileGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-profile]");
  if (!button) return;
  const person = professionals[Number(button.dataset.profile)];
  showToast(`Perfil de ejemplo: el contacto con ${person.name} estará disponible cuando la plataforma esté activa.`);
});

document.querySelector("#join-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const formData = new FormData(form);
  const application = {
    name: String(formData.get("name")).trim(),
    email: String(formData.get("email")).trim(),
    specialty: String(formData.get("specialty")),
    city: String(formData.get("city")).trim(),
    submittedAt: new Date().toISOString()
  };
  const storageKey = "confiaservicios-applications";

  try {
    const savedApplications = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (!Array.isArray(savedApplications)) throw new Error("El formato de postulaciones guardadas no es válido.");
    savedApplications.push(application);
    localStorage.setItem(storageKey, JSON.stringify(savedApplications));
    document.querySelector("#form-message").textContent = "Postulación guardada en este navegador. No se ha enviado a un servidor.";
    form.reset();
  } catch (error) {
    document.querySelector("#form-message").textContent = "No pudimos guardar tu postulación en este navegador. Revisa el almacenamiento disponible e inténtalo de nuevo.";
    console.error("No se pudo guardar la postulación local.", error);
  }
});

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  mainNav.classList.toggle("open", !isExpanded);
});
mainNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

renderProfessionals();
