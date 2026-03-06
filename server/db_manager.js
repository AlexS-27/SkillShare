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

// Connexion to Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_SERVICE_ROLE;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Hashed the password, test the connexion to the database then post
 * @param {string} password
 * @param {string} name
 * @returns {[boolean, string]} A table with the status and the message
 */

const register = async (name, password) => {

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
        const { data, error } = await supabase
            .from('utilisateurs') // Indicate the table
            .insert([
                { pseudo: name, password: hashedPassword }
            ]) // Give the data to the base
            .select();

        if (error) throw error;

        console.log("Account registered !");
        return { success: true, data: data };

    } catch (err) {
        console.error("Error during the inscription :", err.message);
        return { success: false, message: err.message };
    }
};



module.exports = { register };