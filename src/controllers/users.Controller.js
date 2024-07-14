import config from "../config/config.js"
import { updatePassword } from "../models/password/getNewPassword.js";
import { changeRolGeneralService, changeRolService, comparePasswordService, deleteInactiveUsersService, deleteUserService, documentsUserService, getCartUserService, getInactiveUsersService, getUser_IdService, getUsersService, sendEmailPasswordService, timeLogInService, uploadFilesService, verifyEmailService } from "../services/users.Service.js"
import jwt from 'jsonwebtoken';

//Obtenemos el carrito asociado a un user mediante el email
export const getCartUserController = async (request, response) => {
    try {
        let user_email = request.params.email
        const user = await getCartUserService(user_email)
        if (!user) {
            return response.status(404).send(`El usuario con correo ${user_email} no se ha encontrado.`);
        }
        //console.log("Se pudo acceder con exito al usuario.")
        request.logger.info("Se pudo acceder con exito al usuario.")
        response.send(user)
    } catch (error) {
        //console.error("Ha surgido este error: " + error);
        request.logger.error(`Ha surgido este error: ${error}`)
        response.status(500).send('<h2 style="color: red">¡Oh oh! Ha surgido un error y no se pueden mostrar el usuario.</h2>');
    }
}

//Registro de usuario
export const registerUserController = async (request, response) => {
    response.render('register', {
        style: "viewsSessions.css"
    })
}

//Login de usuario
export const loginUserController = async (request, response) => {
    response.render('login', {
        style: "viewsSessions.css"
    })
}

//Obtenemos la info del usuario
export const getInfoUser = async (request, response) => {
    const user = request.session.user

    request.logger.info(`Session: ${JSON.stringify(request.session, null, 2)}`)
    response.render('current', { user })
}

//Registro no exitoso
export const failRegister = async (request, response) => {
    response.status(401).send({ error: "Failed to process register!" }) ;
}

//Login no exitoso
export const failLogin = async (request, response) => {
    response.status(401).send({ error: "Failed to process login!" });
}

//Logout
export const logout = async (request, response) => {
    //console.log("pruebaaa: ")
    //console.log(request.session.user)

    //prueba cambiando el last_connection
    let emailUser = request.session.user.email
    request.logger.info(emailUser)
    let time = new Date()
    await timeLogInService(emailUser, time)
    //console.log(modifyUser)

    request.session.destroy(error => {
        if (error){
            response.json({error: "error logout", mensaje: "Error al cerrar la sesion"});
        }
        response.redirect('/users/login');
    });   
}

//Actualizamos la contraseña
export const updatePasswordController = async (req, res) => {
    //Token generado
    const { token } = req.params;

    //Verificamos el token
    try {
        const decoded = jwt.verify(token, config.secret);
        const userId = decoded.userId;

        if (req.method === 'GET') {
            //Renderizamos la vista
            res.render('resetPassword', { token });
        } else if (req.method === 'POST') {
            const { newPassword } = req.body;

            try {
                //Lógica para actualizar la contraseña
                const result = await comparePasswordService(newPassword, userId)
                console.log(result)
                if(result === false){
                await updatePassword(userId, newPassword);
                res.send('Contraseña actualizada exitosamente.');
                }else{
                    res.send('La contraseña no puede ser igual a la que tenias anteriormente.')
                }
            } catch (error) {
                console.error('Error al actualizar la contraseña:', error);
                res.status(500).send('Ha ocurrido un error al actualizar la contraseña.');
            }
        }
    } catch (error) {
        console.error('Token inválido o expirado:', error);
        res.render('expiredLink')
    }
};

//Mandamos el correo para actualizar la contraseña
export const sendEmailPasswordController = async (request, response) => {
    try {
        const email = request.params.email
        await sendEmailPasswordService(email)
        response.send("Se ha mandado un nuevo link al correo proporcionado :)")
    } catch (error) {
        request.logger.error(`Ha surgido este error: ${error}`)
        response.status(500).send('<h2 style="color: red">¡Oh oh! Ha surgido un error y no se pudo generar un nuevo link.</h2>');
    }
}

//Cambiamos el rol del usurio mediante su _id
export const changeRolController = async (request, response) => {
    try {
        // Extrae el _id del parámetro de la URL
        const {_id} = request.params;

        let user = await getUser_IdService(_id)
        let role = user.role
        console.log(role)

        //Solicitud de archivos 
        let documents = await documentsUserService(_id)
        //console.log(documents)
        //Verificamos si el campo documents tiene los documentos requeridos
        const requiredDocuments = ['Identificacion', 'Comprobante_de_domicilio', 'Comprobante_de_estado_de_cuenta'];
        const userDocuments = documents.map(doc => doc.name.split('.')[0]); //Eliminamos la extensión del nombre del archivo
        const hasRequiredDocuments = requiredDocuments.every(doc => userDocuments.includes(doc));

        if(!user){
            return response.status(404).send(`El usuario con el _id ${_id} no se ha encontrado.`);
        }

        if(role !== 'premium' && role !== 'user'){
            return response.status(404).send(`¡Oh oh! Esta función solo esta disponible para users con role premium o user.`);
        }
        else if(role === 'user' && !hasRequiredDocuments){
            request.logger.error('El usuario no tiene todos los documentos requeridos.');
            return response.status(404).send(`¡Oh oh! Para cambiar el rol de user a premium tienes que subir los siguientes documentos: Identificación, Comprobante de domicilio, Comprobante de estado de cuenta :)`);
        }
        else{
            await changeRolService(_id)
            if(role === 'premium'){
                return response.status(404).send(`Tu role de premium ha cambiado a user.`);
            }
            return response.status(404).send(`Tu role de user ha cambiado a premium.`);
        }
    } catch (error) {
        request.logger.error(`Ha surgido este error: ${error}`)
        response.status(500).send('<h2 style="color: red">¡Oh oh! Ha surgido un error y no se pudo cambiar el role.</h2>');
    }
}

//Agregamos archivos al parametro documents de un usuario según su id
export const addFilesController = async (request, response) => {
    try {
        //console.log("hola1")
        const userId = request.params.uid
        const files = request.files
        //console.log("hola2")
        await uploadFilesService(userId, files);
        //console.log("hola3")
        response.json({ message: 'Archivos subidos y usuario actualizado exitosamente' });
    } catch (error) {
        request.logger.error(`Ha surgido este error: ${error}`)
        response.status(500).send('<h2 style="color: red">¡Oh oh! Ha surgido un error y no se pudo subir los archivos al usuario.</h2>');
    }
}

//Nos devuelve todos los usuarios 
export const getUsersController = async (request, response) => {
    try {
        const users = await getUsersService()
        return response.send(users)
    } catch (error) {
        request.logger.error(`Ha surgido este error: ${error}`)
        response.status(500).send('<h2 style="color: red">¡Oh oh! Ha surgido un error y no se pudo acceder a los usuarios.</h2>');
    }
}

//Nos devuelve los usuarios que su last_connection fue hace más de dos días
export const getInactiveUsersController = async (request, response) => {
    try {
        const users = await getInactiveUsersService();
        return response.send(users);
    } catch (error) {
        request.logger.error(`Ha surgido este error: ${error}`);
        response.status(500).send('<h2 style="color: red">¡Oh oh! Ha surgido un error y no se pudo acceder a los usuarios inactivos.</h2>');
    }
}

//Elimina los usuarios que su last_connection fue hace al menos dos días
export const deleteInactiveUsersController = async (request, response) => {
    try {
        const deletedCount = await deleteInactiveUsersService();
        response.send({ message: `${deletedCount} usuarios eliminados por inactividad.` });
    } catch (error) {
        request.logger.error(`Error al eliminar usuarios inactivos: ${error}`);
        response.status(500).send('<h2 style="color: red">¡Oh oh! Ha surgido un error y no se pudieron eliminar los usuarios inactivos.</h2>');
    }
}

//Vista para eliminar, editar rol o ver usuarios
export const editUsersController = async (request, response) =>{
    response.render('usersEdit', {
        //style: "viewsHandlebars.css"
    })
}

//Cambiamos el role a elección de un usuario específico
export const changeRolGeneralController = async (request, response) => {
    try {
        const userId = request.params.uid
        const userRole = request.params.urole

        const user = await getUser_IdService(userId)
        if(!user){
            request.logger.error(`El usuario con _id ${userId} no esta en la BD.`);
            return response.status(404).send(`El usuario con el _id ${_id} no se ha encontrado.`);
        }

        await changeRolGeneralService(userId, userRole)
        return response.status(200).send(`El role del usuario con _id: ${userId} ahora es ${userRole}`);
    } catch (error) {
        request.logger.error(`Error al cambiar el role del usuario: ${error}`);
        response.status(500).send('<h2 style="color: red">¡Oh oh! Ha surgido un error y no se pudieron eliminar los usuarios inactivos.</h2>');
    }
}

//Eliminamos un usuario mediante su _id
export const deleteUserController = async (request, response) => {
    try {
        const userId = request.params.uid
        const user = await getUser_IdService(userId)
        if(!user){
            request.logger.error(`El usuario con _id ${userId} no esta en la BD.`);
            return response.status(404).send(`El usuario con el _id ${_id} no se ha encontrado.`);
        }
        await deleteUserService(userId)
        return response.status(200).send(`El usuario con _id: ${userId} ha sido eliminado.`);
    } catch (error) {
        
    }
}