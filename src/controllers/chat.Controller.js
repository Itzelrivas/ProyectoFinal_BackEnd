//Render del chat
export const messagesController = async (request, response) =>{
    response.render('chat', {
        style: "viewsHandlebars.css"
    })
    /*const userEmail = request.session.user.email; // Obtener el correo de la sesión
    response.render('chat', {
        style: "viewsHandlebars.css",
        email: userEmail // Pasar el correo a la vista
    });*/
}