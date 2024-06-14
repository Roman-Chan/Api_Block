import User from "../models/User.js";
import { token } from "../middleware/token.js";

export const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res
                .status(400)
                .json({ message: "All fields are required." });
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "formato incorrecto de correo." });
        }

        // Expresiones regulares para verificar la seguridad de la contraseña
        const passwordRegex =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(password)) {
            let errorMessages = [];
            if (!/(?=.*[A-Za-z])/.test(password)) {
                errorMessages.push("debe contener al menos una letra");
            }
            if (!/(?=.*\d)/.test(password)) {
                errorMessages.push("debe contener al menos un número");
            }
            if (!/(?=.*[@$!%*?&])/.test(password)) {
                errorMessages.push(
                    "debe contener al menos un carácter especial (@, $, !, %, *, ?, &)"
                );
            }
            if (password.length < 8) {
                errorMessages.push("debe tener al menos 8 caracteres");
            }

            return res.status(400).json({
                message:
                    "La contraseña no es segura. " + errorMessages.join(", "),
            });
        }

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
        console.log(error);
        res.status(500).json({
            message: "Algo salió mal. Por favor, inténtalo de nuevo más tarde.",
        });
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
            return res.status(404).json({ message: "Correo incorrecto" });

        const matchPassword = await User.comparePassword(
            password,
            userFound.password
        );

        if (!matchPassword)
            return res.status(401).json({ message: "Contraseña incorrecta" });

        const createdToken = token(userFound._id);

        res.status(200).json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            token: createdToken,
        });
    } catch (error) {
        error;

        return res.status(500).json({ message: "Algo salio mal vuelve a interlo" });
    }
};
