const ADMIN_API = window.location.protocol === "file:" ? "http://localhost:8000/api" : "/api";
const adminLoginForm = document.getElementById("adminLoginForm");
const adminLoginSection = document.getElementById("adminLoginSection");
const adminDashboard = document.getElementById("adminDashboard");
const adminLoginError = document.getElementById("adminLoginError");
const adminLogoutButton = document.getElementById("adminLogoutButton");
const leadsCount = document.getElementById("leadsCount");
const productsCount = document.getElementById("productsCount");
const leadsTable = document.getElementById("leadsTable");
const mensajesGrafico = document.getElementById("mensajesGrafico");
const adminProductsList = document.getElementById("adminProductsList");
let chartInstance = null;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function showAdminError(message) {
  if (!adminLoginError) return;
  adminLoginError.textContent = message;
  setTimeout(() => {
    adminLoginError.textContent = "";
  }, 5000);
}

function renderLeads(leads) {
  leadsTable.innerHTML = "";
  if (!leads.length) {
    leadsTable.innerHTML = "<p>No hay mensajes aún.</p>";
    return;
  }

  leads.forEach((lead) => {
    const row = document.createElement("div");
    row.className = "tabla__fila";
    row.innerHTML = `
      <div>
        <p class="tabla__item"><strong>${lead.name}</strong></p>
        <p class="tabla__item">${lead.email}</p>
      </div>
      <div class="tabla__item">${new Date(lead.created_at).toLocaleDateString()}</div>
    `;
    leadsTable.appendChild(row);
  });
}

async function loadAdminStats() {
  try {
    const [statsResponse, leadsResponse] = await Promise.all([
      fetch(`${ADMIN_API}/admin/stats`),
      fetch(`${ADMIN_API}/admin/leads`),
    ]);

    if (!statsResponse.ok || !leadsResponse.ok) {
      throw new Error("No se pudo cargar el panel administrativo");
    }

    const stats = await statsResponse.json();
    const leads = await leadsResponse.json();

    leadsCount.textContent = stats.leads_count;
    productsCount.textContent = stats.products_count;
    renderLeads(leads);
    renderChart(leads.length);
  } catch (error) {
    showAdminError("Error al cargar datos. Intenta más tarde.");
  }
}

function renderChart(totalLeads) {
  if (!mensajesGrafico) return;

  const labels = ["Llegadas recientes"];
  const data = {
    labels,
    datasets: [
      {
        label: "Mensajes recibidos",
        data: [totalLeads],
        backgroundColor: ["rgba(197, 71, 71, 0.8)"],
        borderColor: ["rgba(197, 71, 71, 1)"],
        borderWidth: 1,
        borderRadius: 12,
      },
    ],
  };

  if (chartInstance) {
    chartInstance.data = data;
    chartInstance.update();
    return;
  }

  chartInstance = new Chart(mensajesGrafico, {
    type: "bar",
    data,
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "rgba(43, 40, 37, 0.08)" },
        },
      },
    },
  });
}

function setAdminSession(user) {
  sessionStorage.setItem("adminUser", JSON.stringify(user));
}

function clearAdminSession() {
  sessionStorage.removeItem("adminUser");
}

function getAdminSession() {
  const userData = sessionStorage.getItem("adminUser");
  return userData ? JSON.parse(userData) : null;
}

function showDashboard() {
  adminLoginSection.classList.add("oculto");
  adminDashboard.classList.remove("oculto");
  loadAdminStats();
  loadAdminProducts();
}

function showLogin() {
  adminLoginSection.classList.remove("oculto");
  adminDashboard.classList.add("oculto");
}

function showAdminProductMessage(card, message, type = "success") {
  const messageElement = card.querySelector(".producto-admin__mensaje");
  if (!messageElement) return;
  messageElement.textContent = message;
  messageElement.style.color = type === "success" ? "var(--color-accent)" : "#b44444";
}

function createAdminProductCard(product) {
  const card = document.createElement("article");
  card.className = "producto-admin";
  card.dataset.productId = product.id;
  card.innerHTML = `
    <img class="producto-admin__imagen" src="${escapeHtml(product.image_path)}" alt="${escapeHtml(product.name)}" />
    <div class="producto-admin__contenido">
      <div class="producto-admin__campo">
        <label>Nombre</label>
        <input class="formulario__control" name="name" value="${escapeHtml(product.name)}" />
      </div>
      <div class="producto-admin__campo">
        <label>Precio</label>
        <input class="formulario__control" name="price" value="${escapeHtml(product.price)}" />
      </div>
      <div class="producto-admin__campo">
        <label>Talles (comma separado)</label>
        <input class="formulario__control" name="sizes" value="${escapeHtml(product.sizes.join(","))}" />
      </div>
      <div class="producto-admin__campo">
        <label>Colores (comma separado)</label>
        <input class="formulario__control" name="colors" value="${escapeHtml(product.colors.join(","))}" />
      </div>
      <div class="producto-admin__campo">
        <label>Stock</label>
        <input class="formulario__control" type="number" min="0" name="stock" value="${escapeHtml(product.stock)}" />
      </div>
      <div class="producto-admin__campo">
        <label>Descripción</label>
        <textarea class="formulario__control" name="description" rows="3">${escapeHtml(product.description)}</textarea>
      </div>
      <div class="producto-admin__file">
        <input class="formulario__control producto-admin__file-input" type="file" accept="image/*" />
        <button class="boton boton--secundario producto-admin__boton" type="button" data-action="upload-image">Subir nueva imagen</button>
      </div>
      <div class="producto-admin__acciones">
        <button class="boton boton--principal producto-admin__boton" type="button" data-action="update">Guardar cambios</button>
      </div>
      <p class="producto-admin__mensaje"></p>
    </div>
  `;

  const updateButton = card.querySelector("[data-action='update']");
  const uploadButton = card.querySelector("[data-action='upload-image']");
  const fileInput = card.querySelector(".producto-admin__file-input");

  updateButton.addEventListener("click", () => handleAdminProductUpdate(product.id, card));
  uploadButton.addEventListener("click", () => handleAdminImageUpload(product.id, card, fileInput));

  return card;
}

async function renderAdminProducts(products) {
  if (!adminProductsList) return;
  adminProductsList.innerHTML = "";
  if (!products.length) {
    adminProductsList.innerHTML = "<p>No hay productos para editar.</p>";
    return;
  }

  products.forEach((product) => {
    adminProductsList.appendChild(createAdminProductCard(product));
  });
}

async function loadAdminProducts() {
  try {
    const response = await fetch(`${ADMIN_API}/admin/products`);
    if (!response.ok) {
      throw new Error("No se pudieron cargar los productos");
    }
    const products = await response.json();
    renderAdminProducts(products);
  } catch (error) {
    showAdminError("Error al cargar productos. Intenta nuevamente.");
  }
}

async function handleAdminProductUpdate(productId, card) {
  try {
    const payload = {
      name: card.querySelector("input[name='name']").value.trim(),
      price: card.querySelector("input[name='price']").value.trim(),
      sizes: card.querySelector("input[name='sizes']").value.split(",").map((s) => s.trim()).filter(Boolean),
      colors: card.querySelector("input[name='colors']").value.split(",").map((c) => c.trim()).filter(Boolean),
      stock: Number(card.querySelector("input[name='stock']").value),
      description: card.querySelector("textarea[name='description']").value.trim(),
    };

    const response = await fetch(`${ADMIN_API}/admin/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("No se pudieron guardar los cambios");
    }

    await loadAdminProducts();
    showAdminProductMessage(card, "Producto actualizado correctamente.");
  } catch (error) {
    showAdminProductMessage(card, "Error al guardar producto.", "error");
  }
}

async function handleAdminImageUpload(productId, card, fileInput) {
  const file = fileInput.files?.[0];
  if (!file) {
    showAdminProductMessage(card, "Selecciona un archivo de imagen primero.", "error");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`${ADMIN_API}/admin/products/${productId}/image`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("No se pudo subir la imagen");
    }

    const result = await response.json();
    const imageElement = card.querySelector(".producto-admin__imagen");
    if (imageElement) {
      imageElement.src = `${result.image_path}?t=${Date.now()}`;
    }
    fileInput.value = "";
    showAdminProductMessage(card, "Imagen actualizada correctamente.");
  } catch (error) {
    showAdminProductMessage(card, "Error al subir la imagen.", "error");
  }
}

function showLogin() {
  adminLoginSection.classList.remove("oculto");
  adminDashboard.classList.add("oculto");
}

async function handleAdminLogin(event) {
  event.preventDefault();
  const username = document.getElementById("adminUsername").value.trim();
  const password = document.getElementById("adminPassword").value.trim();

  if (!username || !password) {
    showAdminError("Completa usuario y contraseña.");
    return;
  }

  try {
    const response = await fetch(`${ADMIN_API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      let errorMessage = "Credenciales inválidas";
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.detail || errorMessage;
      } catch {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    if (result.role !== "Administrador") {
      showAdminError("Acceso denegado. Solo administradores pueden entrar.");
      return;
    }

    setAdminSession(result);
    showDashboard();
  } catch (error) {
    showAdminError(error.message);
  }
}

function handleLogout() {
  clearAdminSession();
  showLogin();
}

function initAdminPage() {
  const session = getAdminSession();
  if (session && session.role === "Administrador") {
    showDashboard();
  } else {
    showLogin();
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", handleAdminLogin);
  }

  if (adminLogoutButton) {
    adminLogoutButton.addEventListener("click", handleLogout);
  }
}

initAdminPage();
