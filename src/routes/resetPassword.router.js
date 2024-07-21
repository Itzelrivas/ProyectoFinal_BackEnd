import express from 'express';
import { sendEmailPasswordController, updatePasswordController } from '../controllers/users.Controller.js';

const router = express.Router();

//Ruta para acceder a la vista temporal que me ayudará a resetear la contraseña
router.get('/:token', updatePasswordController); 
//router.post('/:token', updatePasswordController);

//Ruta para mandar un nuevo token para la vista de reset, por si ya se cumplió el tiempo de vida.
router.post('/newLink/:email', sendEmailPasswordController);

export default router;