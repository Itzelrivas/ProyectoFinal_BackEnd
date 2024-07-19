import { fileURLToPath } from 'url'
import { dirname } from 'path' //Devuelve el nombre del directorio, es decir, la ruta absoluta
import multer from 'multer'
import bcrypt from 'bcrypt'
import { rolCurrentUser } from './src/services/passport.Service.js'
import { faker } from '@faker-js/faker'

//chicle y oega
import config from './src/config/config.js';

const __filename = fileURLToPath(import.meta.url) //Esto es para trabajaro con rutas absolutas
const __dirname = dirname(__filename)

export default __dirname;

//Configuración de Multer:
const storage = multer.diskStorage({
	//ubicacion del directorio donde voy a guardar los archivos
	destination: function(request, file, cb){
		cb(null, `${__dirname}/src/public/img`) //Vamos a guardar en una carpata llamada "img" dentro de public
	},
	//El nombre que quiero que tengan los archivos que se suban:
	filename: function(req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`) //Llamaremos al archivo con esta estructura: fechaActual-NombredelArchivo
	}
})


//Lo exportamos:
export const uploader = multer({
	storage, 
	//si se genera algun error, lo capturamos
	onError: function (err, next){
		console.log(err)
		next()
	}
})

//Bcrypt
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10)) //Generamos el hash, que es con lo que se va encriptar mi contraseña

export const isValidPassword = (user, password) => { //Va a validar que mi hash guardado en la base de datos sea igual a la contraseña ingresada en el log in
	console.log(`Datos a validar: user-password: ${user.password}, password: ${password}`);
	return bcrypt.compareSync(password, user.password)
}


//Auth de role ADMIN.
export const adminAuth = (request, response, next) => {
	//const userRol = rolCurrentUser
	const user = request.session.user
	if(!user){
		return response.status(403).send('Para poder acceder a esta función es necesario que primero inicies sesión.');
	}
	const userRol = request.session.user.role
	request.logger.info(userRol)
    if (userRol === 'admin' /*|| userRol === 'premium'*/) {
        next(); // Si el usuario es administrador o premium, permite que continúe con la solicitud
    } else {
        response.status(403).send('Acceso denegado. Debes tener role de admin para realizar esta acción.');
    }
};

//Auth de role USER.
export const userAuth = (request, response, next) => {
	const user = request.session.user
	if(!user){
		return response.status(403).send('Para poder acceder a esta función es necesario que primero inicies sesión.');
	}
	const userRol = request.session.user.role
	request.logger.info(userRol)
	if (userRol === 'user') {
        next(); // Si el usuario es user, permite que continúe con la solicitud
    } else {
		console.log("Debes tener un rol de user para poder agregar productos a tu carrito.")
        response.status(403).send('Acceso denegado. Debes tener rol de user para realizar esta acción.');
    }
};

//Auth de role PREMIUM.
export const premiumAuth = (request, response, next) => {
	//const userRol = rolCurrentUser
	const user = request.session.user
	if(!user){
		return response.status(403).send('Para poder acceder a esta función es necesario que primero inicies sesión.');
	}
	const userRol = request.session.user.role
	request.logger.info(userRol)
	if (userRol === 'premium' /*|| userRol === 'premium'*/) {
        next(); // Si el usuario es premium, permite que continúe con la solicitud
    } else {
        response.status(403).send('Acceso denegado. Debes tener role premium para realizar esta acción.');
    }
};

//Auth role PREMIUM O USER
export const premiumUserAuth = (request, response, next) => {
	//const userRol = rolCurrentUser
	const user = request.session.user
	if(!user){
		return response.status(403).send('Para poder acceder a esta función es necesario que primero inicies sesión.');
	}
    const userRol = request.session.user.role
	request.logger.info(userRol)
	if (userRol === 'user' || userRol === 'premium') {
        next(); // Si el usuario es premium, permite que continúe con la solicitud
    } else {
        response.status(403).send('Acceso denegado. Debes tener role premium o user para realizar esta acción.');
    }
};

//Auth role PREMIUM O ADMIN
//este si funcionaaa
export const premiumAdminAuth = (request, response, next) => {
	//const userRol = rolCurrentUser
	//const userRol = request.session.user.role
	const user = request.session.user
	if(!user){
		return response.status(403).send('Para poder acceder a esta función es necesario que primero inicies sesión.');
	}
	const userRol = request.session.user.role
	request.logger.info(userRol)
    if (userRol === 'admin' || userRol === 'premium') {
        next(); // Si el usuario es premium o user, permite que continúe con la solicitud
    } else {
        response.status(403).send('Acceso denegado. Debes tener role premium o admin para realizar esta acción.');
    }
};
/*export const premiumAdminAuth = (request, response, next) => {
    const authHeader = request.headers.authorization;
    let user;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        try {
            user = jwt.verify(token, config.secret);
        } catch (error) {
            return response.status(403).send('Token inválido.');
        }
    } else if (request.session && request.session.user) {
        user = request.session.user;
    } else {
        return response.status(403).send('Para poder acceder a esta función es necesario que primero inicies sesión.');
    }

    if (user.role === 'admin' || user.role === 'premium') {
        request.user = user;
        return next();
    } else {
        return response.status(403).send('Acceso denegado. Debes tener role premium o admin para realizar esta acción.');
    }
};*/


//Mocking de products
faker.locale = 'es'; //Idioma de los datos. 

export const generateProduct = () => {
    const categories = ['pantalon', 'playera', 'vestido', 'bolsas', 'conjuntos', 'perfume']
    const status = ['true', 'false']
    return {
        _id: faker.database.mongodbObjectId(),
        id: faker.datatype.number({ min: 1, max: 10000 }),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.datatype.string({ length: 6, alpha: true }),
        price: faker.commerce.price(),
        stock: faker.random.numeric(1),
        category: categories[Math.floor(Math.random() * categories.length)],
        image: faker.image.image(),
        status: status[Math.floor(Math.random() * status.length)],
    }
};