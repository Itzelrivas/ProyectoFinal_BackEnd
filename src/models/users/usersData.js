import { cartsModel } from "../carts/carts.model.js";
import { userModel } from "./user.model.js"

//Obtenemos el carrito asociado a un usuario específico
export const getCartUser = async (email) => {
    try {
        return await userModel.findOne({ email: email }).populate('cart');
    } catch (error) {
        console.error("Ha surgido este error en models de user: " + error);
        return error;
    }
}

//Obtenemos el email del user según el id de su carrito asociado
export const emailByCartId = async (id) => {
    try {
        let cart = await cartsModel.findOne({id: id})
        let cart_Id = cart._id
        let userSearch = await userModel.findOne({cart: cart_Id})
        let userEmail = userSearch.email
        return userEmail
    } catch (error) {
        console.error("Ha surgido este error en models de users: " + error);
        return error;
    }
}

//Verificamos si un correo ya esta asociado a un usuario
export const verifyEmail = async (email) => {
    try {
        let user = await userModel.findOne({email: email})
        return user
    } catch (error) {
        console.error("Ha surgido este error en models de users: " + error);
        return error;
    }
}

//Devolvemos un usuario segun su _id
export const getUser_Id = async (_id) => {
    try {
        let user = await userModel.findOne({_id: _id})
        return user
    } catch (error) {
        console.error("Ha surgido este error en models de users: " + error);
        return error;
    }
}

//Devolvemos un usuario segun su id
export const getUserId = async (id) => {
    try {
        let user = await userModel.findOne({id: id})
        return user
    } catch (error) {
        console.error("Ha surgido este error en models de users: " + error);
        return error;
    }
}

//Cambiamos el rol (premium <-> user) del usurio mediante su _id
export const changeRol = async (_id) => {
    try {
        let user = await userModel.findOne({_id: _id})
        if(user.role === 'user'){
            return await userModel.findOneAndUpdate({ _id: _id }, { role: 'premium' })
        }else if(user.role === 'premium'){
            return await userModel.findOneAndUpdate({ _id: _id }, { role: 'user' })
        }
    } catch (error) {
        console.error("Ha surgido este error en models de users: " + error);
        return error;
    }
}

//Modificamos la hora de inicio de sesión
export const timeLogIn = async (email, time) => {
    try {
        return await userModel.findOneAndUpdate({ email: email }, { last_connection: time })
    } catch (error) {
        console.error("Ha surgido este error en models de users: " + error);
        return error;
    }
}

//Agregamos archivos a user.documents
export const uploadFiles = async (userId, files) => {
    try {
        const user = await userModel.findOne({_id: userId})
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        files.forEach(file => {
            user.documents.push({
                name: file.originalname,
                reference: file.path
            });
        });

        await user.save();
    } catch (error) {
        console.error("Ha surgido este error en models de users: " + error);
        return error;
    }
}

//Nos devuelve el status de los documents del user 
export const documentsUser  = async (_id) => {
    try {
        let user = await userModel.findOne({_id: _id})
        let documents = user.documents
        return documents
    } catch (error) {
        console.error("Ha surgido este error en models de users: " + error);
        return error;
    }
}

//Nos devuelve todos los usuarios
export const getUsers = async () => {
    try {
        let users = await userModel.find({}, 'first_name last_name email role');
        return users
    } catch (error) {
        console.error("Ha surgido este error en models de users: " + error);
        return error;
    }
}

//Nos devuelve los usuarios cuya última conexión fue hace más de dos días
export const getInactiveUsers = async () => {
    try {
        //Calculamos la fecha de hace dos días
        /*const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        //Buscamos usuarios cuya last_connection es anterior a hace dos días
        let users = await userModel.find({ last_connection: { $lt: twoDaysAgo } });*/


        //Prueba dos minutos
        const halfHourAgo = new Date();
        halfHourAgo.setMinutes(halfHourAgo.getMinutes() - 2);
        let users = await userModel.find({ last_connection: { $lt: halfHourAgo } });

        return users;
    } catch (error) {
        console.error("Ha surgido este error en models de users: " + error);
        return error;
    }
}

//Eliminamos a los usuarios inactivos
export const deleteInactiveUsers = async () => {
    try {
        //Funciona con los dos días
        /*const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const usersToDelete = await userModel.find({ last_connection: { $lt: twoDaysAgo } });
        await userModel.deleteMany({ last_connection: { $lt: twoDaysAgo } });
        return usersToDelete;*/

        //Prueba con 2 minutos
        const halfHourAgo = new Date();
        halfHourAgo.setMinutes(halfHourAgo.getMinutes() - 2);
        const usersToDelete = await userModel.find({ last_connection: { $lt: halfHourAgo } });
        await userModel.deleteMany({ last_connection: { $lt: halfHourAgo } });
        return usersToDelete;
        
    } catch (error) {
        console.error("Ha surgido este error en models de users: " + error);
        return error;
    }
};

//Cambiamos el rol del usurio mediante su _id y según el role que se indique
export const changeRolGeneral = async (_id, role) => {
    try {
        return await userModel.findOneAndUpdate({ _id: _id }, { role: role })
    } catch (error) {
        console.error("Ha surgido este error en models de users: " + error);
        return error;
    }
}

//Eliminamos un usuario mediante el _id
export const deleteUser = async (_id) => {
    try {
        return await userModel.findOneAndDelete({_id: _id})
    } catch (error) {
        console.error("Ha surgido este error en models de users: " + error);
        return error;
    }
}