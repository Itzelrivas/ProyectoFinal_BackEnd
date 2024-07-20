import chai from 'chai';
import supertest from 'supertest';
import config from '../../src/config/config.js';

const expect = chai.expect;
const requester = supertest(`http://localhost:${config.port}`);

//mongoose.connect(`mongodb+srv://Itzelrivas0803:R1v450803@cluster0.zqvjwvn.mongodb.net/ecommerce-test?retryWrites=true&w=majority&appName=Cluster0`)

describe("Testing sessions y cookies", () => {

    before(function () {
        this.cookie;
        this.mockUser = {
            first_name: "Test",
            last_name: "Sessions",
            email: "testingEmail@pruebaSessions.com",
            age: 176,
            password: "123",
            role: 'premium',
            specialPassword: '321'
        }
    })

     // Test_01
     it("Test Registro Usuario: Debe poder registrar correctamente un usuario",async function () {
        //Then
        const result = await requester.post('/api/sessions/register').send(this.mockUser)
        
        //Assert
        expect(result.status).to.equal(200);
    })

    //Test 2
    it("Test Login Usuario: Debe poder hacer login correctamente con el usuario registrado previamente.", async function () {
        // Given
        const mockLogin = {
            email: this.mockUser.email,
            password: this.mockUser.password
        }

        // Then
        const result = await requester.post('/api/sessions/login').send(mockLogin)
        
        const cookieResult = result.headers['set-cookie'][0]
        const cookieData = cookieResult.split("=")
        this.cookie = {
            name: cookieData[0],
            value: cookieData[1]
        }

        // Assert
        expect(result.statusCode).is.eqls(200)
        expect(this.cookie.name).to.be.ok.and.eql('connect.sid')
        expect(this.cookie.value).to.be.ok
    })

    //Test 3: logOut
    it("Test Logout Usuario: Debe poder hacer logout correctamente", async function () {
        const result = await requester.get('/api/sessions/logout')

        expect(result.status).to.equal(201);
    });
});