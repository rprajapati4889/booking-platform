const db = require('../config/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const createUser = async (firstName, lastName, email, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    const query = `
      INSERT INTO users (first_name, last_name, email, password, verification_token)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [firstName, lastName, email, hashedPassword, verificationToken];
    
    const result = await db.query(query, params);
    return { id: result.insertId, verificationToken };
  } catch (error) {
    console.error('Error in createUser:', error);
    throw error;
  }
};

const findByEmail = async (email) => {
  try {
    console.log('Checking for email:', email);
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.query(query, [email]);
    console.log('Query result:', rows);
    return rows[0];
  } catch (error) {
    console.error('Error in findByEmail:', error);
    throw error;
  }
};

const verifyEmail = async (token) => {
  try {
    const query = `
      UPDATE users 
      SET is_verified = true, verification_token = NULL 
      WHERE verification_token = ?
    `;
    const [result] = await db.query(query, [token]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error in verifyEmail:', error);
    throw error;
  }
};

module.exports = {
  createUser,
  findByEmail,
  verifyEmail
};
