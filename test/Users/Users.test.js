import chai from 'chai';
import supertest from 'supertest';
import config from '../../src/config/config.js';

const expect = chai.expect;
const requester = supertest(`http://localhost:${config.port}`);

const userPayload = {
    name: 'Test Products',
    email: 'testEmail@prueba.com',
    role: 'admin'
};

let sessionCookie;

describe("Test Userss", () => {

    describe("Testing Users Api", () => {

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

        //Test 1: accedemos a los users
        it("Accedemos a los usuarios: El API GET /api/users debe mostrar los usuarios regustrados en la base de datos. Esta funcion solo esta disponible para usuarios logueados con user admin.", async () => {
            
            //Then
            const result = await requester.get("/api/users")
                .set('Cookie', sessionCookie) 

            //Assert
            expect(result.statusCode).to.eql(201);
        })

        //Test 2: accedemos a los users que su ultima conexion fue hace dos dias
        it("Accedemos a los usuarios: El API GET /api/users/inactive debe mostrar los usuarios que su ultima conexión fue hace al menos dos días. Esta funcion solo esta disponible para usuarios logueados con user admin.", async () => {
            
            //Then
            const result = await requester.get("/api/users/inactive")
                .set('Cookie', sessionCookie) 

            //Assert
            expect(result.statusCode).to.eql(201);
        })
    })
})