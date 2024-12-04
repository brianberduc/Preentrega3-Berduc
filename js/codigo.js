async function obtenerProductos() {
    const response = await fetch('https://brianberduc.github.io/ProyectoFinal-Berduc/json/productos.json');
    return await response.json();
}

const CARRITO_KEY = "carrito";
let carrito = JSON.parse(localStorage.getItem(CARRITO_KEY))?.carrito || [];
let misProductos = [];

const elementos = {
    productosContainer: document.getElementById('productos'),
    carritoLista: document.getElementById('carrito-lista'),
    carritoTotal: document.getElementById('total'),
    vaciarCarritoBtn: document.getElementById('vaciar-carrito'),
    categoriaSelect: document.getElementById('categoria'),
    precioInput: document.getElementById('precio'),
    precioValor: document.getElementById('valor-precio'),
    busquedaInput: document.getElementById('busqueda'),
    carritoFlotante: document.getElementById('carrito-flotante'),
    minimizarCarritoBtn: document.getElementById('minimizar-carrito'),
    finalizarCompra: document.getElementById('finalizar-compra')
};

if (carrito.length) actualizarCarrito();

function mostrarProductos(filtro = {}) {
    elementos.productosContainer.innerHTML = '';

    obtenerProductos().then(({ productos }) => {
        misProductos = productos;
        const productosFiltrados = productos.filter(({ categoria, precio, nombre }) => {
            const { categoria: catFiltro, precio: precioFiltro, busqueda } = filtro;
            return (!catFiltro || catFiltro === 'todos' || categoria.toLowerCase() === catFiltro) &&
                   (precioFiltro === undefined || precio <= precioFiltro) &&
                   (!busqueda || nombre.toLowerCase().includes(busqueda.toLowerCase()));
        });

        productosFiltrados.forEach(producto => {
            elementos.productosContainer.appendChild(renderizarProducto(producto));
        });
    }).catch(error => alert('Error al cargar los productos: ', error));
}

function renderizarProducto({ id, imagen, nombre, precio }) {
    const productoDiv = document.createElement('div');
    productoDiv.classList.add('producto');
    productoDiv.innerHTML = `
        <img src="${imagen}" alt="${nombre}">
        <h3>${nombre}</h3>
        <p>$${precio.toFixed(2)}</p>
        <button class="agregar-carrito" data-id="${id}">Agregar al Carrito</button>
    `;
    return productoDiv;
}

function agregarAlCarrito(id) {
    const producto = misProductos.find(p => p.id === id);
    carrito.push(producto);
    actualizarCarrito();
}

function actualizarCarrito() {
    elementos.carritoLista.innerHTML = '';
    let total = 0;

    carrito.forEach(({ nombre, precio }) => {
        const itemCarrito = document.createElement('li');
        itemCarrito.textContent = `${nombre} - $${precio}`;
        elementos.carritoLista.appendChild(itemCarrito);
        total += precio;
    });

    elementos.carritoTotal.textContent = `Total: $${total.toFixed(2)}`;
    localStorage.setItem(CARRITO_KEY, JSON.stringify({ carrito }));

    // Actualizar badge con la cantidad de items en el carrito
    let badge = elementos.carritoFlotante.querySelector('.badge');
    if (!badge) {
        badge = document.createElement('span');
        badge.classList.add('badge');
        elementos.carritoFlotante.appendChild(badge);

        // Agregar estilos CSS para posicionar el badge
        badge.style.position = 'absolute';
        badge.style.top = '0';
        badge.style.right = '0';
        badge.style.backgroundColor = 'darkgreen';
        badge.style.color = 'white';
        badge.style.borderRadius = '50%';
        badge.style.padding = '10px';
        badge.style.transform = 'translate(50%, -50%)';
    }
    badge.textContent = carrito.length;

}

elementos.vaciarCarritoBtn.addEventListener('click', () => {
    carrito = [];
    actualizarCarrito();
});

['input', 'change'].forEach(event => {
    elementos.busquedaInput.addEventListener(event, aplicarFiltros);
    elementos.categoriaSelect.addEventListener(event, aplicarFiltros);
    elementos.precioInput.addEventListener(event, aplicarFiltros);
});

function aplicarFiltros() {
    elementos.precioValor.textContent = elementos.precioInput.value;
    mostrarProductos({
        busqueda: elementos.busquedaInput.value,
        categoria: elementos.categoriaSelect.value,
        precio: elementos.precioInput.value
    });
}

elementos.productosContainer.addEventListener('click', e => {
    if (e.target.classList.contains('agregar-carrito')) {
        agregarAlCarrito(parseInt(e.target.dataset.id));
    }
});

mostrarProductos();

elementos.minimizarCarritoBtn.addEventListener('click', e => {
    e.stopPropagation();
    elementos.carritoFlotante.classList.toggle('minimizado');
});

elementos.carritoFlotante.addEventListener('click', () => {
    if (elementos.carritoFlotante.classList.contains('minimizado')) {
        elementos.carritoFlotante.classList.remove('minimizado');
    }
});

elementos.finalizarCompra.addEventListener('click', () => {

    const toastButton = document.createElement('button');
    toastButton.type = 'button';
    toastButton.classList.add('btn', 'btn-primary');
    toastButton.id = 'liveToastBtn';
    toastButton.textContent = 'Show live toast';

    const toastContainer = document.createElement('div');
    toastContainer.classList.add('toast-container', 'position-fixed', 'bottom-0', 'end-0', 'p-3');

    const toast = document.createElement('div');
    toast.id = 'liveToast';
    toast.classList.add('toast');
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    const toastHeader = document.createElement('div');
    toastHeader.classList.add('toast-header');

    const toastStrong = document.createElement('strong');
    toastStrong.classList.add('me-auto');
    toastStrong.textContent = 'Rehabilitación integral';

    const toastButtonClose = document.createElement('button');
    toastButtonClose.type = 'button';
    toastButtonClose.classList.add('btn-close');
    toastButtonClose.setAttribute('data-bs-dismiss', 'toast');
    toastButtonClose.setAttribute('aria-label', 'Close');

    const toastBody = document.createElement('div');
    toastBody.classList.add('toast-body');
    toastBody.textContent = 'Gracias por tu compra';

    toastHeader.appendChild(toastStrong);
    toastHeader.appendChild(toastButtonClose);

    toast.appendChild(toastHeader);
    toast.appendChild(toastBody);

    toastContainer.appendChild(toast);
    document.body.appendChild(toastButton);
    document.body.appendChild(toastContainer);

    const toastElement = new bootstrap.Toast(toast);
    toastElement.show();

    carrito = [];
    actualizarCarrito();

});
