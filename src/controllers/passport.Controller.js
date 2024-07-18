import passport from 'passport';
import { initializePassport } from '../services/passport.Service.js';
//Errors
import CustomError from '../services/errors/CustomError.js';
import { loginUserErrorInfoESP, registerUserErrorInfoESP } from '../services/errors/messages/usersErrors.js';
import NErrors from '../services/errors/errors-enum.js';
import { timeLogInService, verifyEmailService } from '../services/users.Service.js';

initializePassport()

//Registro de usuario con passport
export const registerUser = async (req, res, next) => {
    //const { first_name, last_name, email, age, password, role } = req.body; //agregue role
    const { first_name, last_name, email, age, password, role, specialPassword } = req.body;
    console.log(req.body);
    console.log(req.body)

//chicle y pega
    // Contraseña especial predefinida (debería almacenarse de manera segura)
    const specialPasswordCorrectAdmin = '123'; // Cambiar por la contraseña real
    const specialPasswordCorrectPremium = '321';
    
    if ((role === 'admin' && specialPassword !== specialPasswordCorrectAdmin) || (role === 'premium' && specialPassword !== specialPasswordCorrectPremium)) {
        return res.status(403).send({ status: 'invalidPassword', message: 'Contraseña especial incorrecta.' });
    }
    //


    // Verificar si los campos no están completos para manejar el error
    if (!first_name || !last_name || !email || !age || !password) {
        console.log("2")
        const error = CustomError.createError({
            name: "User Register Error",
            cause: registerUserErrorInfoESP({ first_name, last_name, email, age, password }),
            message: "Error tratando de registrar un nuevo usuario",
            code: NErrors.INVALID_TYPES_ERROR
        });
        return next(error); // Pasar el error al siguiente middleware de error
    }
    console.log("3")
    // Verificar si el correo electrónico ya está registrado
    const verifyEmail = await verifyEmailService(email);
    console.log(verifyEmail)

    if (verifyEmail!==null) {
        console.log("4")
        req.logger.error("Error al registrar nuevo usuario.");
        return res.status(409).send({ status: 'noSuccess', message: "Usuario no creado porque el correo ya ha sido utilizado anteriormente :(" });
    }

    passport.authenticate('register', (err, user) => {
        console.log(err)
        if (err) {
            // Manejar cualquier error ocurrido durante la autenticación
            req.logger.error("Error al registrar nuevo usuario:", err);
            return next(err);
        }
        
        // Si el usuario se registró correctamente, `user` contendrá el usuario creado
        if (user) {
            // Aquí puedes enviar la respuesta 200 con un mensaje de éxito
            return res.status(200).send({ status: 'success', message: "Usuario creado de forma exitosa!!" });
        } else {
            // No se creó el usuario por alguna razón específica
            return res.status(500).send({ status: 'error', message: "Error al intentar registrar un nuevo usuario." });
        }
    })(req, res, next); // Llamar a passport.authenticate como un middleware
};


//Login del usuario con passport
export const loginUser = (request, response, next) => { 
    const { email, password } = request.body
    // Verificar si los campos no están completos para manejar el error
    if (!email || !password) {
        CustomError.createError({
            name: "User LogIn Error",
            cause: loginUserErrorInfoESP({ email, password }),
            message: "Error al intentar iniciar sesion.",
            code: NErrors.INVALID_TYPES_ERROR
        });
    }

    passport.authenticate('login', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return response.status(401).send({ status: "error", error: "El usuario y la contraseña no coinciden!" });
        }
        request.login(user, async (err) => { //estaba sin el async pero no me pfuncionaba lo de prieba 
            if (err) {
                return next(err);
            }
            //console.log("Usuario encontrado:");
            //console.log(user);
            request.logger.info(`Usuario encontrado: ${user}`)

            //Prueba !!!!
            //user.last_connection = new Date()
            let emailUser = user.email
            //request.logger.info(emailUser)
            let time = new Date()
            await timeLogInService(emailUser, time)

            request.session.user = {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email, 
                age: user.age,
                role: user.role,
                cart: user.cart,
                last_connection: user.last_connection
            };

            response.send({ status: "success", payload: request.session.user, message: "Primer logueo realizado! :)" });
        });
    })(request, response, next);
};

//Login del usuario mediante GitHub
export const loginGitHub = (req, res, next) => {
    passport.authenticate('github', {
        scope: ['user:email'], 
    })(req, res, next); 
};

//Callback de gitHub
export const githubCallbackController = (request, response, next) => {
    passport.authenticate('github', { failureRedirect: '/api/sessions/fail-login' })(request, response, async () => {
        const user = request.user;
        if(user){
            // Asignamos roles si es necesario
            if (user.email === 'adminCoder@coder.com') {
                user.role = 'administrador';
            }

            // Creamos la sesión del usuario
            request.session.user = {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                age: user.age,
                role: user.role
            };

            // Redirigimos al usuario a la página de inicio
            response.redirect("/handlebars/home");
        }
        
    });
};