//Función para finalizar la compra del carrito del user logueado
function purchaseCart() {
    fetch('/api/carts/purchaseUserCart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        } else if (response.status === 400) {
            return response.json().then(data => {
                throw new Error(data.message);
            });
        } else {
            throw new Error('Error al procesar la compra');
        }
    })
    .then(data => {
        Swal.fire({
            title: 'Compra finalizada',
            text: 'Se ha enviado un correo con los detalles de la compra.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            // Mostrar la segunda alerta después de la primera con los productos no en stock.
            Swal.fire({
                title: 'Actualización de stock',
                text: 'Puede que algunos productos en tu carrito no esten en stock y por lo tanto, no se pudo finalizar su compra y permanecen en tu carrito.',
                icon: 'warning',
                confirmButtonText: 'OK'
            }).then(() => {
                // Recargar la página después de la segunda alerta
                window.location.href = 'http://localhost:9090/handlebars/cartUser';
            });
        });
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            //text: 'Hubo un problema al procesar tu compra. Por favor, inténtalo de nuevo.',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    });
}

//Función para ver los productos
function goToProducts() {
    window.location.replace('/handlebars/products');
}

//Función para reducir 1 la cantidad de un producto en el carrito del user logueado
function reduceQuantity(productId, currentQuantity) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Quieres reducir la cantidad de este producto?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, reducir',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/api/carts/cartUser/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity: currentQuantity - 1 })
            })
            .then(response => {
                if (response.ok) {
                    Swal.fire(
                        'Reducido!',
                        'La cantidad ha sido reducida.',
                        'success'
                    ).then(() => {
                        location.reload(); 
                    });
                } else {
                    Swal.fire(
                        'Error!',
                        'Hubo un problema al reducir la cantidad.',
                        'error'
                    );
                }
            })
            .catch(error => {
                Swal.fire(
                    'Error!',
                    'Hubo un problema al reducir la cantidad.',
                    'error'
                );
            });
        }
    });
}

