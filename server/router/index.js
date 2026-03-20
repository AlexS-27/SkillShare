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

// Importation de tes fichiers locaux (N'oublie jamais l'extension .js !)
import { register, login, purchaseService } from '../db_manager.js';
import { isPasswordStrong } from '../utils.js';

const app = express(); // Initialisation correcte d'express

// --- SECURITY (OWASP)

// Security Brut Force
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min.
    max: 5, // Limit at 5 attemps for an IP
    message: "Too many login attempts. Please try again in 15 minutes."
});

app.use(helmet()); // Protection against the failures HTTP

const corsOptions = {
    origin: 'http://localhost:5173', // Only the frontend is authorized to do actions
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// --- Routes ---
/**
 * Check if the password is correct then post the data
 * @param {string} password
 * @param {string} name
 * @returns {[boolean, string]} A table with the status and the message
 */
// Route to the register
app.post('/register', async (req, res) => {
    const { name, password } = req.body;

    // 1. Security validation for the password
    const [isValid, message] = isPasswordStrong(password);
    if (!isValid) {
        return res.status(400).json({ success: false, message: message });
    }

    // Call the function to register
    const result = await register(name, password);

    if (result.success) {
        res.status(201).json(result);
    } else {
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

    if (!name || !password) {
        return res.status(400).json({success: false, message: "Missing required fields"});
    }

    const result = await login(name, password);

    if (result.success) {
        res.status(201).json(result);
    } else {
        res.status(401).json(result); // Unauthorized connexion
    }
});

/**
 * Route pour l'achat d'un service
 * @param {string|number} buyerId - L'ID de l'acheteur
 * @param {string|number} serviceId - L'ID du service à acheter
 * @param {number} price - Le prix du service (optionnel, selon comment ta DB gère ça)
 */
app.post('/api/purchase', async (req, res) => {
    const { buyerId, serviceId } = req.body; // Le prix est géré en interne par purchaseService

    if (!buyerId || !serviceId) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields (buyerId, serviceId)"
        });
    }

    try {
        // On utilise bien purchaseService (le nom exporté de db_manager)
        const result = await purchaseService(buyerId, serviceId);

        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error("Erreur lors de l'achat :", error);
        res.status(500).json({ success: false, message: "Internal server error during purchase" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server run on http://localhost:${PORT}`);
});