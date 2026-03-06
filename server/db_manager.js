/*
File : server/db_manager.js
Description : PostgreeSQL database manager. Contains SQL queries
for registration, login, and profile retrieval.
    Autor : Alex Kamano
Version : 1.0
Project : SkillShare
Date : 6 Mars 2026
*/
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

// Remplace par tes vraies infos (idéalement via des variables d'environnement .env)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_SERVICE_ROLE;
const supabase = createClient(supabaseUrl, supabaseKey);

const register = async (name, password) => {

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
        // Avec Supabase, on utilise une syntaxe fluide au lieu du SQL brut
        const { data, error } = await supabase
            .from('utilisateurs') // Nom de ta table dans Supabase
            .insert([
                { pseudo: name, password: hashedPassword }
            ])
            .select();

        if (error) throw error;

        console.log("Compte créé avec succès !");
        return { success: true, data: data };

    } catch (err) {
        console.error("Erreur lors de l'inscription :", err.message);
        return { success: false, message: err.message };
    }
};



module.exports = { register };