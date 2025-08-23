// Funcion constructora
function Producto(id, nombre, precio) {
  this.id = id;
  this.nombre = nombre;
  this.precio = precio;
}

function ItemCarrito(producto, cantidad) {
  this.producto = producto;
  this.cantidad = cantidad;
}

// Clase carrito
class Carrito {
  constructor() {
    this.items =
      JSON.parse(localStorage.getItem("carrito"))?.map((item) => {
        const producto = new Producto(
          item.producto.id,
          item.producto.nombre,
          item.producto.precio
        );
        return new ItemCarrito(producto, item.cantidad);
      }) || [];
  }

  agregar(idProducto) {
    const index = this.items.findIndex(
      (item) => item.producto.id === idProducto
    );
    if (index !== -1) {
      this.items[index].cantidad++;
    } else {
      const producto = productos.find((p) => p.id === idProducto);
      if (producto) {
        this.items.push(new ItemCarrito(producto, 1));
      }
    }
    this.guardar();
  }

  restar(idProducto) {
    const index = this.items.findIndex(
      (item) => item.producto.id === idProducto
    );
    if (index !== -1) {
      this.items[index].cantidad--;
      if (this.items[index].cantidad <= 0) {
        this.items.splice(index, 1);
      }
      this.guardar();
    }
  }

  eliminar(idProducto) {
    this.items = this.items.filter((item) => item.producto.id !== idProducto);
    this.guardar();
  }

  vaciar() {
    this.items = [];
    this.guardar();
  }

  guardar() {
    localStorage.setItem("carrito", JSON.stringify(this.items));
  }

  calcularTotal() {
    return this.items.reduce((total, item) => {
      const subtotal = item.producto.precio * item.cantidad;
      const iva = subtotal * 0.21;
      return total + subtotal + iva;
    }, 0);
  }
}

// Productos
const productos = [
  new Producto(1, "Apple Watch SE ⌚️", 350000),
  new Producto(2, "Apple Watch Serie 10 ⌚️", 850000),
  new Producto(3, "Apple Watch Ultra 2 ⌚️", 1500000),
  new Producto(4, "iPhone 15 📱", 950000),
  new Producto(5, "iPhone 15 Pro 📱", 1500000),
  new Producto(6, "iPhone 15 Pro Max 📱", 1800000),
  new Producto(7, "MacBook Air 💻", 1650000),
  new Producto(8, "MacBook Pro 💻", 3250000),
  new Producto(9, "iMac 🖥️", 4000000),
  new Producto(10, "iPad Mini📱", 650000),
  new Producto(11, "iPad Air📱", 850000),
  new Producto(12, "iPad Pro📱", 1200000),
  new Producto(13, "AirPods 4 🎧", 300000),
  new Producto(14, "AirPods Pro 2 🎧", 390000),
  new Producto(15, "AirPods Max 🎧", 750000),
];

// DOM
const productosContainer = document.getElementById("productos-container");
const carritoLista = document.getElementById("carrito-lista");
const totalFinal = document.getElementById("total-final");
const btnVaciar = document.getElementById("vaciar-carrito");

// ==== Carrito ====
const carrito = new Carrito();

// Renderizado
function renderProductos() {
  productos.forEach((producto) => {
    const card = document.createElement("div");
    card.classList.add("producto");
    card.innerHTML = `
      <h3>${producto.nombre}</h3>
      <p>Precio: $${producto.precio.toLocaleString("es-AR")}</p>
      <button data-id="${producto.id}">Agregar al carrito</button>
    `;
    productosContainer.appendChild(card);
  });
}

// Renderizado
function renderCarrito() {
  carritoLista.innerHTML = "";

  carrito.items.forEach((item) => {
    const subtotal = item.producto.precio * item.cantidad;
    const iva = subtotal * 0.21;
    const total = subtotal + iva;

    const li = document.createElement("li");
    li.innerHTML = `
      <span class="descripcion">
        ${
          item.producto.nombre
        } - Precio: $${item.producto.precio.toLocaleString("es-AR")} x ${
      item.cantidad
    } | IVA: $${iva.toFixed(2)} | Total: $${total.toFixed(2)}
      </span>
      <div class="botones-carrito">
        <button class="sumar-btn" data-id="${item.producto.id}">➕</button>
        <button class="restar-btn" data-id="${item.producto.id}">➖</button>
        <button class="eliminar-btn" data-id="${item.producto.id}">🗑️</button>
      </div>
    `;
    carritoLista.appendChild(li);
  });

  totalFinal.textContent = `💵 Total facturado: $${carrito
    .calcularTotal()
    .toFixed(2)}`;

  // Eventos
  document.querySelectorAll(".sumar-btn").forEach((btn) => {
    btn.onclick = () => {
      carrito.agregar(parseInt(btn.dataset.id));
      renderCarrito();
    };
  });

  document.querySelectorAll(".restar-btn").forEach((btn) => {
    btn.onclick = () => {
      carrito.restar(parseInt(btn.dataset.id));
      renderCarrito();
    };
  });

  document.querySelectorAll(".eliminar-btn").forEach((btn) => {
    btn.onclick = () => {
      carrito.eliminar(parseInt(btn.dataset.id));
      renderCarrito();
    };
  });
}

// Eventos
productosContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const id = parseInt(e.target.dataset.id);
    carrito.agregar(id);
    renderCarrito();
  }
});

btnVaciar.addEventListener("click", () => {
  carrito.vaciar();
  renderCarrito();
});

renderProductos();
renderCarrito();
