import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,

    },
    password: {
        type: String,
        required: true,
    },
})

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

export default User;