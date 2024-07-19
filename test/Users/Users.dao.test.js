import mongoose from "mongoose";
import chai from "chai";
import bcrypt from "bcrypt";
import config from "../../src/config/config.js";
import { changeRolGeneralService, changeRolService, deleteUserService, getUser_IdService, registerUser, sendEmailPasswordService, updatePasswordService, verifyEmailService } from "../../src/services/users.Service.js";

mongoose.connect(config.mongoTest)

const expect = chai.expect;

describe('Testing Users Services', () => {

    before(async function () {
        this.timeout(5000); 
        await mongoose.connection.once('open', () => {
            console.log('Connected to MongoDB');
        });

        this.timeout(5000);
        await mongoose.connection.collections.users.drop();
    });

    /*beforeEach(async function () {
        this.timeout(5000);
        await mongoose.connection.collections.users.drop();
    });*/

    //Test 1
    it('El service debe agregar un nuevo usuario correctamente a la BD.', async function () {
        //Given 
        const newUser = {
            first_name: "Test",
            last_name: "User",
            email: "testUsers@prueba.com",
            age: 30,
            password: "123456", 
            role: 'admin',
            cart: "" 
        }

        //Then
        const result = await registerUser(newUser);

        //Assert 
        expect(result).to.have.property('_id');
        expect(result.first_name).to.equal(newUser.first_name);
        expect(result.last_name).to.equal(newUser.last_name);
        expect(result.email).to.equal(newUser.email);
        expect(result.age).to.equal(newUser.age);
        expect(result.role).to.equal(newUser.role);
    });

     //Test 2: Verifica si un email ya esta registrado en la bd.
     it('El service debe verificar si un email está registrado.', async function () {
        //Given
        const email = "testUsers@prueba.com";

        //Then
        const result = await verifyEmailService(email);

        //Assert
        expect(result).to.be.an('object');
    });

    //Test 3: Actualizar contraseña
    it('El service debe actualizar la contraseña de un usuario.', async function () {
        // Given
        const newUser = {
            first_name: "Test",
            last_name: "User",
            email: "i.canorivas@ugto.mx",
            age: 30,
            password: "123456",
            role: 'admin',
            cart: ""
        };
        const user = await registerUser(newUser);

        //Then
        const newPassword = "new"
        const result = await updatePasswordService(user._id, newPassword);

        //Assert
        expect(result).to.have.property('_id');
        expect(result.first_name).to.equal(newUser.first_name);
        const isPasswordUpdated = await bcrypt.compare(newPassword, result.password);
        expect(isPasswordUpdated).to.be.true;
    });

    //Test 4: Enviar correo para restablecer contraseña
    it('El service debe enviar un correo para restablecer la contraseña.', async function () {
        this.timeout(5000);//se me esta crasheando por el tiempo de espera
        // Given
        const email = "i.canorivas@ugto.mx";

        //Then
        const result = await sendEmailPasswordService(email);
        console.log(result)
        //Assert
        expect(result).to.be.true;
    });

     //Test 5: Obtener usuario por ID
     it('El service debe devolver un usuario por su _ID.', async function () {
        // Given
        const newUser = {
            first_name: "Test",
            last_name: "User",
            email: "testGetUserById@prueba.com",
            age: 30,
            password: "123456",
            role: 'admin',
            cart: ""
        };
        const user = await registerUser(newUser);

        //Then
        const result = await getUser_IdService(user._id);

        //Assert
        expect(result).to.have.property('_id');
        expect(result.email).to.equal(newUser.email);
    });

    //Test 6: Cambiar rol de usuario
    it('El service debe cambiar el rol de un usuario user <-> premium.', async function () {
        this.timeout(5000)
        //Given
        const newUser = {
            first_name: "Test",
            last_name: "User",
            email: "testChangeRole@prueba.com",
            age: 30,
            password: "123456",
            role: 'user',
            cart: ""
        };
        const user = await registerUser(newUser);

        //Then
        await changeRolService(user._id);
        const result = await getUser_IdService(user._id);

        //Assert
        expect(result.role).to.equal('premium');
    });

     //Test 7: Cambiar rol de usuario con rol específico
     it('El service debe cambiar el rol de un usuario a un rol específico.', async function () {
        //Given
        const email = "testUsers@prueba.com";
        const user = await verifyEmailService(email);

        //Then
        await changeRolGeneralService(user._id, 'user');
        const result = await getUser_IdService(user._id);

        //Assert
        expect(result.role).to.equal('user');
    });

    //Test 8: Eliminar usuario
    it('El service debe eliminar un usuario por su _ID.', async function () {
        //Given
        const email = "testUsers@prueba.com";
        const user = await verifyEmailService(email);

        //Then
        await deleteUserService(user._id);
        const result = await getUser_IdService(user._id);

        //Assert
        expect(result).to.be.null;
    });
});