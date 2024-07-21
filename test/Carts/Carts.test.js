import chai from 'chai';
import supertest from 'supertest';
import config from '../../src/config/config.js';

const expect = chai.expect;
const requester = supertest(`http://localhost:${config.port}`);

let sessionCookie;

describe("Test Carts", () => { 

    before((done) => {
        requester
            .post('/api/sessions/login')
            .send({
                email: 'i.canorivas@ugto.mx',
                password: '123'
            })
            .end((err, res) => {
                if (err) return done(err);
                //nuevo
                sessionCookie = res.headers['set-cookie'].pop().split(';')[0];
                done();
            });
    });

    describe("Testing Carts Api", () => {

        //Test 1: Creamos un carrito
        it("Crear Carrito: El API POST /api/carts debe crear un nuevo carrito correctamente", async () => {
            // Then
            const { body, statusCode } = await requester.post("/api/carts")

            // Assert
            expect(statusCode).to.eql(201)
            expect(body).to.have.property('message').that.includes('Se ha creado un nuevo carrito con id');
        })

        //Test 2: Agregamos un producto a un carrito
        it("Agregar Producto a Carrito: El API POST /api/carts/:cid/product/:pid debe agregar un producto a un carrito correctamente", async () => {
            // Given: 
            const result = await requester.post("/api/carts")
            const createdCartId = result._body.payload.id
            const productId = 1736

            // Then: Ahora, agregamos el producto al carrito
            const resultAdd = await requester.post(`/api/carts/${createdCartId}/product/${productId}`)
            
            // Assert: Verificamos que se agregue correctamente el producto al carrito
            expect(resultAdd.status).to.eql(200)
        })

        
        // Test 3: finalizamos la compra del user logueado
        it("Finalizar Compra: El API POST /api/carts/purchaseUserCart debe finalizar la compra del carrito del usuario logueado correctamente", async () => {
            // Then: Finalizar la compra del carrito del usuario logueado
            const resultFinish = await requester.post("/api/carts/purchaseUserCart")
                .set('Cookie', sessionCookie) 
                
            // Assert: Verificamos que la compra se haya finalizado correctamente
            expect(resultFinish.status).to.eql(201);
        });

        after(async () => {
            await requester.get('/api/sessions/logout').set('Cookie', sessionCookie);
        });
    })
})