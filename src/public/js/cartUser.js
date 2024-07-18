function purchaseCart() {
    fetch('/api/carts/purchaseUserCart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.text())
    .then(data => {
        // Mostrar mensaje de confirmación usando SweetAlert
        /*Swal.fire({
            title: 'Compra finalizada',
            text: 'Se ha enviado un correo con los detalles de la compra.',
            icon: 'success',
            confirmButtonText: 'OK'
        })*/
        Swal.fire({
            title: 'Compra finalizada',
            text: 'Se ha enviado un correo con los detalles de la compra.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            // Mostrar la segunda alerta después de la primera
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
            text: 'Hubo un problema al procesar tu compra. Por favor, inténtalo de nuevo.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    });
}

function goToProducts() {
    window.location.replace('/handlebars/products');
}


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
            // Hacer la solicitud PUT para reducir la cantidad
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

//Falta actualizar el carrito al finalizar la compra : ✅ 
//Si despues de que se finalice la compre, quedan piezas en el cart, que aparezca un alert que diga que las piezas que quedan no estan en stock, : ✅ 