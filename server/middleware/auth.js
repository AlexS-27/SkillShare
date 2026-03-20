// server/middleware/auth.js
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ message: "Token requis" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // On attache l'ID utilisateur à la requête
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token invalide" });
    }
};