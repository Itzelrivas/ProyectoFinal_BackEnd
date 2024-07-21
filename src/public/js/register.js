const form = document.getElementById('registerForm');
console.log(form)

//form.addEventListener('submit', e => {
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form)
    const obj = {}
    data.forEach((value, key) => obj[key] = value);

    //chicle y pega
    const role = obj.role;
    if (role === 'admin' || role === 'premium') {
        const { value: specialPassword } = await Swal.fire({
            title: 'Contraseña especial requerida',
            input: 'password',
            inputLabel: 'Por favor, ingrese la contraseña especial para roles admin o premium:',
            inputPlaceholder: 'Contraseña especial',
            inputAttributes: {
                maxlength: 20,
                autocapitalize: 'off',
                autocorrect: 'off'
            },
            showCancelButton: true
        });

        if (!specialPassword) {
            Swal.fire({
                title: 'Registro cancelado',
                text: 'No se proporcionó la contraseña especial.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        obj.specialPassword = specialPassword;
    }
    //
   
    fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        //chicle y pega
        if (!result.ok && result.status === 403) {
            return result.json().then(data => {
                if (data.status === 'invalidPassword') {
                    Swal.fire({
                        title: 'Error',
                        text: 'Contraseña especial incorrecta.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar',
                        backdrop: 'rgba(168, 69, 69, 0.666)'
                    });
                    throw new Error('Contraseña especial incorrecta');
                }
                return data;
            });
        }
        //
        return result.json(); // Parsea la respuesta JSON
    }).then(result => {
        if (result.status === 'success') {
            Swal.fire({
                title: `¡Hola, ${data.get('first_name')}!`, 
                text: `Se ha creado un nuevo usuario con el correo: ${data.get('email')} y la contraseña que definiste.`,
                icon: 'success',
                confirmButtonText: 'Aceptar',
                backdrop: 'rgba(82, 69, 168, 0.584)'
            }).then(() => {
                window.location.replace('/users/login');
            });
        } else if(result.status === 'noSuccess'){
            //Si la respuesta no es exitosa, muestra un alert de error
            Swal.fire({
                title: 'Error',
                text: 'El correo ya esta registrado con otro usuario :(',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                backdrop: 'rgba(168, 69, 69, 0.666)'
            });
        }
    }).catch(error => {
        console.error('Ha surgido un error: ', error);
    });
});