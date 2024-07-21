import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { addFilesController, changeRolController, changeRolGeneralController, deleteInactiveUsersController, deleteUserController, editUsersController, getInactiveUsersController, getUsersController } from '../controllers/users.Controller.js';
import errorHandler from '../services/errors/middlewares/index.js';
import __dirname, { adminAuth, premiumUserAuth } from '../../utils.js';

const router = Router();

//Configuración de Multer para guardar archivos en diferentes carpetas
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = '';
        const fileNameWithoutExt = path.parse(file.originalname).name
        //Determinamos la carpeta de destino según el tipo de archivo
        if (fileNameWithoutExt === 'profileImage') {
            uploadPath = path.join(`${__dirname}/src/public/uploads/profiles`);
        } else if (fileNameWithoutExt === 'productImage') {
            uploadPath = path.join(`${__dirname}/src/public/uploads/products`);
        } else {
            uploadPath = path.join(`${__dirname}/src/public/uploads/documents`);
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Middleware de Multer
const upload = multer({ storage });


//Accedemos a los users
router.get("/", adminAuth, getUsersController)

//Accedemos a los users inactivos
router.get("/inactive", adminAuth, getInactiveUsersController)

//Eliminamos de la BD a los usuarios inactivos
router.delete("/", adminAuth, deleteInactiveUsersController)

//Cambiar el role premium <-> user
router.get("/premium/:_id", premiumUserAuth, changeRolController)

//Ruta para subir archivos a un usuario.
router.post('/:uid/documents', upload.array('files'), addFilesController);

//Ruta para vista que permite editar usuarios 
router.get('/edit', adminAuth, editUsersController)

//Ruta para cambiar a un role especifico un usuario con su _id. 
router.post("/changeRole/:uid/:urole", adminAuth, changeRolGeneralController)

//Ruta que elimina un user mediante el _id
router.delete("/deleteUser/:uid", adminAuth, deleteUserController)



// Middleware para el manejo de errores
router.use(errorHandler);

export default router;