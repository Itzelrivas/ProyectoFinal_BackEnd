import { Router } from 'express';
import { getUsersController } from '../controllers/mockingProducts.Controller.js';
import { adminAuth } from '../../utils.js';
const router = Router();

export default router;

//Ruta que genera y entrega 100 productos con Mocking
router.get('/', adminAuth, getUsersController)