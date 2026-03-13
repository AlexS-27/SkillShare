/*
File : server/utils.js
Description : File for the verifications and security local
Autor : Alex Kamano
Version : 1.0
Project : SkillShare
Date : 6 Mars 2026
*/

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Pour gérer les chemins de fichiers en mode "ES Modules"
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Check if the password is strong enough
 * @param {string} password
 * @returns {[boolean, string]} Un tableau contenant le statut et le message.
 */
export function isPasswordStrong(password) {
    // Check the length
    if (password.length < 8) {
        return [false, "Password must be at least 8 characters long"];
    }

    // Check the upper case
    if (!/[A-Z]/.test(password)) {
        return [false, "Password must contain at least one uppercase letter"];
    }

    // Check the lower case
    if (!/[a-z]/.test(password)) {
        return [false, "Password must contain at least one lowercase letter"];
    }

    // Check the numbers
    if (!/[0-9]/.test(password)) {
        return [false, "Password must contain at least one number"];
    }

    // Check special caracteres
    // We use a RegEx between two slash/.../
    const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialChars.test(password)) {
        return [false, "Password must contain at least one special character"];
    }

    return [true, "Password is valid"];
}

//Load the blacklist
export function loadBlacklist() {
    const filePath = path.join(__dirname, 'blacklist.txt');
    try {
        if (!fs.existsSync(filePath)) return [];
        const content = fs.readFileSync(filePath, 'utf-8');
        return content.split('\n').map(line => line.trim().toLowerCase()).filter(Boolean);
    } catch (err) {
        return [];
    }
}

//check if the password is clean
export function isUsernameSafe(name) {
    const lowerUsername = username.toLowerCase();
    const blacklist = loadBlacklist();

    for (const badWord of blacklist) {
        // Le \b en JS s'écrit de la même manière
        const pattern = new RegExp(`\\b${badWord.toLowerCase()}\\b`, 'i');
        if (pattern.test(lowerUsername) || badWord === lowerUsername) {
            return [false, `The word '${badWord}' isn't allowed in the username`];
        }
    }
    return [true, "Username safe"];
}

// Check the format of the password
export function isUsernameFormatValid(name) {
    const pattern = /^[a-zA-Z0-9_éèàêëîïôûùÇç]{3,20}$/;
    if (!pattern.test(username)) {
        return [false, "The username need to be between 3 and 20 characters long and contain only letters, numbers, or underscore"];
    }
    return [true, "Username format is valid"];
}

export function isPseudoCorrect(name) {
    const [isFormatValid, formatMsg] = isUsernameFormatValid(name);
    if (!isFormatValid) return [false, formatMsg];

    const [isSafe, safeMsg] = isUsernameSafe(name);
    if (!isSafe) return [false, safeMsg];

    return [true, "Username valid"];
}

// --- Exemple ---
const [isValid, message] = isPasswordStrong("MonMotDePasse123!");
console.log(isValid); // true
console.log(message); // "Password is valid"