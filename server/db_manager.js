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
const supabaseKey = process.env.SUPABASE_API_ANON_PUBLIC;
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

/**
 * Check if the password and pseudo are correct or exist
 * @param {string} password
 * @param {string} name
 * @returns {[boolean, string]} A table with the status and the message
 */

const login = async (name, password) => {
    try {
        // 1.  Get the user in the supabase by his name
        const { data: user, error } = await supabase
            .from('utilisateurs')
            .select('*')
            .eq('pseudo', name)
            .single(); // Get one object

        if (error || !user) {
            return { success: false, message: "User or password incorrect" };
        }

        // 2. Get the password send with the stocked hash
        // bcrypt get automaticly the salt and the cost of the hash in the DB
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // Never resent the hash password to the user
            delete user.password;
            return { success: true, data: user };
        } else {
            return { success: false, message: "User or password incorrect" };
        }

    } catch (err) {
        console.log("Login Error :",err.message);
        return { success: false, message: " Error during the inscription " };
    }
};

module.exports = {
    register,
    login
};