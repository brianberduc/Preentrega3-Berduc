// Datos de los productos
const productos = [
    { id: 1, nombre: 'Producto 1', categoria: 'Vendas', precio: 50, imagen: 'producto1.jpg' },
    { id: 2, nombre: 'Producto 2', categoria: 'Protesis', precio: 75, imagen: 'producto2.jpg' },
    { id: 3, nombre: 'Producto 3', categoria: 'Ortesis', precio: 120, imagen: 'producto3.jpg' }
];
// Clave donde se almacena el carrito
const CARRITO_KEY = "carrito"
// Variables para el carrito
const carritoLocal = localStorage.getItem(CARRITO_KEY);
let carrito = carritoLocal ? JSON.parse(carritoLocal).carrito: [];
// Elementos del DOM
const productosContainer = document.getElementById('productos');
const carritoLista = document.getElementById('carrito-lista');
const carritoTotal = document.getElementById('total');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const categoriaSelect = document.getElementById('categoria');
const precioInput = document.getElementById('precio');
const precioValor = document.getElementById('valor-precio');
const busquedaInput = document.getElementById('busqueda');
const carritoFlotante = document.getElementById('carrito-flotante');
const minimizarCarritoBtn = document.getElementById('minimizar-carrito');
carrito.length && actualizarCarrito ()
// Mostrar productos
function mostrarProductos(filtro = {}) {
    productosContainer.innerHTML = ''; // Limpiar los productos actuales

    // Filtrar productos según los filtros seleccionados
    const productosFiltrados = productos.filter(producto => {
        let coincide = true;

        // Filtro por categoría
        if (filtro.categoria && filtro.categoria !== 'todos' && producto.categoria.toLowerCase() !== filtro.categoria) {
            coincide = false;
        }

        // Filtro por precio
        if (filtro.precio !== undefined && producto.precio > filtro.precio) {
            coincide = false;
        }

        // Filtro por búsqueda
        if (filtro.busqueda && !producto.nombre.toLowerCase().includes(filtro.busqueda.toLowerCase())) {
            coincide = false;
        }

        return coincide;
    });

    // Renderizar los productos filtrados
    productosFiltrados.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto');
        productoDiv.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio}</p>
            <button class="agregar-carrito" data-id="${producto.id}">Agregar al Carrito</button>
        `;
        productosContainer.appendChild(productoDiv);
    });
}

// Agregar producto al carrito
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    carrito.push(producto);
    actualizarCarrito();
}

// Actualizar la vista del carrito
function actualizarCarrito() {
    carritoLista.innerHTML = ''; // Limpiar lista del carrito
    let total = 0;

    // Renderizar los productos en el carrito
    carrito.forEach(producto => {
        const itemCarrito = document.createElement('li');
        itemCarrito.textContent = `${producto.nombre} - $${producto.precio}`;
        carritoLista.appendChild(itemCarrito);
        total += producto.precio;
    });

    carritoTotal.textContent = `Total: $${total.toFixed(2)}`;
    localStorage.setItem(CARRITO_KEY, JSON.stringify({carrito}))
}

// Vaciar el carrito
vaciarCarritoBtn.addEventListener('click', () => {
    carrito = [];
    actualizarCarrito();
});

// Manejar filtros de búsqueda, categoría y precio
busquedaInput.addEventListener('input', () => {
    mostrarProductos({
        busqueda: busquedaInput.value,
        categoria: categoriaSelect.value,
        precio: precioInput.value
    });
});

categoriaSelect.addEventListener('change', () => {
    mostrarProductos({
        busqueda: busquedaInput.value,
        categoria: categoriaSelect.value,
        precio: precioInput.value
    });
});

precioInput.addEventListener('input', () => {
    precioValor.textContent = precioInput.value;
    mostrarProductos({
        busqueda: busquedaInput.value,
        categoria: categoriaSelect.value,
        precio: precioInput.value
    });
});

// Agregar evento a los botones de "Agregar al Carrito"
productosContainer.addEventListener('click', e => {
    if (e.target.classList.contains('agregar-carrito')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        agregarAlCarrito(id);
    }
});

// Mostrar los productos inicialmente
mostrarProductos();

// Manejar la funcionalidad de minimizar el carrito
minimizarCarritoBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Evitar que el clic en el botón también cierre el carrito
    carritoFlotante.classList.toggle('minimizado');
});

// Manejar la funcionalidad de abrir el carrito al hacer clic en el icono
carritoFlotante.addEventListener('click', () => {
    if (carritoFlotante.classList.contains('minimizado')) {
        carritoFlotante.classList.remove('minimizado'); // Mostrar el carrito
    }
});

