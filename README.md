# BigApple - Tienda Online

BigApple es un simulador que permite a los usuarios explorar productos de Apple, agregarlos a un carrito y simular un encargue del producto que desean, generando un resumen de compra con precios e IVA.

---

## 🚀 Funcionalidades principales

1. **Navegación por categorías**

   - Los productos se pueden filtrar por categoría: Mac, iPad, iPhone, Watch, AirPods.

2. **Carrito de compras dinámico**

   - Agregar, eliminar o modificar cantidad de productos.
   - El carrito se mantiene en **localStorage** para persistir la sesión.

3. **Resumen de compra**

   - Al finalizar la compra, se valida que los campos de nombre, email y dirección estén completos.
   - Se muestra un **resumen con Subtotal, IVA y Total final** usando SweetAlert.

4. **Validación de formulario**

   - Si algún campo está vacío, se alerta al usuario y no se procesa la compra.

5. **Interfaz amigable**
   - Productos con imagen, descripción, stock y botón de agregar.
   - Carrito lateral con botones para sumar, restar o eliminar productos.
   - Total actualizado automáticamente.

---

## 🛠️Tecnologías utilizadas

- **HTML5** – Estructura de la página.
- **CSS3** – Estilos y diseño responsivo.
- **JavaScript (ES6)** – Lógica de la tienda, manejo de carrito y validaciones.
- **SweetAlert2** – Alertas personalizadas y resumen de compra.
- **LocalStorage** – Persistencia del carrito entre sesiones.
- **JSON** – Almacenamiento de información de productos.

---

## ⚙️ Instalación

- Clonar el repositorio
  git clone https://github.com/carocook/ProyectoFinalJS-Cook.git

---

## Uso

1. Seleccionar una categoría desde la barra superior.
2. Explorar los productos disponibles.
3. Agregar productos al carrito usando los botones correspondientes.
4. Revisar el carrito y ajustar cantidades si se desea.
5. Completar los datos en el formulario de checkout.
6. Hacer clic en **Finalizar compra** para ver el resumen de compra.

---

## 👩🏼‍💻 Autora

Carolina Cook
