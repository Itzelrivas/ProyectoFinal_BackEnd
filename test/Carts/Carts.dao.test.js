import mongoose from "mongoose";
import chai from "chai";
import { addProductToCartService, createCartService, deleteProductToCartService, getCartPopService, getCartsService, purchaseCartService, updateCantProductsService } from "../../src/services/carts.Service.js";
import config from "../../src/config/config.js";
import { newProductService } from "../../src/services/products.Service.js";

//mongoose.connect(`mongodb+srv://Itzelrivas0803:R1v450803@cluster0.zqvjwvn.mongodb.net/ecommerce-test?retryWrites=true&w=majority&appName=Cluster0`)
mongoose.connect(config.mongoTest)

const expect = chai.expect;

describe('Testing Carts Service', () => {

    before(async function () {
        this.timeout(5000); // Incrementa el tiempo de espera si es necesario
        await mongoose.connection.once('open', () => {
            console.log('Connected to MongoDB');
        });
    });

    beforeEach(async function () {
        this.timeout(7000);
        await mongoose.connection.collections.carts.drop();
        await mongoose.connection.collections.products.drop();
    });

    //Test 1
    it('El servicio debe devolver los carts en formato de arreglo.', async function () {
        // Given
        let emptyArray = [];

        // Then
        const result = await getCartsService();

        // Assert 
        //console.log(result);
        expect(result).to.be.deep.equal(emptyArray);
        expect(Array.isArray(result)).to.be.ok;
        expect(Array.isArray(result)).to.be.equal(true);
        expect(result.length).to.be.deep.equal(emptyArray.length);
    });

    //Test 2
    it('El service debe agregar un cart correctamente a la BD.', async function () {
        //Given 
        const cart = {
            products: []
        }
        //Then
        const result = await createCartService(cart);
        //console.log(result)
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

        //Then
        const resultProduct = await newProductService(productMock);
        const productId = resultProduct.id
        //const product_Id = resultProduct._id

        const cart = {
            products: []
        };
        const createdCart = await createCartService(cart);

        await addProductToCartService(createdCart.id, productId);
        const result = await getCartPopService(createdCart.id);
        //console.log('Result from addProductToCartService:', result.toString());

        //expect(result).to.be.an('object');
        expect(result.products).to.be.an('array').that.is.not.empty;

        // Convertir ObjectId a string para la comparación
        const productIdsInCart = result.products.map(item => item.product.id);
        //console.log(productIdsInCart)
        expect(productIdsInCart).to.include(productId);
        //expect(result.products).to.include(product_Id);
    });

    //No funciona
    // Test 5: Eliminar un producto de un carrito
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
        
        //eliminamos el producto
        await deleteProductToCartService(createdCart.id, productId);
        const result = await getCartPopService(createdCart.id);
        const productIdsInCart = result.products.map(item => item.product.id);
        //console.log(productIdsInCart)
        expect(productIdsInCart).to.not.include(productId);
    });

    //Test 6: Actualizar la cantidad de un producto en un carrito
    it('El servicio debe actualizar la cantidad de un producto en un carrito.', async function () {
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

        const newQuantity = 5;
 
        await updateCantProductsService(createdCart.id, productId, newQuantity);
        const result = await getCartPopService(createdCart.id);


        //const productIdsInCart = result.products.map(item => item.product.id.toString());
        //const productQuantitiesInCart = result.products.map(item => item.quantity);
        //console.log('Product IDs in Cart:', productIdsInCart);
        //console.log('Product Quantities in Cart:', productQuantitiesInCart);


        /*console.log(result)
        const productQuantity = result.products
        console.log(productQuantity)*/
        //console.log(result.products)
        //const test = result.products.find(p => p.product.id === productId).quantity
        //console.log(test)
        expect(result.products.find(p => p.product.id === productId).quantity).to.equal(newQuantity);
    });

    //Test 7
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

        const result = await purchaseCartService(createdCart.id, email);
        console.log('Result from purchaseCartService:', result);

        expect(result.success).to.be.true;
        expect(result.message).to.equal("Compra finalizada exitosamente");
    });
});