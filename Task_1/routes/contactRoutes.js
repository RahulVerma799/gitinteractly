const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'rahul',
    database:'contacts'
});

// Helper function to execute MySQL queries
const queryDatabase = (query, params) => {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

// Creating a contact
router.post('/createContact', async (req, res) => {
    const { first_name, last_name, email, mobile_number, data_store } = req.body;

    //if datastore is not equal to databse then
    if (data_store !== 'DATABASE') {
        return res.status(400).json({
            success:false,
            message: 'Invalid data_store value' 
        });
    }

    try {
        const query = 'INSERT INTO contacts (first_name, last_name, email, mobile_number) VALUES (?, ?, ?, ?)';
        const dbResponse = await queryDatabase(query, [first_name, last_name, email, mobile_number]);
        res.json({
            success:true, 
            message: 'Contact created in Database',
            data: { id: dbResponse.insertId } 
        });
    } catch (err) {
        res.status(500).json({
            success:false,
            message:err.message });
    }
});

// get contact details by id
router.post('/getContact', async (req, res) => {
    const { contact_id, data_store } = req.body;

    if (data_store !== 'DATABASE') {
        return res.status(400).json({ 
            success:false,
            message: 'Invalid data_store value' });
    }

    try {
        const query = 'SELECT * FROM contacts WHERE id = ?';
        const dbResponse = await queryDatabase(query, [contact_id]);
        if (dbResponse.length > 0) {
            res.json({ 
                success:true, 
                message: 'contact successfully received', 
                data: dbResponse[0] });
        } else {
            res.status(404).json({ 
                success:false,
                message: 'Contact not found' });
        }
    } catch (err) {
        res.status(500).json({
            success:false,
            message: err.message });
    }
});

// Update a contact's email and mobile number
router.post('/updateContact', async (req, res) => {
    const { contact_id, new_email, new_mobile_number, data_store } = req.body;
     //if datastore is not equal to databse then
    if (data_store !== 'DATABASE') {
        return res.status(400).json({ 
            success:false,
            message: 'Invalid data_store value' });
    }

    try {
        const query = 'UPDATE contacts SET email = ?, mobile_number = ? WHERE id = ?';
        const dbResponse = await queryDatabase(query, [new_email, new_mobile_number, contact_id]);
        if (dbResponse.affectedRows > 0) {
            res.json({ 
                success:true,
                message: 'Contact updated in Database' });
        } else {
            res.status(404).json({
                success:false, 
                message: 'Contact not found' });
        }
    } catch (err) {
        res.status(500).json({ 
            success:false,
            message: err.message });
    }
});

// Delete a contact by ID
router.post('/deleteContact', async (req, res) => {
    const { contact_id, data_store } = req.body;
     //if datastore is not equal to database then
    if (data_store !== 'DATABASE') {
        return res.status(400).json({ 
            success:false,
            message: 'Invalid data_store value' });
    }

    try {
        const query = 'DELETE FROM contacts WHERE id = ?';
        const dbResponse = await queryDatabase(query, [contact_id]);
        if (dbResponse.affectedRows > 0) {
            res.json({ 
                success:true,
                message: 'Contact deleted Sucessfully' });
        } else {
            res.status(404).json({ 
                success:false,
                message: 'Contact not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
