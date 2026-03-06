/**
 * Vérifie si le mot de passe est fort.
 * @param {string} password
 * @returns {[boolean, string]} Un tableau contenant le statut et le message.
 */

function isPasswordStrong(password) {
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

// --- Exemple ---
const [isValid, message] = isPasswordStrong("MonMotDePasse123!");
console.log(isValid); // true
console.log(message); // "Password is valid"