import { expect } from 'chai';
import supertest from 'supertest';
import config from '../../src/config/config.js';

const requester = supertest(`http://localhost:${config.port}`);

//Usuario de ejemplo (payload) para crear el token
const userPayload = {
    name: 'Test Products',
    email: 'testEmail@prueba.com',
    role: 'admin'
};

//let token;
let sessionCookie;

describe("Test Products", () => {

    describe("Testing Api Products", ()=> {

        before((done) => {
            requester
                .post('/api/sessions/login')
                .send({
                    email: 'testEmail@prueba.com',
                    password: 'testPassword'
                })
                .end((err, res) => {
                    if (err) return done(err);
                    sessionCookie = res.headers['set-cookie'].pop().split(';')[0];
                    done();
                });
        });


        //Test 1: creamos un nuevo producto
        it("Crear Producto: El API POST /api/products debe crear un nuevo producto correctamente", async () => {
            //Given
            const productMock = {
                owner: userPayload,
                title: "Vestido negro Guess",
                description: "Vestido con cuello cruzado y con tela brillante",
                code: "VNB_G_02",
                price: 900,
                stock: 2,
                category: "vestido",
                thumbnail: ""
            }

            //Then
            const result = await requester.post("/api/products")
                .set('Cookie', sessionCookie) 
                .field('title', productMock.title)
                .field('description', productMock.description)
                .field('code', productMock.code)
                .field('price', productMock.price)
                .field('stock', productMock.stock)
                .field('category', productMock.category)
                .attach('files', './test/files/vestidoNegro-G.jpeg')
                .field('owner', JSON.stringify(productMock.owner));

            //Assert
            expect(result.statusCode).to.eql(201);
        })

        //Test 2: creamos un producto sin algun parámetro
        it("Creamos producto sin algun parámetro: El API POST /api/products debe retornar un estado HTTP de 400", async () => {
            //Given
            const productMock = {
                owner: userPayload,
                title: "Vestido negro Guess",
                description: "Vestido con cuello cruzado y con tela brillante",
                code: "VNB_G_02",
                price: 900,
                stock: 2
            }

            // Then
            const result = await requester.post("/api/products")
                .set('Cookie', sessionCookie) 
                .field('title', productMock.title)
                .field('description', productMock.description)
                .field('code', productMock.code)
                .field('price', productMock.price)
                .field('stock', productMock.stock)
                .field('owner', JSON.stringify(productMock.owner));

            //Assert
            expect(result.statusCode).is.eql(400)
            expect(result.body).to.have.property('status', 'error');
            expect(result. body).to.have.property('msg', '¡Oh oh! No se han completado todos los campos requeridos.');
        })

    })

})