import mongoose from "mongoose";
import chai from "chai";
import { getProductsService, newProductService } from "../../src/services/products.Service.js";

mongoose.connect(`mongodb+srv://Itzelrivas0803:R1v450803@cluster0.zqvjwvn.mongodb.net/ecommerce-test?retryWrites=true&w=majority&appName=Cluster0`)

const expect = chai.expect;

describe('Testing Products Service', () => {

    before(async function () {
        this.timeout(5000); // Incrementa el tiempo de espera si es necesario
        await mongoose.connection.once('open', () => {
            console.log('Connected to MongoDB');
        });
    });

    beforeEach(async function () {
        this.timeout(5000);
        await mongoose.connection.collections.products.drop();
    });

    //Test 1
    it('El servicio debe devolver los productos en formato de arreglo.', async function () {
        // Given
        let emptyArray = [];

        // Then
        const result = await getProductsService();

        // Assert 
        console.log(result);
        expect(result).to.be.deep.equal(emptyArray);
        expect(Array.isArray(result)).to.be.ok;
        expect(Array.isArray(result)).to.be.equal(true);
        expect(result.length).to.be.deep.equal(emptyArray.length);
    });

    //Test 2
    it('El service debe agregar producto correctamente a la BD.', async function () {
        //Given 
        const productMock = {
            owner: "admin",
            title: "Vestido negro Guess",
            description: "Vestido con cuello cruzado y con tela brillante",
            code: "VNB_G_02",
            price: 900,
            stock: 2,
            category: "vestido",
            thumbnail: './test/files/vestidoNegro-G.jpeg'
        }

        //Then
        const result = await newProductService(productMock);

        //Assert 
        expect(result._id).to.be.ok;
    });
});