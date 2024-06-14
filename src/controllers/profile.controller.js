import mongoose from "mongoose";
import User from "../models/User.js";

export const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email } = req.body;

        const updatedProfile = await User.findByIdAndUpdate(
            id,
            { username, email },
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        return res.status(200).json(updatedProfile);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).send({ message: "Invalid Id" });
        }
        return res.status(500).json({ message: "Error en el servidor" });
    }
};
