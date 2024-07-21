import mongoose from "mongoose";
import chai from "chai";
import { deleteProductService, getProductIdService, getProduct_IdService, getProductsService, newProductService, updateProductService } from "../../src/services/products.Service.js";
import config from "../../src/config/config.js";

//Base de datos para testing
mongoose.connect(config.mongoTest)

const expect = chai.expect;

describe('Testing Products Service', () => {

    before(async function () {
        this.timeout(5000); 
        await mongoose.connection.once('open', () => {
            console.log('Connected to MongoDB');
        });
    });

    beforeEach(async function () {
        this.timeout(5000);
        await mongoose.connection.collections.products.drop();
    });

    //Test 1: nos devuelve los productos
    it('El servicio debe devolver los productos en formato de arreglo.', async function () {
        //Given
        let emptyArray = [];

        //Then
        const result = await getProductsService();

        //Assert 
        console.log(result);
        expect(result).to.be.deep.equal(emptyArray);
        expect(Array.isArray(result)).to.be.ok;
        expect(Array.isArray(result)).to.be.equal(true);
        expect(result.length).to.be.deep.equal(emptyArray.length);
    });

    //Test 2: agrega productos a la base de datos
    it('El service debe agregar producto correctamente a la BD.', async function () {
        //Given 
        const productMock = {
            owner: {
                name: "test",
                email: "test@algo.com",
                role: "admin"
            },
            title: "Vestido negro Guess",
            description: "Vestido con cuello cruzado y con tela brillante",
            code: "VNB_G_02",
            price: 900,
            stock: 2,
            category: "vestido",
            thumbnail: './test/files/vestidoNegro-G.jpeg',
            id:4321
        }

        //Then
        const result = await newProductService(productMock);

        //Assert 
        expect(result._id).to.be.ok;
    });

    //Test 3: nos devuelve un producto específico según su id.
    it('El service debe devolver un producto específico según su id.', async function () {
        //Given
        const productMock = {
            owner: {
                name: "test",
                email: "test@algo.com",
                role: "admin"
            },
            title: "Vestido negro Guess",
            description: "Vestido con cuello cruzado y con tela brillante",
            code: "VNB_G_02",
            price: 900,
            stock: 2,
            category: "vestido",
            thumbnail: './test/files/vestidoNegro-G.jpeg',
            id:4321
        };

        //Then
        const insertedProduct = await newProductService(productMock);
        const result = await getProductIdService(insertedProduct.id);

        //Assert
        expect(result.id.toString()).to.equal(insertedProduct.id.toString());
    });

    //Test 4: nos devuelve un producto específico según su _id.
    it('El service debe devolver un producto específico según su _id.', async function () {
        //Given
        const productMock = {
            owner: {
                name: "test",
                email: "test@algo.com",
                role: "admin"
            },
            title: "Vestido negro Guess",
            description: "Vestido con cuello cruzado y con tela brillante",
            code: "VNB_G_02",
            price: 900,
            stock: 2,
            category: "vestido",
            thumbnail: './test/files/vestidoNegro-G.jpeg',
            id:4321
        };

        //Then
        const insertedProduct = await newProductService(productMock);
        const result = await getProduct_IdService(insertedProduct._id);

        //Assert
        expect(result._id.toString()).to.equal(insertedProduct._id.toString());
    });

    //Test 5: actualiza un producto específico
    it('El service debe actualizar un producto específico.', async function () {
        //Given
        const productMock = {
            owner: {
                name: "test",
                email: "test@algo.com",
                role: "admin"
            },
            title: "Vestido negro Guess",
            description: "Vestido con cuello cruzado y con tela brillante",
            code: "VNB_G_02",
            price: 900,
            stock: 2,
            category: "vestido",
            thumbnail: './test/files/vestidoNegro-G.jpeg',
            id:4321
        };

        //Then
        const insertedProduct = await newProductService(productMock);
        const updateData = { 
            owner: {
                name: "test",
                email: "test@algo.com",
                role: "admin"
            },
            title: "Vestido negro Guess",
            description: "Vestido con cuello cruzado y con tela brillante",
            code: "VNB_G_03",
            price: 1200,
            stock: 3,
            category: "vestido",
            thumbnail: './test/files/vestidoNegro-G.jpeg',
            id:4321
        }; 
        await updateProductService(insertedProduct.id, updateData);
        const updatedProduct = await getProductIdService(insertedProduct.id);

        //Assert
        expect(updatedProduct.price).to.equal(updateData.price);
    });

    //Test 6: eliminamos un producto de la base de datos
    it('El servicio debe eliminar un producto correctamente de la BD.', async function () {
        //Given
        const productMock = {
            owner: {
                name: "test",
                email: "test@algo.com",
                role: "admin"
            },
            title: "Vestido negro Guess",
            description: "Vestido con cuello cruzado y con tela brillante",
            code: "VNB_G_03",
            price: 1200,
            stock: 3,
            category: "vestido",
            thumbnail: './test/files/vestidoNegro-G.jpeg',
            id:4321
        };

        //Then
        const createdProduct = await newProductService(productMock);

        //Verificamos que el producto se ha creado correctamente
        const productFromDb = await getProductIdService(createdProduct.id.toString());
        expect(productFromDb).to.not.be.null;

        await deleteProductService(createdProduct.id.toString());
        const deletedProduct = await getProductIdService(createdProduct.id.toString());

        //Assert
        expect(deletedProduct).to.be.null;
    });
});