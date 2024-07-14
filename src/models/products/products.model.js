import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollection = 'products';

const stringTypeSchemaRequired = {
    type: String,
    required: true
};

const numberTypeSchemaRequired = {
    type: Number,
    required: true
}

const productsSchema = new mongoose.Schema({
    id: Number,
    title: stringTypeSchemaRequired,
    description: stringTypeSchemaRequired,
    code: stringTypeSchemaRequired,
    price: numberTypeSchemaRequired,
    stock: numberTypeSchemaRequired,
    category: stringTypeSchemaRequired,
    thumbnail: {
        type:Array,
        default:[]
    },
    status: {
        type: Boolean,
        default: true
    },
    owner: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['admin', 'premium'], 
            required: true
        }
    }
})

productsSchema.plugin(mongoosePaginate)
export const productsModel = mongoose.model(productsCollection, productsSchema)