import {jwtSecretKey} from '../config.js';
import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.slice(7);

        if (!token)
            return res.status(403).json({ message: "no Token provieded " });

        const decoded = jwt.verify(token, jwtSecretKey);
        req.Userid = decoded.id;

        const user = await User.findById(req.Userid, { password: 0 });
        if (!user) return res.status(404).json({ message: "user not found" });

        next();
    } catch (error) {

        
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(401).json({ message: "invalid token" });
    }
};