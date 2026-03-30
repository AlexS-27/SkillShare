/*
File : server/db_manager.js
Description : PostgreeSQL database manager. Contains SQL queries
for registration, login, and profile retrieval.
    Autor : Alex Kamano
Version : 1.0
Project : SkillShare
Date : 6 Mars 2026
*/
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { logInfo, logWarn, logError } from './logger.js';

// connexion to Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_ANON_PUBLIC;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Hashed the password, test the connexion to the database then post
 * @param {string} password
 * @param {string} name
 * @returns {[boolean, string]} A table with the status and the message
 */

export const register = async (name, password) => {

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
        const { data, error } = await supabase
            .from('users') // indicate the table
            .insert([
                { username: name, password: hashedPassword }
            ]) // give the data to the base
            .select();

        if (error) throw error;

        console.log("Account registered !");
        return { success: true, data: data };

    } catch (err) {
        console.error("Error during the inscription :", err.message);
        logError('DB_REGISTER_ERROR', `username="${name}" error="${err.message}"`);
        return { success: false, message: err.message };
    }
};

/**
 * Check if the password and pseudo are correct or exist
 * @param {string} password
 * @param {string} name
 * @returns {[boolean, string]} A table with the status and the message
 */

export const login = async (name, password) => {
    try {
        // 1.  get the user in the supabase by his name
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', name)
            .single(); // get one object

        if (error || !user) {
            return { success: false, message: "User or password incorrect" };
        }

        // 2. get the password send with the stocked hash
        // bcrypt gets automatically the salt and the cost of the hash in the DB
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign(
                { id: user.id_user, username: user.username },
                process.env.JWT_SECRET || 'ta_cle_secrete_super_secure',
                { expiresIn: '24h' }
            );

            // Never resent the hash password to the user
            delete user.password;
            return { success: true, data: user, token: token };
        } else {
            return { success: false, message: "User or password incorrect" };
        }

    } catch (err) {
        console.log("Login Error :",err.message);
        logError('DB_LOGIN_ERROR', `username="${name}" error="${err.message}"`);
        return { success: false, message: " Error during the inscription " };
    }
};

/**
 * Purchase a service: debit the buyer, credit the seller, record the transaction.
 *
 * @param {string} buyerId  - UUID of the buyer (id_user)
 * @param {string} serviceId - UUID of the service (id_service)
 * @returns {Object} { success: boolean, data?: { transaction, buyer_balance }, message?: string }
 */
export const purchaseService = async (buyerId, serviceId) => {
    try {
        // check if the service exists and is active
        const { data: service, error: serviceError } = await supabase
            .from('services')
            .select('id_service, title, price, active, id_seller')
            .eq('id_service', serviceId)
            .single();

        if (serviceError || !service) {
            logWarn('DB_PURCHASE_SERVICE_NOT_FOUND', `buyerId="${buyerId}" serviceId="${serviceId}"`);
            return { success: false, message: "Service not found" };
        }

        if (!service.active) {
            return { success: false, message: "Service is no longer available" };
        }

        // ensures users cant buy their own services
        if (service.id_seller === buyerId) {
            return { success: false, message: "You cannot buy your own service" };
        }

        // fetch buyer's balance
        const { data: buyer, error: buyerError } = await supabase
            .from('users')
            .select('id_user, username, balance')
            .eq('id_user', buyerId)
            .single();

        if (buyerError || !buyer) {
            logError('DB_PURCHASE_BUYER_NOT_FOUND', `buyerId="${buyerId}" serviceId="${serviceId}"`);
            return { success: false, message: "Buyer not found" };
        }

        if (buyer.balance < service.price) {
            return {
                success: false,
                message: `Insufficient balance. Required: ${service.price}, available: ${buyer.balance}`
            };
        }

        // debit the buyer
        const { error: debitError } = await supabase
            .from('users')
            .update({ balance: buyer.balance - service.price })
            .eq('id_user', buyerId);

        if (debitError) {
            console.error("Debit error:", debitError.message);
            logError('DB_PURCHASE_DEBIT_FAIL', `buyerId="${buyerId}" serviceId="${serviceId}" error="${debitError.message}"`);
            return { success: false, message: "Payment failed: could not debit buyer" };
        }

        // fetch the seller's current balance
        const { data: seller, error: sellerFetchError } = await supabase
            .from('users')
            .select('balance')
            .eq('id_user', service.id_seller)
            .single();

        if (sellerFetchError || !seller) {
            // attempts to refund the buyer before returning the error
            await supabase
                .from('users')
                .update({ balance: buyer.balance })
                .eq('id_user', buyerId);

            logError('DB_PURCHASE_SELLER_NOT_FOUND', `buyerId="${buyerId}" serviceId="${serviceId}" sellerId="${service.id_seller}" — buyer refunded`);
            return { success: false, message: "Payment failed: seller not found, buyer refunded" };
        }

        // credit the seller
        const { error: creditError } = await supabase
            .from('users')
            .update({ balance: seller.balance + service.price })
            .eq('id_user', service.id_seller);

        if (creditError) {
            // attempts to refund the buyer
            await supabase
                .from('users')
                .update({ balance: buyer.balance })
                .eq('id_user', buyerId);

            console.error("Credit error:", creditError.message);
            logError('DB_PURCHASE_CREDIT_FAIL', `buyerId="${buyerId}" serviceId="${serviceId}" sellerId="${service.id_seller}" error="${creditError.message}" — buyer refunded`);
            return { success: false, message: "Payment failed: could not credit seller, buyer refunded" };
        }

        // record the transaction
        const { data: transaction, error: transactionError } = await supabase
            .from('transactions')
            .insert([{
                amount_paid: service.price,
                buying_date:  new Date().toISOString(),
                id_buyer:     buyerId,
                id_service:   serviceId
            }])
            .select()
            .single();

        if (transactionError) {
            // money already moved — log the inconsistency but don't block the response
            console.error("Transaction record error (money already transferred):", transactionError.message);
            logError('DB_TRANSACTION_RECORD_FAIL',
                `buyerId="${buyerId}" serviceId="${serviceId}" amount=${service.price} — money transferred but transaction not recorded: ${transactionError.message}`
            );
        }

        console.log(`Purchase successful: buyer ${buyerId} bought service ${serviceId} for ${service.price}`);
        return {
            success: true,
            data: {
                transaction: transaction ?? null,
                buyer_balance: buyer.balance - service.price
            }
        };

    } catch (err) {
        console.error("Purchase error:", err.message);
        logError('DB_PURCHASE_UNEXPECTED_ERROR', `buyerId="${buyerId}" serviceId="${serviceId}" error="${err.message}"`);
        return { success: false, message: "An unexpected error occurred during the purchase" };
    }
};