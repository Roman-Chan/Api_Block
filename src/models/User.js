import { Schema, model } from "mongoose";
import bycript from "bcrypt";

export const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
},{
    versionKey: false,
    timestamps: true,
});


UserSchema.statics.encryptPassword = async (password) => {
    const salt = await bycript.genSalt(10);
    return bycript.hash(password, salt);
};

UserSchema.statics.comparePassword = async (password, recivePassword) => {
    return await bycript.compare(password, recivePassword);
};

export default model("User", UserSchema);
