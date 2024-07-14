import { userModel } from '../models/users/user.model.js';
import { cartsModel } from '../models/carts/carts.model.js';
import { createHash, isValidPassword } from '../../utils.js';
import { changeRol, changeRolGeneral, deleteInactiveUsers, deleteUser, documentsUser, emailByCartId, getCartUser, getInactiveUsers, getUserId, getUser_Id, getUsers, timeLogIn, uploadFiles, verifyEmail } from "../models/users/usersData.js"
import { comparePassword, sendEmailPassword, updatePassword } from '../models/password/getNewPassword.js';
import { sendDeletionEmail } from '../models/email/emailData.js';
import fs from 'fs';

//Registro de user
export const registerUser = async (userData) => {
    const { first_name, last_name, email, age, cart, password, role } = userData;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            console.log("El usuario ya existe!!");
            return null; // Indica que el usuario ya existe
        } else {
            let idCart = null;
            if (cart.trim() !== "") {
                const existingCart = await cartsModel.findOne({ id: cart });
                if (!existingCart) {
                    console.log("El carrito no existe!");
                    return "El carrito no existe!"; // Indica que el carrito no existe
                } else {
                    idCart = existingCart._id;
                }
            }
            
            const hashedPassword = createHash(password);
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: hashedPassword,
                cart: idCart,
                role
            };
            const result = await userModel.create(newUser);
            return result; // Devuelve el usuario creado
        }
    } catch (error) {
        console.error("Error registrando el usuario:", error);
        throw error; // Lanza el error para que sea manejado por el controlador
    }
};

//Login de user
export const loginUser = async (username, password) => {
    try {
        const user = await userModel.findOne({ email: username });
        if (!user) {
            console.warn("Invalid credentials for user:", username);
            return false; // Indica credenciales inválidas
        }
        if (!isValidPassword(user, password)) {
            console.warn("Invalid credentials for user:", username);
            return false; // Indica credenciales inválidas
        }
        return user; // Devuelve el usuario autenticado
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        throw error; // Lanza el error para que sea manejado por el controlador
    }
};

//Obtenemos el carrito asociado a un usuario específico mediante el email registrado
export const getCartUserService = async (email) => {
    return await getCartUser(email)
}

//Obtenemos el email del user segun su _id del carrito
export const emailByCartIdService = async (id) => {
    return await emailByCartId(id)
}

//Verificamos que un correo este registado 
export const verifyEmailService = async (email) => {
    return await verifyEmail(email)
}

//Actualizamos la contraseña
export const updatePasswordService = async (user_id, newPassword) => {
    return await updatePassword(user_id, newPassword)
}

//Mandamos el correo para actualizar la contraseña
export const sendEmailPasswordService = async (email) => {
    return await sendEmailPassword(email)
}

//Comparamos las contraseñas
export const comparePasswordService = async (newPassword, user) => {
    return  await comparePassword(newPassword, user)
}

//Devolvemos un usuario segun su _id
export const getUser_IdService = async (_id) => {
    return await getUser_Id(_id)
}

//Devolvemos un usuario segun su _id
export const getUserIdService = async (id) => {
    return await getUserId(id)
}

//Cambiamos el rol del usurio mediante su _id
export const changeRolService = async (_id) => {
    return await changeRol(_id)
}

//Modificamos la last_connection
export const timeLogInService = async (email, time) =>{
    return await timeLogIn(email, time)
}

//Agregamos archivos a un usuario 
export const uploadFilesService = async (userId, files) => {
    return await uploadFiles(userId, files)
}

export const documentsUserService  = async (_id) => {
    return await documentsUser(_id)
}

//Nos devuelve todos los usuarios
export const getUsersService = async () => {
    return await getUsers()
}

//Nos devuelve los usuarios inactivos
export const getInactiveUsersService = async () => {
    return await getInactiveUsers()
}

//Elimina los usuarios inactivos
export const deleteInactiveUsersService = async () => {
    try {
        const usersToDelete = await deleteInactiveUsers();

        for (const user of usersToDelete) {
            await sendDeletionEmail(user);

            //Eliminar archivos asociados al usuario
            for (const document of user.documents) {
                try {
                    fs.unlinkSync(document.reference);
                    console.log(`Archivo eliminado: ${document.reference}`);
                } catch (err) {
                    console.error(`Error al eliminar el archivo ${document.reference}: ${err}`);
                }
            }
        }

        return usersToDelete.length;
    } catch (error) {
        logger.error(`Error en deleteInactiveUsersService: ${error}`);
        return 0;
    }
}

//Cambiamos el role de un usuario mediante su _id y el role que se indique
export const changeRolGeneralService = async (_id, role) => {
    return await changeRolGeneral(_id, role)
}

//Eliminamos un usuario según su _id
export const deleteUserService = async (_id) => {
    return await deleteUser(_id)
}