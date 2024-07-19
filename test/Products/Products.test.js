//import chai from 'chai';
import { expect } from 'chai';
import supertest from 'supertest';
import config from '../../src/config/config.js';
//import jwt from 'jsonwebtoken';

//import path from 'path';

//const expect = chai.expect;

//const requester = supertest('http://localhost:9090')
const requester = supertest(`http://localhost:${config.port}`);

//Firmamos el token JWT
//const secretKey = config.secret

// Usuario de ejemplo (payload) para crear el token
const userPayload = {
    name: 'Test Products',
    email: 'testEmail@prueba.com',
    role: 'admin'
};

//let token;
let sessionCookie;

//Simula rol de usuario actual
//let rolCurrentUser;*/

describe("Test Products", () => {

    describe("Testing Api Products", ()=> {

        //beforeEach((done) => {
        before((done) => {
            /*token = jwt.sign(userPayload, secretKey, { expiresIn: '1h' });
            console.log('Generated token:', token);
            done();*/
            requester
                .post('/api/sessions/login')
                .send({
                    email: 'testEmail@prueba.com',
                    password: 'testPassword'
                })
                .end((err, res) => {
                    if (err) return done(err);
                    //nuevo
                    sessionCookie = res.headers['set-cookie'].pop().split(';')[0];
                    done();
                });
        });


        //Test 1: crear un nuevo producto
        it("Crear Producto: El API POST /api/products debe crear un nuevo producto correctamente", async () => {
            //console.log(token)
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
                //thumbnail: ['./test/files/vestidoNegro-G.jpeg']
                //thumbnail: path.resolve('./test/files/vestidoNegro-G.jpeg') 
            }

            // Simular autenticación: establecer el rol en la sesión
            /*const sessionData = {
                user: {
                    role: 'admin' // Simular que el usuario tiene rol de administrador
                }
            };*/
            

            //Then
            const result = await requester.post("/api/products")
                //.set('Authorization', `Bearer ${token}`)
                //.set('Cookie', [`session=${encodeURIComponent(JSON.stringify(sessionData))}`])  
                //.set('Cookie', [`session=${JSON.stringify(userPayload)}`])
                .set('Cookie', sessionCookie) 
                .field('title', productMock.title)
                .field('description', productMock.description)
                .field('code', productMock.code)
                .field('price', productMock.price)
                .field('stock', productMock.stock)
                .field('category', productMock.category)
                .attach('files', './test/files/vestidoNegro-G.jpeg')
                //.attach('thumbnail', productMock.thumbnail)
                .field('owner', JSON.stringify(productMock.owner));

            //Assert
            expect(result.statusCode).to.eql(201);
        })

        //test 2
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
                //.set('Authorization', `Bearer ${token}`)
                //.set('Cookie', [`session=${encodeURIComponent(JSON.stringify(sessionData))}`])  
                //.set('Cookie', [`session=${JSON.stringify(userPayload)}`]) 
                .set('Cookie', sessionCookie) 
                .field('title', productMock.title)
                .field('description', productMock.description)
                .field('code', productMock.code)
                .field('price', productMock.price)
                .field('stock', productMock.stock)
                //.attach('files', './test/files/vestidoNegro-G.jpeg')
                .field('owner', JSON.stringify(productMock.owner));

            //Assert
            expect(result.statusCode).is.eql(400)
            expect(result.body).to.have.property('status', 'error');
            expect(result. body).to.have.property('msg', '¡Oh oh! No se han completado todos los campos requeridos.');
        })

    })

})