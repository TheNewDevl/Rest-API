// Import Express
import express from "express";
import mongoose from "mongoose";
import cors from 'cors'
import path from "path";

import sauceRoutes from "./routes/sauce-routes";
import userRoutes from "./routes/user-routes";

// Start connexion to MongoDB
function connectDB(): void {
    const MONGO_URI: string | undefined = process.env.LOG
    mongoose.connect(String(MONGO_URI))
        .then(() => console.log("Connected to database"))
        .catch(err => console.log(err));
}

const app = express();

export function appRoutes() {

    // Start connexion to MongoDB
    connectDB()

    // Configure CORS for all routes
    app.use(cors())

    // Rend le corps le body de la requête exploitable. = parser
    app.use(express.json())

    // Sauce routes
    app.use('/images', express.static(path.join(__dirname, '../images')))
    app.use('/api/auth', userRoutes)
    app.use('/api/sauces', sauceRoutes)

    // app.use pour erreur 404
    app.use((req, res, next) => {
        res.status(404).send("Page not found")
    })

}

export default app 