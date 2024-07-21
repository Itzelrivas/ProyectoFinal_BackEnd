function addToCart(productId) {
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
        //Si la respuesta es "Producto agregado", muestra el mensaje
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
            console.error('No se pudo agregar el producto al carrito:', message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo agregar el producto al carrito.'
            });
        }
    })
    .catch(error => {
        //Si no hay acceso por el role
        Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'Solo los usuarios con role user o premium pueden agregar productos a su carrito.'
        });
        console.error('Error al agregar el producto al carrito:', error);
    });
}

//Función para cerrar sesión
function logout() {
    window.location.href = '/users/logout';
}

//Función para acceder al carrito del usuario con sus productos agregados
function userCart() {
    window.location.href = '/handlebars/cartUser';
}

//Función para acceder al chat
function chat(){
    window.location.href = '/handlebars/messages';
}

//Función para que los admisn puedan acceder a una handlebar donde se editen los users
function editUsers(){
    window.location.href = '/api/users/edit';
}