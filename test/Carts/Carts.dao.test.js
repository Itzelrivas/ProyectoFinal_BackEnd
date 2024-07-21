import mongoose from "mongoose";
import chai from "chai";
import { addProductToCartService, createCartService, deleteProductToCartService, getCartPopService, getCartsService, purchaseCartService, updateCantProductsService } from "../../src/services/carts.Service.js";
import config from "../../src/config/config.js";
import { newProductService } from "../../src/services/products.Service.js";

//Base de datos para testing
mongoose.connect(config.mongoTest)

const expect = chai.expect;

describe('Testing Carts Service', () => {

    before(async function () {
        this.timeout(5000); 
        await mongoose.connection.once('open', () => {
            console.log('Connected to MongoDB');
        });
    });

    beforeEach(async function () {
        this.timeout(7000);
        await mongoose.connection.collections.carts.drop();
        await mongoose.connection.collections.products.drop();
    });

    //Test 1: devolver los carts
    it('El servicio debe devolver los carts en formato de arreglo.', async function () {
        // Given
        let emptyArray = [];

        // Then
        const result = await getCartsService();

        // Assert 
        expect(result).to.be.deep.equal(emptyArray);
        expect(Array.isArray(result)).to.be.ok;
        expect(Array.isArray(result)).to.be.equal(true);
        expect(result.length).to.be.deep.equal(emptyArray.length);
    });

    //Test 2: Agregamos un cart a la base de datos
    it('El service debe agregar un cart correctamente a la BD.', async function () {
        //Given 
        const cart = {
            products: []
        }
        //Then
        const result = await createCartService(cart);
        //Assert 
        expect(result._id).to.be.ok;
    });

    //Test 3: Obtener un carrito mediante su _id
    it('El servicio debe obtener un carrito específico mediante su id.', async function () {
        const cart = {
            products: []
        };
        const createdCart = await createCartService(cart);

        const result = await getCartPopService(createdCart.id);
        expect(result).to.be.an('object');
        expect(result.id.toString()).to.equal(createdCart.id.toString());
    });

    //Test 4: Agregar un producto a un carrito
    it('El servicio debe agregar un producto a un carrito.', async function () {
        //Given 
        const productMock = {
            owner: {
                name: "test",
                email: "test@algo.com",
                role: "admin"
            },
            title: "Vestido cafe oscuro Guess",
            description: "Vestido con cuello cruzado y con tela brillante",
            code: "VCG_G_02",
            price: 800,
            stock: 2,
            category: "vestido",
            thumbnail: './test/files/vestidoNegro-G.jpeg',
            id:1234,
        }
        const resultProduct = await newProductService(productMock);
        const productId = resultProduct.id
    
        const cart = {
            products: []
        };
        const createdCart = await createCartService(cart);

        //Then
        await addProductToCartService(createdCart.id, productId);
        const result = await getCartPopService(createdCart.id);
        
        //Assert
        expect(result.products).to.be.an('array').that.is.not.empty;
        const productIdsInCart = result.products.map(item => item.product.id);
        expect(productIdsInCart).to.include(productId);
    });

    // Test 5: Eliminamos un producto de un carrito
    it('El servicio debe eliminar un producto de un carrito.', async function () {
        //Given: creo un producto y lo agrego a un nuevo carrito
        const productMock = {
            owner: {
                name: "test",
                email: "test@algo.com",
                role: "admin"
            },
            title: "Vestido cafe oscuro Guess",
            description: "Vestido con cuello cruzado y con tela brillante",
            code: "VCG_G_02",
            price: 800,
            stock: 2,
            category: "vestido",
            thumbnail: './test/files/vestidoNegro-G.jpeg',
            id:1234,
        }
        const resultProduct = await newProductService(productMock);
        const productId = resultProduct.id
       
        const cart = {
            products: []
        };
        const createdCart = await createCartService(cart);

        await addProductToCartService(createdCart.id, productId);
        
        //Then: eliminamos el producto del cart
        await deleteProductToCartService(createdCart.id, productId);
        const result = await getCartPopService(createdCart.id);

        //Assert
        const productIdsInCart = result.products.map(item => item.product.id);
        expect(productIdsInCart).to.not.include(productId);
    });

    //Test 6: Actualizamos la cantidad de un producto en un carrito
    it('El servicio debe actualizar la cantidad de un producto en un carrito.', async function () {
        //Given
        const productMock = {
            owner: {
                name: "test",
                email: "test@algo.com",
                role: "admin"
            },
            title: "Vestido cafe oscuro Guess",
            description: "Vestido con cuello cruzado y con tela brillante",
            code: "VCG_G_02",
            price: 800,
            stock: 2,
            category: "vestido",
            thumbnail: './test/files/vestidoNegro-G.jpeg',
            id:1234,
        }
        const resultProduct = await newProductService(productMock);
        const productId = resultProduct.id
       
        const cart = {
            products: []
        };
        const createdCart = await createCartService(cart);
        await addProductToCartService(createdCart.id, productId);

        //Then
        const newQuantity = 5;
        await updateCantProductsService(createdCart.id, productId, newQuantity);

        //Assert
        const result = await getCartPopService(createdCart.id);
        expect(result.products.find(p => p.product.id === productId).quantity).to.equal(newQuantity);
    });

    //Test 7: Finalizamos la compra y se genera el ticket.
    it('El servicio debe finalizar la compra y generar el ticket.', async function () {
        //Given: creamos un carrito y le agregamos un producto
        const productMock = {
            owner: {
                name: "test",
                email: "test@algo.com",
                role: "admin"
            },
            title: "Vestido cafe oscuro Guess",
            description: "Vestido con cuello cruzado y con tela brillante",
            code: "VCG_G_02",
            price: 800,
            stock: 2,
            category: "vestido",
            thumbnail: './test/files/vestidoNegro-G.jpeg',
            id:1234,
        }
        const resultProduct = await newProductService(productMock);
        const productId = resultProduct.id
       
        const cart = {
            products: []
        };
        const createdCart = await createCartService(cart);
        await addProductToCartService(createdCart.id, productId);

        const email = 'itzelrivas38@outlook.com';

        //Then
        const result = await purchaseCartService(createdCart.id, email);

        //Assert
        expect(result.success).to.be.true;
        expect(result.message).to.equal("Compra finalizada exitosamente");
    });
});