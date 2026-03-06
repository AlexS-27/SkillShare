const express = require('express');
const cors = require('cors');
const app = express();
const { register } = require('../db_manager'); // Import de ton fichier
const { isPasswordStrong } = require('../utils.js');

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Express!' });
});

// Ta route de test
app.post('/register', async (req, res) => {
    const { name, password } = req.body;

    // 1. Validation de sécurité locale
    const [isValid, message] = isPasswordStrong(password);
    if (!isValid) {
        return res.status(400).json({ success: false, message: message });
    }

    // Appel de ta fonction Supabase
    const result = await register(name, password);

    if (result.success) {
        res.status(201).json(result);
    } else {
        res.status(400).json(result);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});