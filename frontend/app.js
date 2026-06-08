const API_BASE = "http://localhost:8000/api";
const catalogoProductos = document.getElementById("catalogoProductos");
const formContacto = document.getElementById("formContacto");
const contactResponse = document.getElementById("contactResponse");
const bannerCookies = document.getElementById("bannerCookies");
const acceptCookiesButton = document.getElementById("acceptCookiesButton");
const temaToggle = document.getElementById("temaToggle");
const cartButton = document.getElementById("openCartButton");
const cartPanel = document.getElementById("cartPanel");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCloseButton = document.getElementById("cartCloseButton");
const cartEmptyText = document.getElementById("cartEmptyText");
const checkoutItemsContainer = document.getElementById("checkoutItems");
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutMessage = document.getElementById("checkoutMessage");
const toastMessage = document.getElementById("toastMessage");
let toastTimer = null;
const toastDelay = 4000;

const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: "Remera Terracota",
    category: "Camiseta",
    description: "Remera suave con corte moderno y estampado minimalista.",
    price: "$45.990",
    image_path: "assets/images/productos/remera_01.webp",
    sizes: ["S", "M", "L"],
    colors: ["Terracota", "Negro", "Beige"],
    stock: 18,
  },
  {
    id: 2,
    name: "Saco Ejecutivo",
    category: "Saco",
    description: "Saco semi-formal con forro cómodo y acabado premium.",
    price: "$89.990",
    image_path: "assets/images/productos/saco_01.webp",
    sizes: ["S", "M", "L"],
    colors: ["Azul Marino", "Gris", "Negro"],
    stock: 12,
  },
  {
    id: 3,
    name: "Pantalón Chino",
    category: "Pantalón",
    description: "Pantalón chino de corte ajustado, ideal para looks casuales o formales.",
    price: "$59.990",
    image_path: "assets/images/productos/pantalon_01.webp",
    sizes: ["S", "M", "L"],
    colors: ["Verde Oliva", "Beige", "Negro"],
    stock: 20,
  },
];

function createElementFromHTML(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn("No se pudo obtener productos desde API, usando datos locales:", err);
    return SAMPLE_PRODUCTS;
  }
}

function renderProductCard(product) {
  if (!catalogoProductos) return;
  const sizes = product.sizes.join(", ");
  const colors = product.colors.join(", ");
  const item = createElementFromHTML(`
    <article class="prenda">
      <img class="prenda__imagen" src="${product.image_path}" alt="${product.name} en color ${product.colors[0]}" loading="lazy" />
      <div class="prenda__detalle">
        <span class="prenda__categoria">${product.category}</span>
        <h3 class="prenda__titulo">${product.name}</h3>
        <p class="prenda__texto">${product.description}</p>
        <div class="prenda__info">
          <span class="prenda__precio">${product.price}</span>
          <span class="prenda__meta">Talles: ${sizes}</span>
        </div>
        <div class="prenda__formulario">
          <select class="prenda__selector" aria-label="Seleccionar talle" name="size">
            ${product.sizes.map((size) => `<option value="${size}">${size}</option>`).join("")}
          </select>
          <select class="prenda__selector" aria-label="Seleccionar color" name="color">
            ${product.colors.map((color) => `<option value="${color}">${color}</option>`).join("")}
          </select>
          <button class="boton boton--principal prenda__boton" type="button">Agregar al carrito</button>
        </div>
      </div>
    </article>
  `);

  const botonAgregar = item.querySelector(".prenda__boton");
  botonAgregar.addEventListener("click", () => {
    const size = item.querySelector("select[name='size']").value;
    const color = item.querySelector("select[name='color']").value;
    handleAddToCart(product, size, color);
  });

  const img = item.querySelector(".prenda__imagen");
  if (img) {
    img.addEventListener("error", () => {
      img.onerror = null;
      img.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22280%22 viewBox=%220 0 400 280%22%3E%3Crect width=%22400%22 height=%22280%22 fill=%22%23dddddd%22/%3E%3Ctext x=%2220%22 y=%22160%22 font-family=%22Arial,Helvetica,sans-serif%22 font-size=%2220%22 fill=%22%23666666%22%3EImagen no disponible%3C/text%3E%3C/svg%3E';
    });
  }

  catalogoProductos.appendChild(item);
}

function handleAddToCart(product, size, color) {
  const currentCart = JSON.parse(sessionStorage.getItem("carritoModaUrbana") || "[]");
  currentCart.push({
    id: product.id,
    name: product.name,
    size,
    color,
    price: product.price,
    timestamp: Date.now(),
  });
  setCartItems(currentCart);
  updateCartCount();
  if (cartPanel && !cartPanel.classList.contains("carrito--oculto")) {
    renderCart();
  }
  showToast(`Ya se agregó ${product.name} al carrito. Talle ${size}, color ${color}.`, "success");
}

function showFormAlert(message, type = "error") {
  if (!contactResponse) {
    return;
  }
  contactResponse.textContent = message;
  contactResponse.style.color = type === "success" ? "var(--color-accent)" : "#b44444";
  setTimeout(() => {
    contactResponse.textContent = "";
  }, toastDelay);
}

function showToast(message, type = "success") {
  if (!toastMessage) {
    return;
  }
  toastMessage.textContent = message;
  toastMessage.classList.remove("toast--success", "toast--error");
  toastMessage.classList.add("toast--visible", `toast--${type}`);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.classList.remove("toast--visible", "toast--success", "toast--error");
  }, toastDelay);
}

function getCartItems() {
  return JSON.parse(sessionStorage.getItem("carritoModaUrbana") || "[]");
}

function setCartItems(items) {
  sessionStorage.setItem("carritoModaUrbana", JSON.stringify(items));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value);
}

function calculateCartTotal(items) {
  return items.reduce((sum, item) => {
    const raw = item.price.replace(/[^0-9,.-]/g, "").replace(/\./g, "").replace(/,/, ".");
    const numeric = Number(raw) || 0;
    return sum + numeric;
  }, 0);
}

function updateCartCount() {
  if (!cartButton) return;
  const total = getCartItems().length;
  cartButton.textContent = `Carrito (${total})`;
}

function renderCart() {
  if (!cartItemsContainer || !cartTotal || !cartEmptyText) return;

  const items = getCartItems();
  cartItemsContainer.innerHTML = "";

  if (!items.length) {
    cartEmptyText.classList.remove("oculto");
    cartTotal.textContent = formatCurrency(0);
    return;
  }

  cartEmptyText.classList.add("oculto");

  items.forEach((item, index) => {
    const itemRow = document.createElement("div");
    itemRow.className = "carrito__item";
    itemRow.innerHTML = `
      <div>
        <p class="carrito__item-nombre">${item.name}</p>
        <p class="carrito__item-meta">Talle ${item.size} · ${item.color}</p>
      </div>
      <div class="carrito__item-control">
        <span class="carrito__item-precio">${item.price}</span>
        <button class="boton boton--secundario carrito__item-boton" type="button" data-index="${index}">Eliminar</button>
      </div>
    `;

    const removeButton = itemRow.querySelector(".carrito__item-boton");
    removeButton.addEventListener("click", () => handleRemoveFromCart(index));

    cartItemsContainer.appendChild(itemRow);
  });

  cartTotal.textContent = formatCurrency(calculateCartTotal(items));
}

function handleRemoveFromCart(index) {
  const items = getCartItems();
  items.splice(index, 1);
  setCartItems(items);
  updateCartCount();
  renderCart();
  showFormAlert("Eliminaste un artículo del carrito.", "success");
}

function toggleCartPanel() {
  if (!cartPanel) return;
  cartPanel.classList.toggle("carrito--oculto");
  if (!cartPanel.classList.contains("carrito--oculto")) {
    renderCart();
  }
}

function loadCart() {
  updateCartCount();
}

function isCheckoutPage() {
  return Boolean(document.getElementById("checkoutPage"));
}

function renderCheckoutSummary() {
  if (!checkoutItemsContainer || !checkoutTotal) return;

  const items = getCartItems();
  checkoutItemsContainer.innerHTML = "";

  if (!items.length) {
    checkoutItemsContainer.innerHTML = "<p class='checkout__empty'>No hay productos en el carrito. Regresa a la tienda para agregar uno.</p>";
    checkoutTotal.textContent = formatCurrency(0);
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "checkout__item";
    row.innerHTML = `
      <div>
        <p class="checkout__item-name">${item.name}</p>
        <p class="checkout__item-meta">Talle ${item.size} · ${item.color}</p>
      </div>
      <span class="checkout__item-price">${item.price}</span>
    `;
    checkoutItemsContainer.appendChild(row);
  });

  checkoutTotal.textContent = formatCurrency(calculateCartTotal(items));
}

function clearCart() {
  setCartItems([]);
  updateCartCount();
}

function showCheckoutAlert(message, type = "error") {
  if (!checkoutMessage) return;
  checkoutMessage.textContent = message;
  checkoutMessage.style.color = type === "success" ? "var(--color-accent)" : "#b44444";
}

function handleGoToCheckout() {
  const items = getCartItems();
  if (!items.length) {
    showToast("El carrito está vacío. Agrega productos antes de pagar.", "error");
    return;
  }
  window.location.href = "checkout.html";
}

function loadCheckoutPage() {
  if (!isCheckoutPage()) return;
  renderCheckoutSummary();
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", handlePaymentSubmit);
    const inputs = Array.from(checkoutForm.querySelectorAll("input"));
    inputs.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
    });
  }
}

function handlePaymentSubmit(event) {
  event.preventDefault();
  if (!checkoutForm) return;

  const nameField = document.getElementById("paymentName");
  const emailField = document.getElementById("paymentEmail");
  const addressField = document.getElementById("paymentAddress");
  const cardField = document.getElementById("paymentCard");
  const expiryField = document.getElementById("paymentExpiry");
  const cvcField = document.getElementById("paymentCvc");

  const validName = validateField(nameField);
  const validEmail = validateField(emailField);
  const validAddress = validateField(addressField);
  const validCard = validateField(cardField);
  const validExpiry = validateField(expiryField);
  const validCvc = validateField(cvcField);

  if (!validName || !validEmail || !validAddress || !validCard || !validExpiry || !validCvc) {
    showCheckoutAlert("Completa todos los campos para finalizar el pago.");
    return;
  }

  const items = getCartItems();
  if (!items.length) {
    showCheckoutAlert("No hay artículos en el carrito.");
    return;
  }

  clearCart();
  renderCheckoutSummary();
  showCheckoutAlert("Pago procesado correctamente. Gracias por tu compra.", "success");
  checkoutForm.reset();
}

function validateField(field) {
  const feedback = field.parentElement.querySelector(".formulario__feedback");
  if (!field.value.trim()) {
    field.classList.add("formulario__control--error");
    if (feedback) {
      feedback.textContent = "Este campo es obligatorio.";
    }
    return false;
  }
  if (field.type === "email") {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validEmail.test(field.value.trim())) {
      field.classList.add("formulario__control--error");
      if (feedback) {
        feedback.textContent = "Ingresa un correo válido.";
      }
      return false;
    }
  }
  field.classList.remove("formulario__control--error");
  if (feedback) {
    feedback.textContent = "";
  }
  return true;
}

async function handleContactSubmit(event) {
  event.preventDefault();
  const nameField = document.getElementById("contactName");
  const emailField = document.getElementById("contactEmail");
  const messageField = document.getElementById("contactMessage");

  const validName = validateField(nameField);
  const validEmail = validateField(emailField);
  const validMessage = validateField(messageField);

  if (!validName || !validEmail || !validMessage) {
    showFormAlert("Revisa los campos marcados y vuelve a intentar.");
    return;
  }

  const payload = {
    name: nameField.value.trim(),
    email: emailField.value.trim(),
    message: messageField.value.trim(),
  };

  try {
    const response = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error("No se pudo enviar el formulario");
    }
    nameField.value = "";
    emailField.value = "";
    messageField.value = "";
    showFormAlert("Consulta enviada. Gracias por contactarnos.", "success");
  } catch (error) {
    showFormAlert("No se pudo enviar la consulta. Intenta más tarde.");
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem("storeTheme");
  if (savedTheme === "dark") {
    document.body.classList.add("pagina--oscuro");
    temaToggle.textContent = "Modo claro";
  } else {
    document.body.classList.remove("pagina--oscuro");
    temaToggle.textContent = "Modo oscuro";
  }
}

function toggleTheme() {
  document.body.classList.toggle("pagina--oscuro");
  const isDark = document.body.classList.contains("pagina--oscuro");
  localStorage.setItem("storeTheme", isDark ? "dark" : "light");
  temaToggle.textContent = isDark ? "Modo claro" : "Modo oscuro";
}

function loadCookieBanner() {
  const accepted = localStorage.getItem("cookiesModaUrbana");
  if (accepted === "true") {
    bannerCookies.classList.add("cookie-banner--oculto");
  }
}

function acceptCookies() {
  localStorage.setItem("cookiesModaUrbana", "true");
  bannerCookies.classList.add("cookie-banner--oculto");
}

async function reportAnalytics(eventName, details) {
  try {
    await fetch(`${API_BASE}/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: eventName, details }),
    });
  } catch (error) {
    console.warn("Analytics no disponible", error);
  }
}

async function init() {
  loadTheme();
  loadCookieBanner();

  if (bannerCookies && acceptCookiesButton) {
    acceptCookiesButton.addEventListener("click", acceptCookies);
  }

  if (temaToggle) {
    temaToggle.addEventListener("click", toggleTheme);
  }

  if (cartButton) {
    cartButton.addEventListener("click", toggleCartPanel);
  }

  if (cartCloseButton) {
    cartCloseButton.addEventListener("click", toggleCartPanel);
  }

  const cartPurchaseButton = document.querySelector(".carrito__comprar");
  if (cartPurchaseButton) {
    cartPurchaseButton.addEventListener("click", handleGoToCheckout);
  }

  loadCart();
  loadCheckoutPage();

  if (formContacto) {
    formContacto.addEventListener("submit", handleContactSubmit);
    const inputs = Array.from(formContacto.querySelectorAll("input, textarea"));
    inputs.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
    });
  }

  const products = await fetchProducts();
  products.forEach(renderProductCard);
}

init();

