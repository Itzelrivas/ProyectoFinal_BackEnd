import chai from 'chai';
import supertest from 'supertest';
import config from '../../src/config/config.js';
//import mocha from 'mocha'

const expect = chai.expect;
//const requester = supertest('http://localhost:9090')
const requester = supertest(`http://localhost:${config.port}`);

let sessionCookie;


describe("Test Carts", () => { 
    /*let cookie;

    before(async function() {
        const userLogin = {
            email: 'itzelrivas38@outlook.com',
            password: '123'
        }

        const session = await requester.post('/api/sessions/login').send(userLogin);
        cookie = session.headers['set-cookie'][0]; 
        console.log('Session Cookie:', cookie);
    });*/

    before((done) => {
        requester
            .post('/api/sessions/login')
            .send({
                email: 'itzelrivas38@outlook.com',
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

        /*before((done) => {
            requester
                .post('/api/sessions/login')
                .send({
                    email: 'itzelrivas38@outlook.com',
                    password: '123'
                })
                .end((err, res) => {
                    if (err) return done(err);
                    //nuevo
                    sessionCookie = res.headers['set-cookie'].pop().split(';')[0];
                    done();
                });
        });*/


        //Test 1
        it("Crear Carrito: El API POST /api/carts debe crear un nuevo carrito correctamente", async () => {
            // Given
            /*const cartMock = {
                id: 1234,
                products: [
                    {
                        "product": "65ed5a133a890cee080fc502",
                        "quantity": 3,
                        "_id": "65f881834e66b126e9887c77"
                    }
                ]
            }*/

            // Then
            const { body, statusCode } = await requester.post("/api/carts")
            // console.log(result);

            // Assert
            expect(statusCode).to.eql(201)
            expect(body).to.have.property('message').that.includes('Se ha creado un nuevo carrito con id');
            //expect(body).to.have.property('message').that.includes('Se ha creado un nuevo carrito con id');
        })

        //Test 2
        it("Agregar Producto a Carrito: El API POST /api/carts/:cid/product/:pid debe agregar un producto a un carrito correctamente", async () => {
            // Given: Primero, 
            const result = await requester.post("/api/carts")
            //console.log(result._body.payload.id)
            //expect(result.status).to.eql(201)
            const createdCartId = result._body.payload.id
            //console.log(typeof(createdProductId))
            const productId = 1736
            //console.log(typeof(productMockId))

            // Then: Ahora, agregamos el producto al carrito
            const resultAdd = await requester.post(`/api/carts/${createdCartId}/product/${productId}`)
            
            // Assert: Verificamos que se agregue correctamente el producto al carrito
            expect(resultAdd.status).to.eql(200)
            //expect(result.body).to.include(`Se ha agregado el producto con el id=${productMockId} al carrito con id=${createdProductId}`)
        })

        
        // Test 3:
        it("Finalizar Compra: El API POST /api/carts/purchaseUserCart debe finalizar la compra del carrito del usuario logueado correctamente", async () => {
            //this.timeout(5000)
            /*const userLogin = {
                email: 'itzelrivas38@outlook.com',
                password: '123'
            }
    
            const session = await requester.post('/api/sessions/login').send(userLogin);
            //console.log(session)
            const token = session.body.token;*/

            // Then: Finalizar la compra del carrito del usuario logueado
            //const resultFinish = await requester.post("/api/carts/purchaseUserCart")
            const resultFinish = await requester.post("/api/carts/purchaseUserCart")
                .set('Cookie', sessionCookie) 
                
            //console.log(resultFinish);
            // Assert: Verificamos que la compra se haya finalizado correctamente
            expect(resultFinish.status).to.eql(201);
            //expect(purchaseBody).to.include(`Todos los productos fueron procesados correctamente. La compra ha finalizado exitosamente :)`);
        });

        after(async () => {
            await requester.get('/api/sessions/logout').set('Cookie', sessionCookie);
        });
    })
})