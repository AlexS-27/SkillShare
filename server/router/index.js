/*
File : server/router/index.js
Description : Route for the redirection
Autor : Kilian Testard, Alex Kamano
Version : 1.0
Project : SkillShare
Date : 6 Mars 2026
*/
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { register, login, purchaseService } from '../db_manager.js';
import { isPasswordStrong } from '../utils.js';
import { logInfo, logWarn, logError } from '../logger.js';
import { verifyToken, tokenBlacklist } from '../middleware/auth.js'; // Import du middleware et de la blacklist

const app = express(); // express initialisation


// security against brute forcing
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min.
    max: 5, // limit at 5 attemps for an IP
    message: "Too many login attempts. Please try again in 15 minutes."
});

app.use(helmet()); // protection against the failures HTTP

const corsOptions = {
    origin: 'http://localhost:5173', // only the frontend is authorized to do actions
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// extract a safe IP string from the request
const getIp = (req) =>
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ?? req.socket.remoteAddress ?? 'unknown';

// routes
/**
 * Check if the password is correct then post the data
 * @param {string} password
 * @param {string} name
 * @returns {[boolean, string]} A table with the status and the message
 */
// route to the register
app.post('/register', async (req, res) => {
    const { name, password } = req.body;
    const ip = getIp(req);

    // security validation for the password
    const [isValid, message] = isPasswordStrong(password);
    if (!isValid) {
        logWarn('REGISTER_FAIL', `ip=${ip} pseudo="${name}" reason="${message}"`);
        return res.status(400).json({ success: false, message: message });
    }

    // call the function to register
    const result = await register(name, password);

    if (result.success) {
        logInfo('REGISTER_SUCCESS', `ip=${ip} pseudo="${name}"`);
        res.status(201).json(result);
    } else {
        logWarn('REGISTER_FAIL', `ip=${ip} pseudo="${name}" reason="${result.message}"`);
        res.status(400).json(result);
    }
});

/**
 * Check if the fileds aren't empty then post the data to supabase and return the pseudo, sold and id
 * @param {string} password
 * @param {string} name
 * @returns {[boolean, string]} A table with the status and the message
 */

app.post('/login', loginLimiter,async (req, res) => {
    const { name, password } = req.body;
    const ip = getIp(req);

    if (!name || !password) {
        logWarn('LOGIN_FAIL', `ip=${ip} reason="missing fields"`);
        return res.status(400).json({success: false, message: "Missing required fields"});
    }

    const result = await login(name, password);

    if (result.success) {
        logInfo('LOGIN_SUCCESS', `ip=${ip} pseudo="${name}"`);
        res.status(201).json(result);
    } else {
        logWarn('LOGIN_FAIL', `ip=${ip} pseudo="${name}" reason="${result.message}"`);
        res.status(401).json(result); // unauthorized connexion
    }
});

/**
 * Route pour se déconnecter (invalider le token)
 */
app.post('/logout', verifyToken, (req, res) => {
    // Récupérer le token depuis le header
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {
        // Ajouter le token à la liste noire pour l'invalider
        tokenBlacklist.add(token);
    }

    res.status(200).json({ success: true, message: "Déconnexion réussie, token invalidé" });
});

/**
 * Route pour l'achat d'un service
 * @param {string|number} buyerId - L'ID de l'acheteur
 * @param {string|number} serviceId - L'ID du service à acheter
 * @param {number} price - Le prix du service (optionnel, selon comment ta DB gère ça)
 */
app.post('/api/purchase', verifyToken, async (req, res) => { // Ajout de verifyToken pour sécuriser l'achat
    const { buyerId, serviceId } = req.body; // price is managed by purchaseService
    const ip = getIp(req);

    if (!buyerId || !serviceId) {
        logWarn('PURCHASE_FAIL', `ip=${ip} reason="missing fields"`);
        return res.status(400).json({
            success: false,
            message: "Missing required fields (buyerId, serviceId)"
        });
    }

    try {
        const result = await purchaseService(buyerId, serviceId);

        if (result.success) {
            logInfo('PURCHASE_SUCCESS', `ip=${ip} buyerId="${buyerId}" serviceId="${serviceId}"`);
            res.status(200).json(result);
        } else {
            logWarn('PURCHASE_FAIL', `ip=${ip} buyerId="${buyerId}" serviceId="${serviceId}" reason="${result.message}"`);
            res.status(400).json(result);
        }
    } catch (error) {
        logError('SERVER_ERROR', `ip=${ip} route="POST /api/purchase" error="${error.message}"`);
        console.error("Erreur lors de l'achat :", error);
        res.status(500).json({ success: false, message: "Internal server error during purchase" });
    }
});

// global error handler — catches any unhandled throw in a route
app.use((err, req, res, _next) => {
    const ip = getIp(req);
    logError('SERVER_ERROR', `ip=${ip} route="${req.method} ${req.path}" error="${err.message}"`);
    res.status(500).json({ success: false, message: "Internal server error" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server run on http://localhost:${PORT}`);
});