import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { addFilesController, changeRolController, changeRolGeneralController, deleteInactiveUsersController, deleteUserController, editUsersController, getInactiveUsersController, getUsersController } from '../controllers/users.Controller.js';
import errorHandler from '../services/errors/middlewares/index.js';
import __dirname, { auth } from '../../utils.js';

const router = Router();

// Configuración de Multer para guardar archivos en diferentes carpetas
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = '';
        const fileNameWithoutExt = path.parse(file.originalname).name
        //console.log(fileNameWithoutExt)
        // Determinar la carpeta de destino según el tipo de archivo
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
router.get("/", auth, getUsersController)

//Accedemos a los users inactivos
router.get("/inactive", getInactiveUsersController)

//Eliminamos de la BD a los usuarios inactivos
router.delete("/", auth, deleteInactiveUsersController)

//Cambiar el role premium <-> user
router.get("/premium/:_id", changeRolController)

//Ruta para subir archivos a un usuario
router.post('/:uid/documents', upload.array('files'), addFilesController);

//Ruta para vista que permite editar usuarios 
router.get('/edit', auth, editUsersController)

//Ruta para cambiar a un role especifico un usuario con su _id
router.post("/changeRole/:uid/:urole", changeRolGeneralController)

//Ruta que elimina un user mediante el _id
router.delete("/deleteUser/:uid", deleteUserController)



// Middleware para el manejo de errores
router.use(errorHandler);

export default router;