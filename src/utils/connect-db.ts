import mongoose from "mongoose";
import config from "../config/default";

const mongoUri = config.LOG

export default async () => {
    try {
        await mongoose.connect(mongoUri)
        console.log('Connected to database')
    } catch (error) {
        console.log(error + ' something went wrong with the database !')
    }
}