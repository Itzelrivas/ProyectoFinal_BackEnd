import express from 'express';
import { getProductsCategoryCont, getProductsLimitPaginated, getProductsPaginatedButton, getProductsRTController, getProductsSortController } from "../controllers/products.Controller.js";
import { messagesController } from '../controllers/chat.Controller.js';
import { getProductsCart, getProductsCartUser } from '../controllers/carts.Controller.js';
import { premiumUserAuth } from '../../utils.js';

const router = express.Router();

//Ruta que muestra los productos no en tiempo real con pages y podemos poner limit
router.get("/home", getProductsLimitPaginated)

//Nos ordena los objetos ascendentemente seegún su precio
router.get("/home/sort", getProductsSortController)

//Ruta que filtra los productos por categoria
router.get("/home/search", getProductsCategoryCont)

//Ruta que muestra los productos en tiempo real
router.get("/realTimeProducts", getProductsRTController)

//Ruta que nos muestra el chat solo a los que tengan un rol user
router.get("/messages", premiumUserAuth, messagesController)

//Ruta que nos muestra los productos con paginación y botón para agregar al carrito
router.get("/products", getProductsPaginatedButton)

//Ruta que nos muestra los productos de un carrito
router.get('/carts/:c_id', getProductsCart)

//Ruta que nos muestra los productos del carrito del user logueado
router.get('/cartUser', getProductsCartUser)

export default router;