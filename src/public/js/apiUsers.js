//Función que nos muestra los usuarios
async function getUsers(){
    try {
        Swal.fire({
            title: 'Lista de Usuarios:',
            text: 'En la siguiente vista se muestran los usuarios registrados en nuestra base de datos, con su nombre, correo y role:)',
            icon: 'info',
            confirmButtonText: 'Continuar...'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/api/users';
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        Swal.fire({
            title: 'Error',
            text: '¡Oh oh! Ha surgido un error y no se pudo acceder a los usuarios.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
    }
}

//Función para cambiar de role a un usuario
async function changeUserRole() {
    try {
        const userId = document.getElementById('userIdRole').value;
        const newRole = document.getElementById('newRole').value;

        if (!userId || !newRole) {
            throw new Error('Por favor ingresa el ID del usuario y selecciona un nuevo rol.');
        }

        const response = await fetch(`/api/users/changeRole/${userId}/${newRole}`, {
            method: 'POST'
        });

        console.log(response)

        if (!response.ok) {
            throw new Error('No se pudo cambiar el rol del usuario.');
        }

        //Alert de éxito
        Swal.fire({
            title: 'Éxito',
            text: `Se ha cambiado el rol del usuario con ID ${userId} a ${newRole}.`,
            icon: 'success',
            confirmButtonText: 'Cerrar'
        });

    } catch (error) {
        console.error('Error cambiando el rol del usuario:', error);

        //Alert de error
        Swal.fire({
            title: 'Error',
            text: '¡Oh oh! Ha ocurrido un error al cambiar el rol del usuario.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
    }
}

//Función para eliminar un usuario
async function deleteUser() {
    try {
        const userId = document.getElementById('userIdDelete').value;

        if (!userId) {
            throw new Error('Por favor ingresa el ID del usuario.');
        }

        //Mostramos un cuadro de confirmación antes de eliminar
        const confirmDelete = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará permanentemente al usuario. ¿Estás seguro de proceder?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar usuario',
            cancelButtonText: 'Cancelar'
        });

        if (confirmDelete.isConfirmed) {
            //Si se confirma, ahora sí se elimina el user
            const response = await fetch(`/api/users/deleteUser/${encodeURIComponent(userId)}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('No se pudo eliminar el usuario.');
            }

            //Alert de éxito
            Swal.fire({
                title: 'Eliminado',
                text: `El usuario con ID ${userId} ha sido eliminado correctamente.`,
                icon: 'success',
                confirmButtonText: 'Cerrar'
            });
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);

        //Alert de error
        Swal.fire({
            title: 'Error',
            text: '¡Oh oh! Ha ocurrido un error al eliminar el usuario.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
    }
}