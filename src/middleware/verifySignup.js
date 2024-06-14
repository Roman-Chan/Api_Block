import User from "../models/User.js";

export const verifyDuplicateEmail = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (user)
        return res.status(409).json({ message: "El correo ya esta en uso" });

    next();
};

export const verifyDuplicateUsername = async (req, res, next) => {
    const user = await User.findOne({ username: req.body.username });
    if (user)
        return res.status(409).json({ message: "El nombre de usario ya esta en uso" });
    next();
};
