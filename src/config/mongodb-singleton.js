import config from "./config.js";
import mongoose from "mongoose";

export default class MongoSingleton{
    static #instance

    constructor(){
        this.#connectMongoDB();
    }

    static getInstance(){
        if(this.#instance){
            console.log("Ya hay una conexión a MongoDB")
        } else{
            this.#instance = new MongoSingleton();
        }
        return this.#instance
    }

    #connectMongoDB = async () => {
        try {
            await mongoose.connect(config.mongoUrl)
            console.log(`Conectado exitosamente a MongoDB. El proyecto esta levantado en el puerto ${config.port} :)`)
        } catch (error) {
            console.error("No se pudo conectar a la base de datos usando Mongoose: " + error)
            process.exit()
        }
    } 
}