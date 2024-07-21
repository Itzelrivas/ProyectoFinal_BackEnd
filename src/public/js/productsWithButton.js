function addToCart(productId) {
    // Realiza una solicitud POST para agregar el producto al carrito
    fetch(`/api/carts/addProduct/${productId}`, {
        method: 'POST',
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        }
        throw new Error('Error al agregar el producto al carrito');
    })
    .then(message => {
        console.log(message)
        // Si la respuesta es "Producto agregado", muestra el mensaje
        if (message === 'Producto agregado') {
            console.log('Producto agregado al carrito');
            Swal.fire({
                icon: 'success',
                title: 'Producto agregado',
                text: 'El producto ha sido agregado al carrito.',
                timer: 2000, 
                showConfirmButton: false
            });
        } else { //hasta aqui es la rpueba 
            // Si la respuesta es diferente, muestra el mensaje de error
            console.error('No se pudo agregar el producto al carrito:', message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo agregar el producto al carrito.'
            });
        }
    })
    .catch(error => {
        //console.error('Error al agregar el producto al carrito:', error);
        Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'Solo los usuarios con role user o premium pueden agregar productos a su carrito.'
        });
        console.error('Error al agregar el producto al carrito:', error);
    });
}



/*function addToCart(productId) {
    // Realiza una solicitud GET para obtener la información del producto
    fetch(`/api/products/_id/${productId}`, {
        method: 'GET',
    })
    .then(response => {
        console.log(response)
        if (response.ok) {
            console.log(response.json)
            return response.json();
        }
        throw new Error('Error al obtener la información del producto');
    })
    .then(product => {
        // Verifica si el stock del producto es 0
        if (product.stock === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Sin stock',
                text: 'Este producto no tiene stock disponible.',
                timer: 2000, 
                showConfirmButton: false
            });
        } else {
            // Realiza una solicitud POST para agregar el producto al carrito
            return fetch(`/api/carts/addProduct/${productId}`, {
                method: 'POST',
            });
        }
    })
    .then(response => {
        console.log(response)
        if (response && response.ok) {
            return response.text();
        }
        throw new Error('Error al agregar el producto al carrito');
    })
    .then(message => {
        // Si la respuesta es "Producto agregado", muestra el mensaje
        if (message === 'Producto agregado') {
            console.log('Producto agregado al carrito');
            Swal.fire({
                icon: 'success',
                title: 'Producto agregado',
                text: 'El producto ha sido agregado al carrito.',
                timer: 2000, 
                showConfirmButton: false
            });
        } else {
            // Si la respuesta es diferente, muestra el mensaje de error
            console.error('No se pudo agregar el producto al carrito:', message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo agregar el producto al carrito.'
            });
        }
    })
    .catch(error => {
        console.error('Error al agregar el producto al carrito:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al procesar tu solicitud.'
        });
    });
}*/


function logout() {
    window.location.href = '/users/logout';
}

function userCart() {
    window.location.href = '/handlebars/cartUser';
}

function chat(){
    window.location.href = '/handlebars/messages';
}

function editUsers(){
    window.location.href = '/api/users/edit';
}