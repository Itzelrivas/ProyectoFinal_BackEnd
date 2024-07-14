import nodemailer from 'nodemailer'
import config from '../../config/config.js' //Esto es para traerme las variables de entorno

//Configuración de transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.email,
        pass: config.appEmailPass
    }
})

//Verificamos que los datos que estoy pasando a Nodemailer estan ok
transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
})


export const sendEmail = async (email, ticket) => {
    try {
        //Generamos el contenido del correo electrónico con los detalles del ticket
        const mailContent = `
            <div>
                <h3>¡Gracias por tu compra!</h3>
                <p>Se ha finalizado la compra del usuario registrado con el correo: ${ticket.purchaser}</p>
                <p>Monto de la compra: $${ticket.amount}</p>
                <p>Fecha y hora de la compra: ${ticket.purchase_datetime}</p>
                <p>Detalles del ticket:</p>
                <ul>
                    <li>Código del ticket: ${ticket.code}</li>
                    <!-- Otros detalles del ticket si es necesario -->
                </ul>
            </div>
        `;

        //Configuración del correo electrónico
        const mailOptions = {
            from: "Ticket Compra - Proyecto Finsl " + config.email,
            to: email,
            subject: 'Ticket de compra',
            html: mailContent,
            attachments: []
        };
        
        // Envía el correo electrónico
        await transporter.sendMail(mailOptions);
        console.log('Correo electrónico enviado correctamente a ' + email);
    } catch (error) {
        console.error("Error al enviar el correo electrónico: " + error);
    }
};

//Chicle y pega en el service de users
export const sendDeletionEmail = async (user) => {
    const mailOptions = {
        from: "Cuenta Inactiva - Proyecto Finsl " + config.email,
        to: user.email,
        subject: 'Cuenta Eliminada por Inactividad',
        text: `Hola ${user.first_name} ${user.last_name},\n\nTu cuenta ha sido eliminada debido a inactividad en los últimos 2 días.\n\nSaludos,\nEquipo de Soporte de Pancho Ross :)`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(`Error al enviar el correo a ${user.email}: ${error}`);
    }
};

//Eliminamos un producto creado por un usuario premium
export const emailDeleteProduct = async (product) => {
    const mailOptions = {
        from: "Producto Eliminado - Proyecto Final " + config.email,
        to: product.owner.email,
        subject: 'Cuenta Eliminada por Inactividad',
        text: `Hola ${product.owner.name},\n\n El producto: ${product.title} que tu agregaste, ha sido eliminado de la base de datos de Pancho Ross.\n\nSaludos,\nEquipo de Soporte de Pancho Ross :)`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(`Error al enviar el correo a ${product.owner.email}: ${error}`);
    }
}