// DOM
const navbar = document.getElementById("categorias");
const productosContainer = document.getElementById("productos-container");
const carritoLista = document.getElementById("carrito-lista");
const totalFinal = document.getElementById("total-final");
const btnVaciar = document.getElementById("vaciar-carrito");
const formUsuario = document.getElementById("form-checkout");

let productos = [];
let carrito = [];

// funcion apara formatear $ argentinos
function formatearPesos(valor) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(valor));
}

// Clases
class ItemCarrito {
  constructor(productoId, varianteIndex, cantidad) {
    this.productoId = productoId;
    this.varianteIndex = varianteIndex;
    this.cantidad = cantidad;
  }
}

function calcularPrecios(precio, cantidad) {
  const subtotal = precio * cantidad;
  const iva = subtotal * 0.21;
  const total = subtotal + iva;
  return { subtotal, iva, total };
}

// LocalStorage
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Carga carrito c/stock actualizado
function cargarCarrito() {
  const data = localStorage.getItem("carrito");
  if (!data) return;

  const carritoGuardado = JSON.parse(data);

  // Resetea stock orgiginal
  productos.forEach((p) =>
    p.variantes.forEach((v) => (v.stock = v.stockOriginal))
  );

  // Ajusta carrito segun stock disponible
  carrito = carritoGuardado
    .map((item) => {
      const producto = productos.find((p) => p.id === item.productoId);
      const variante = producto?.variantes[item.varianteIndex];
      if (!variante) return null; // producto eliminado

      if (variante.stock <= 0) return null; // no hay stock
      if (item.cantidad > variante.stock) item.cantidad = variante.stock;
      variante.stock -= item.cantidad;

      return item;
    })
    .filter((item) => item !== null); // eliminar items nulos

  renderCarrito();
}

// JSON
async function cargarProductos() {
  try {
    const res = await fetch("data/data.json");
    productos = await res.json();

    // Guardar stock original
    productos.forEach((p) =>
      p.variantes.forEach((v) => (v.stockOriginal = v.stock))
    );

    cargarCarrito(); // cargar carrito antes de renderizar
    renderProductos(); // mostrar productos
  } catch (err) {
    console.error("Error al cargar productos:", err);
    productosContainer.innerHTML =
      "<p>No se pudieron cargar los productos.</p>";
  }
}

// Render de productos
function renderProductos(categoria = null) {
  productosContainer.innerHTML = "";
  const filtrados = categoria
    ? productos.filter((p) => p.categoria === categoria)
    : productos;

  filtrados.forEach((producto) => {
    producto.variantes.forEach((variante, index) => {
      const div = document.createElement("div");
      div.classList.add("producto");
      div.innerHTML = `
        <h3>${producto.nombre} - ${variante.color}</h3>
        <img src="${variante.imagen}" alt="${producto.nombre}">
        <p>${producto.descripcion}</p>
        <p>Precio: ${formatearPesos(variante.precio)}</p>
        <p>Stock: ${variante.stock}</p>
        <button data-id="${producto.id}" data-idx="${index}" 
          ${variante.stock === 0 ? "disabled" : ""}>
          ${variante.stock > 0 ? "Agregar al carrito" : "Sin stock"}
        </button>
      `;
      productosContainer.appendChild(div);
    });
  });
}

// Render de carrito
function renderCarrito() {
  carritoLista.innerHTML = "";
  if (carrito.length === 0) {
    carritoLista.innerHTML = "<li>Carrito vacío</li>";
    totalFinal.textContent = "Total: $0,00";
    renderProductos();
    return;
  }

  let totalCompra = 0;

  carrito.forEach((item, i) => {
    const producto = productos.find((p) => p.id === item.productoId);
    const variante = producto.variantes[item.varianteIndex];
    const { subtotal, iva, total } = calcularPrecios(
      variante.precio,
      item.cantidad
    );
    totalCompra += total;

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${producto.nombre} - ${variante.color}</strong><br>
      Cantidad: ${item.cantidad} <br>
      Subtotal: ${formatearPesos(subtotal)} <br>
      IVA: ${formatearPesos(iva)} <br>
      Total: ${formatearPesos(total)} <br>
      <button class="sumar-btn" data-i="${i}">➕</button>
      <button class="restar-btn" data-i="${i}">➖</button>
      <button class="eliminar-btn" data-i="${i}">🗑️</button>
    `;
    carritoLista.appendChild(li);
  });

  totalFinal.textContent = `Total: ${formatearPesos(totalCompra)}`;
  guardarCarrito();
  renderProductos();
}

// Eventos

// Filtra por categoría
navbar.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON")
    renderProductos(e.target.dataset.categoria);
});

// Agrega producto al carrito
productosContainer.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;

  const id = parseInt(e.target.dataset.id);
  const idx = parseInt(e.target.dataset.idx);
  const producto = productos.find((p) => p.id === id);
  const variante = producto.variantes[idx];

  if (variante.stock === 0) {
    Swal.fire(
      "¡Ups!",
      "No hay stock disponible para esta variante.",
      "warning"
    );
    return;
  }

  const itemExistente = carrito.find(
    (i) => i.productoId === id && i.varianteIndex === idx
  );

  if (itemExistente) {
    if (variante.stock > 0) {
      itemExistente.cantidad++;
      variante.stock--;
    } else {
      Swal.fire("¡Ups!", "No hay más stock disponible.", "warning");
    }
  } else {
    carrito.push(new ItemCarrito(id, idx, 1));
    variante.stock--;

    // Notificación de producto agregado
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `${producto.nombre} - ${variante.color} agregado al carrito`,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
  }

  renderCarrito();
});

// ABM carrito
carritoLista.addEventListener("click", (e) => {
  const i = parseInt(e.target.dataset.i);
  if (isNaN(i)) return;

  const item = carrito[i];
  const variante = productos.find((p) => p.id === item.productoId).variantes[
    item.varianteIndex
  ];

  if (e.target.classList.contains("sumar-btn")) {
    if (variante.stock > 0) {
      item.cantidad++;
      variante.stock--;
    } else {
      Swal.fire("¡Ups!", "No hay más stock disponible.", "warning");
    }
  }

  if (e.target.classList.contains("restar-btn")) {
    item.cantidad--;
    variante.stock++;
    if (item.cantidad <= 0) carrito.splice(i, 1);
  }

  if (e.target.classList.contains("eliminar-btn")) {
    variante.stock += item.cantidad;
    carrito.splice(i, 1);
  }

  renderCarrito();
});

// Vacia al carrito
btnVaciar?.addEventListener("click", () => {
  carrito.forEach((item) => {
    const variante = productos.find((p) => p.id === item.productoId).variantes[
      item.varianteIndex
    ];
    variante.stock += item.cantidad;
  });
  carrito = [];
  renderCarrito();
});

// Finalizar compra
formUsuario?.addEventListener("submit", (e) => {
  e.preventDefault();

  if (carrito.length === 0) {
    Swal.fire("Ups!", "El carrito está vacío.", "warning");
    return;
  }

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const direccion = document.getElementById("direccion").value.trim();

  if (!nombre || !email || !direccion) {
    Swal.fire("Ups!", "Por favor completa todos los datos.", "warning");
    return;
  }

  let resumen = `<strong>Usuario:</strong> ${nombre} <br>
                 <strong>Email:</strong> ${email} <br>
                 <strong>Dirección:</strong> ${direccion} <br><hr>`;

  let totalCompra = 0;

  carrito.forEach((item) => {
    const producto = productos.find((p) => p.id === item.productoId);
    const variante = producto.variantes[item.varianteIndex];
    const { subtotal, iva, total } = calcularPrecios(
      variante.precio,
      item.cantidad
    );
    totalCompra += total;

    resumen += `${producto.nombre} - ${variante.color} x ${item.cantidad}<br>
                Subtotal: ${formatearPesos(subtotal)}<br>
                IVA: ${formatearPesos(iva)}<br>
                Total: ${formatearPesos(total)}<br><br>`;
  });

  resumen += `<strong>Total final:</strong> ${formatearPesos(totalCompra)}`;

  Swal.fire({
    title: "Resumen de la compra",
    html: resumen,
    icon: "success",
    confirmButtonText: "OK",
  }).then(() => {
    carrito = [];
    renderCarrito();

    // Notificacion compra finalizada
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Compra finalizada correctamente",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });

    formUsuario.reset();
  });
});

// init
cargarProductos();
localStorage.removeItem("carrito"); // para resetar al carrito por si quedo en memoria algun producto
