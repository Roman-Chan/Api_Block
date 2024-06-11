import User from "../models/User.js";
import { token } from "../middleware/token.js";

export const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password)
            return res.status(400).json({ message: "empity fields" });

        const newUser = new User({
            username,
            email,
            password: await User.encryptPassword(password),
        });

        const saveUser = await newUser.save();

        const createdToken = token(saveUser._id);

        res.status(200).json({
            id: saveUser._id,
            email: saveUser.email,
            username: saveUser.username,
            token: createdToken,
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: "empity fields" });

        const userFound = await User.findOne({
            email: req.body.email,
        });

        if (!userFound)
            return res.status(404).json({ message: "User not found" });

        const matchPassword = await User.comparePassword(
            password,
            userFound.password
        );

        if (!matchPassword)
            return res.status(401).json({ message: "Invalid password" });

        const createdToken = token(userFound._id);

        res.status(200).json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            token: createdToken,
        });
    } catch (error) {
        error;

        return res.status(500).json({ message: "Something went wrong" });
    }
};
