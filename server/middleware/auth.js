// server/middleware/auth.js
import jwt from 'jsonwebtoken';

// Création d'une liste noire en mémoire (Set) pour stocker les tokens expirés (déconnexion)
export const tokenBlacklist = new Set();

export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ message: "Token requis" });

    // 1. Vérifier si le token a été révoqué (blacklisté)
    if (tokenBlacklist.has(token)) {
        return res.status(401).json({ message: "Token expiré (utilisateur déconnecté)" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ta_cle_secrete_super_secure');
        req.user = decoded; // On attache l'ID utilisateur à la requête
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token invalide" });
    }
};